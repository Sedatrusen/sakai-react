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
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../app/contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';

interface Model {
    model_id: number;
    brand_id: number;
    name: string;
    model_name: string;
    is_deleted: boolean;
}

const Models = () => {
    let emptyModel: Model = {
        model_id: 0,
        brand_id: 0,
        name: '',
        model_name: '',
        is_deleted: false
    };

    const [models, setModels] = useState<Model[]>([]);
    const [modelDialog, setModelDialog] = useState(false);
    const [deleteModelDialog, setDeleteModelDialog] = useState(false);
    const [deleteModelsDialog, setDeleteModelsDialog] = useState(false);
    const [model, setModel] = useState<Model>(emptyModel);
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
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to fetch models
            // const data = await ModelService.getModels();
            // setModels(data);
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

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            // TODO: Implement API call to import models
            // await ModelService.importModels(event.files[0]);
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
        setSubmitted(false);
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

    const saveModel = () => {
        setSubmitted(true);

        if (model.model_name.trim()) {
            let _models = [...models];
            let _model = { ...model };
            
            if (model.model_id) {
                const index = findIndexById(model.model_id);
                _models[index] = _model;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Model Updated',
                    life: 3000
                });
            } else {
                _model.model_id = createId();
                _models.push(_model);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Model Created',
                    life: 3000
                });
            }

            setModels(_models);
            setModelDialog(false);
            setModel(emptyModel);
        }
    };

    const editModel = (model: Model) => {
        setModel({ ...model });
        setModelDialog(true);
    };

    const confirmDeleteModel = (model: Model) => {
        setModel(model);
        setDeleteModelDialog(true);
    };

    const deleteModel = () => {
        let _models = models.filter((val) => val.model_id !== model.model_id);
        setModels(_models);
        setDeleteModelDialog(false);
        setModel(emptyModel);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Model Deleted',
            life: 3000
        });
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

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteModelsDialog(true);
    };

    const deleteSelectedModels = () => {
        let _models = models.filter((val) => !selectedModels.includes(val));
        setModels(_models);
        setDeleteModelsDialog(false);
        setSelectedModels([]);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Models Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Model) => {
        const val = (e.target && e.target.value) || '';
        let _model = { ...model };
        if (name === 'model_name') {
            _model[name] = val;
        }
        setModel(_model);
    };

    const onInputNumberChange = (e: any, name: keyof Model) => {
        const val = e.value || 0;
        let _model = { ...model };
        if (name === 'brand_id') {
            _model[name] = val;
        }
        setModel(_model);
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
                        onClick={() => setDeleteModelsDialog(true)} 
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editModel(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteModel(rowData)} />
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
                        <Column field="brand_id" header={t('crud:models.brand')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={modelDialog} style={{ width: '450px' }} header={(model as any).model_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={modelDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">{t('crud:models.name')}</label>
                            <InputText id="name" value={model.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.name })} />
                            {submitted && !model.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="brand_id">{t('crud:models.brand')}</label>
                            <InputNumber id="brand_id" value={model.brand_id} onValueChange={(e) => onInputNumberChange(e, 'brand_id')} />
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