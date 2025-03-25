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
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import GeneratedModelService from '../../../../../src/services/GeneratedModelService';
import { GeneratedModel, GeneratedModelCreateDTO } from '../../../../../src/types/generated_model';
import { useTranslation } from 'react-i18next';

const GeneratedModels = () => {
    const { t } = useTranslation();
    
    const modelTypes = [
        { label: t('crud:generated_models.model_types.main_product'), value: 1 },
        { label: t('crud:generated_models.model_types.sub_product'), value: 2 }
    ];

    let emptyGeneratedModel: GeneratedModelCreateDTO = {
        generated_model_name: '',
        generated_model_info: '',
        generated_model_type_id: 1
    };

    const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]);
    const [generatedModelDialog, setGeneratedModelDialog] = useState(false);
    const [deleteGeneratedModelDialog, setDeleteGeneratedModelDialog] = useState(false);
    const [deleteGeneratedModelsDialog, setDeleteGeneratedModelsDialog] = useState(false);
    const [generatedModel, setGeneratedModel] = useState<GeneratedModelCreateDTO>(emptyGeneratedModel);
    const [selectedGeneratedModels, setSelectedGeneratedModels] = useState<GeneratedModel[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<GeneratedModel[]>>(null);
    const { hasPermission } = useAuth();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await GeneratedModelService.getGeneratedModels();
            setGeneratedModels(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:generated_models.loadError'),
                life: 3000
            });
            setGeneratedModels([]);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openNew = () => {
        setGeneratedModel(emptyGeneratedModel);
        setSubmitted(false);
        setGeneratedModelDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGeneratedModelDialog(false);
    };

    const hideDeleteGeneratedModelDialog = () => {
        setDeleteGeneratedModelDialog(false);
    };

    const hideDeleteGeneratedModelsDialog = () => {
        setDeleteGeneratedModelsDialog(false);
    };

    const saveGeneratedModel = async () => {
        if (!hasPermission('GENERATED_MODEL_CREATE') && !hasPermission('GENERATED_MODEL_EDIT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setSubmitted(true);

        if (generatedModel.generated_model_name && generatedModel.generated_model_type_id) {
            try {
                setLoading(true);
                if ((generatedModel as any).generated_model_id) {
                    if (!hasPermission('GENERATED_MODEL_EDIT')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await GeneratedModelService.updateGeneratedModel(generatedModel as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:generated_models.updateSuccess'),
                        life: 3000
                    });
                } else {
                    if (!hasPermission('GENERATED_MODEL_CREATE')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await GeneratedModelService.createGeneratedModel(generatedModel);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:generated_models.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setGeneratedModelDialog(false);
                setGeneratedModel(emptyGeneratedModel);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:generated_models.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editGeneratedModel = (generatedModel: GeneratedModel) => {
        setGeneratedModel({ ...generatedModel });
        setGeneratedModelDialog(true);
    };

    const confirmDeleteGeneratedModel = (generatedModel: GeneratedModel) => {
        if (!hasPermission('GENERATED_MODEL_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setGeneratedModel(generatedModel as any);
        setDeleteGeneratedModelDialog(true);
    };

    const deleteGeneratedModel = async () => {
        try {
            setLoading(true);
            if (deleteGeneratedModelsDialog) {
                await Promise.all(selectedGeneratedModels.map(gm => GeneratedModelService.deleteGeneratedModel(gm.generated_model_id)));
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:generated_models.deleteMultipleSuccess'),
                    life: 3000
                });
            } else {
                await GeneratedModelService.deleteGeneratedModel((generatedModel as any).generated_model_id);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:generated_models.deleteSuccess'),
                    life: 3000
                });
            }
            await loadData();
            setDeleteGeneratedModelDialog(false);
            setDeleteGeneratedModelsDialog(false);
            setGeneratedModel(emptyGeneratedModel);
            setSelectedGeneratedModels([]);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: deleteGeneratedModelsDialog ? t('crud:generated_models.deleteMultipleError') : t('crud:generated_models.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        if (!hasPermission('GENERATED_MODEL_EXPORT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        try {
            setLoading(true);
            const blob = await GeneratedModelService.exportGeneratedModels();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'generated_models.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:generated_models.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:generated_models.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        if (!hasPermission('GENERATED_MODEL_IMPORT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        try {
            setLoading(true);
            await GeneratedModelService.importGeneratedModels(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:generated_models.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:generated_models.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputNumberChange = (e: any, name: keyof GeneratedModelCreateDTO) => {
        const val = e.value || 0;
        let _generatedModel = { ...generatedModel };
        if (name === 'generated_model_type_id') {
            _generatedModel[name] = val;
        }
        setGeneratedModel(_generatedModel);
    };

    const getModelTypeName = (typeId: number) => {
        switch (typeId) {
            case 1:
                return t('crud:generated_models.model_types.main_product');
            case 2:
                return t('crud:generated_models.model_types.sub_product');
            default:
                return '';
        }
    };

    const modelTypeBodyTemplate = (rowData: GeneratedModel) => {
        return getModelTypeName(rowData.generated_model_type_id);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {hasPermission('GENERATED_MODEL_CREATE') && (
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" onClick={openNew} />
                )}
                {hasPermission('GENERATED_MODEL_DELETE') && (
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteGeneratedModelsDialog(true)} 
                        disabled={!selectedGeneratedModels || !selectedGeneratedModels.length} 
                    />
                )}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                {hasPermission('GENERATED_MODEL_IMPORT') && (
                    <FileUpload 
                        mode="basic" 
                        accept=".csv" 
                        maxFileSize={1000000} 
                        chooseLabel={t('crud:common.import')} 
                        className="mr-2 inline-block" 
                        onUpload={onUpload}
                        auto
                    />
                )}
                {hasPermission('GENERATED_MODEL_EXPORT') && (
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                )}
            </div>
        );
    };

    const actionBodyTemplate = (rowData: GeneratedModel) => {
        return (
            <>
                {hasPermission('GENERATED_MODEL_EDIT') && (
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editGeneratedModel(rowData)} />
                )}
                {hasPermission('GENERATED_MODEL_DELETE') && (
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteGeneratedModel(rowData)} />
                )}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:generated_models.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const generatedModelDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveGeneratedModel} loading={loading} />
        </>
    );

    const deleteGeneratedModelDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteGeneratedModelDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteGeneratedModel} loading={loading} />
        </>
    );

    const deleteGeneratedModelsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteGeneratedModelsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteGeneratedModel} loading={loading} />
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
                        value={generatedModels}
                        selection={selectedGeneratedModels}
                        onSelectionChange={(e) => setSelectedGeneratedModels(e.value as GeneratedModel[])}
                        dataKey="generated_model_id"
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
                        <Column field="generated_model_id" header={t('crud:generated_models.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="generated_model_name" header={t('crud:generated_models.name')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="generated_model_info" header={t('crud:generated_models.info')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="generated_model_type_id" header={t('crud:generated_models.type')} body={modelTypeBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>

                    <Dialog visible={generatedModelDialog} style={{ width: '450px' }} header={(generatedModel as any).generated_model_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={generatedModelDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="generated_model_name">{t('crud:generated_models.name')}</label>
                            <InputText id="generated_model_name" value={generatedModel.generated_model_name} onChange={(e) => setGeneratedModel({ ...generatedModel, generated_model_name: e.target.value })} className={classNames({ 'p-invalid': submitted && !generatedModel.generated_model_name })} />
                            {submitted && !generatedModel.generated_model_name && <small className="p-invalid">{t('crud:generated_models.name_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="generated_model_info">{t('crud:generated_models.info')}</label>
                            <InputText id="generated_model_info" value={generatedModel.generated_model_info} onChange={(e) => setGeneratedModel({ ...generatedModel, generated_model_info: e.target.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="generated_model_type_id">{t('crud:generated_models.type')}</label>
                            <Dropdown
                                id="generated_model_type_id"
                                value={generatedModel.generated_model_type_id}
                                options={modelTypes}
                                onChange={(e) => setGeneratedModel({ ...generatedModel, generated_model_type_id: e.value })}
                                placeholder={t('crud:generated_models.select_type')}
                                className={classNames({ 'p-invalid': submitted && !generatedModel.generated_model_type_id })}
                            />
                            {submitted && !generatedModel.generated_model_type_id && <small className="p-invalid">{t('crud:generated_models.type_required')}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteGeneratedModelDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteGeneratedModelDialogFooter} onHide={hideDeleteGeneratedModelDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:generated_models.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteGeneratedModelsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteGeneratedModelsDialogFooter} onHide={hideDeleteGeneratedModelsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:generated_models.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default GeneratedModels; 