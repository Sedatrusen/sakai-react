'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import ModelService, { ModelCreateDTO } from '../../../../../src/services/ModelService';
import BrandService from '../../../../../src/services/BrandService';
import { Model } from '../../../../../src/types/model';
import { Brand } from '../../../../../src/types/brand';

const Models = () => {
    let emptyModel: ModelCreateDTO = {
        brand_id: 0,
        name: '',
        model_name: ''
    };

    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [modelDialog, setModelDialog] = useState(false);
    const [deleteModelDialog, setDeleteModelDialog] = useState(false);
    const [deleteModelsDialog, setDeleteModelsDialog] = useState(false);
    const [model, setModel] = useState<ModelCreateDTO>(emptyModel);
    const [selectedModels, setSelectedModels] = useState<Model[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Model[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
        loadBrands();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ModelService.getModels();
            setModels(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:models.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const loadBrands = async () => {
        try {
            const data = await BrandService.getBrands();
            setBrands(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:brands.loadError'),
                life: 3000
            });
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await ModelService.importModels(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:models.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:models.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setModel(emptyModel);
        setModelDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setModelDialog(false);
    };

    const hideDeleteModelDialog = () => {
        setDeleteModelDialog(false);
    };

    const hideDeleteModelsDialog = () => {
        setDeleteModelsDialog(false);
    };

    const saveModel = async () => {
        setSubmitted(true);

        if (model.name.trim()) {
            try {
                setLoading(true);
                if ((model as any).model_id) {
                    await ModelService.updateModel(model as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:models.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await ModelService.createModel(model);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:models.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setModelDialog(false);
                setModel(emptyModel);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:models.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editModel = (model: Model) => {
        setModel({ ...model, model_name: model.name });
        setModelDialog(true);
    };

    const confirmDeleteModel = (model: Model) => {
        setModel({ ...model, model_name: model.name });
        setDeleteModelDialog(true);
    };

    const deleteModel = async () => {
        try {
            setLoading(true);
            await ModelService.deleteModel((model as any).model_id);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:models.deleteSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteModelDialog(false);
            setModel(emptyModel);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:models.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < models.length; i++) {
            if (models[i].model_id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        return Math.floor(Math.random() * 1000);
    };

    const exportCSV = async () => {
        try {
            setLoading(true);
            const blob = await ModelService.exportModels();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'models.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:models.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:models.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteModelsDialog(true);
    };

    const deleteSelectedModels = async () => {
        try {
            setLoading(true);
            await ModelService.deleteModels(selectedModels.map(model => model.model_id));
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:models.deleteMultipleSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteModelsDialog(false);
            setSelectedModels([]);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:models.deleteMultipleError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof ModelCreateDTO) => {
        const val = (e.target && e.target.value) || '';
        let _model = { ...model };
        if (name === 'name' || name === 'model_name') {
            _model[name] = val;
        }
        setModel(_model);
    };

    const onInputNumberChange = (e: any, name: keyof ModelCreateDTO) => {
        const val = e.value || 0;
        let _model = { ...model };
        if (name === 'brand_id') {
            _model[name] = val;
        }
        setModel(_model);
    };

    const getBrandName = (brandId: number) => {
        const brand = brands.find(b => b.brand_id === brandId);
        return brand ? brand.brand_name : '';
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="MODEL_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="MODEL_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={confirmDeleteSelected} 
                        disabled={!selectedModels || !selectedModels.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="MODEL_IMPORT">
                    <FileUpload 
                        mode="basic" 
                        accept=".csv" 
                        maxFileSize={1000000} 
                        chooseLabel={t('crud:common.import')} 
                        className="mr-2 inline-block" 
                        onUpload={onUpload}
                        auto
                    />
                </Permission>
                <Permission permissionKey="MODEL_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Model) => {
        return (
            <>
                <Permission permissionKey="MODEL_EDIT">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editModel(rowData)} />
                </Permission>
                <Permission permissionKey="MODEL_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteModel(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:models.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const modelDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveModel} />
        </>
    );

    const deleteModelDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteModelDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteModel} />
        </>
    );

    const deleteModelsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteModelsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedModels} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={models}
                        selection={selectedModels}
                        onSelectionChange={(e) => setSelectedModels(e.value as Model[])}
                        dataKey="model_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        globalFilter={globalFilter}
                        header={header}
                        responsiveLayout="scroll"
                        selectionMode="multiple"
                        loading={loading}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} className="text-center"></Column>
                        <Column field="model_id" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header={t('crud:models.name')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="brand_id" header={t('crud:models.brand')} sortable style={{ minWidth: '10rem' }} body={(rowData) => getBrandName(rowData.brand_id)}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={modelDialog} style={{ width: '450px' }} header={(model as any).model_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={modelDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="brand_id">{t('crud:models.brand')}</label>
                            <Dropdown
                                id="brand_id"
                                value={model.brand_id}
                                onChange={(e) => onInputNumberChange(e, 'brand_id')}
                                options={brands}
                                optionLabel="name"
                                optionValue="brand_id"
                                placeholder={t('crud:models.selectBrand')}
                                className={classNames({ 'p-invalid': submitted && !model.brand_id })}
                            />
                            {submitted && !model.brand_id && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">{t('crud:models.name')}</label>
                            <InputText 
                                id="name" 
                                value={model.name} 
                                onChange={(e) => onInputChange(e, 'name')} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !model.name })} 
                            />
                            {submitted && !model.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteModelDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteModelDialogFooter} onHide={hideDeleteModelDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:models.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteModelsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteModelsDialogFooter} onHide={hideDeleteModelsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:models.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Models; 