'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import StageGeneratedModelService from '../../../../../src/services/StageGeneratedModelService';
import StageService from '../../../../../src/services/StageService';
import GeneratedModelService from '../../../../../src/services/GeneratedModelService';
import { StageGeneratedModel, StageGeneratedModelCreateDTO } from '../../../../../src/types/stage_generated_model';
import { Stage } from '../../../../../src/types/stage';
import { GeneratedModel } from '../../../../../src/types/generated_model';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';

const StageGeneratedModels = () => {
    const { t } = useTranslation();
    let emptyStageGeneratedModel: StageGeneratedModelCreateDTO = {
        stage_id: undefined as any,
        generated_model_id: undefined as any,
        quantity: 0
    };

    const [stageGeneratedModels, setStageGeneratedModels] = useState<StageGeneratedModel[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]);
    const [stageGeneratedModelDialog, setStageGeneratedModelDialog] = useState(false);
    const [deleteStageGeneratedModelDialog, setDeleteStageGeneratedModelDialog] = useState(false);
    const [deleteStageGeneratedModelsDialog, setDeleteStageGeneratedModelsDialog] = useState(false);
    const [stageGeneratedModel, setStageGeneratedModel] = useState<StageGeneratedModel | StageGeneratedModelCreateDTO>(emptyStageGeneratedModel);
    const [selectedStageGeneratedModels, setSelectedStageGeneratedModels] = useState<StageGeneratedModel[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<StageGeneratedModel[]>>(null);
    const { hasPermission } = useAuth();

    useEffect(() => {
        console.log('Stage Generated Models Page - User Permissions:', {
            hasViewPermission: hasPermission('STAGE_GENERATED_MODEL_VIEW'),
            hasCreatePermission: hasPermission('STAGE_GENERATED_MODEL_CREATE'),
            hasEditPermission: hasPermission('STAGE_GENERATED_MODEL_EDIT'),
            hasDeletePermission: hasPermission('STAGE_GENERATED_MODEL_DELETE'),
            hasImportPermission: hasPermission('STAGE_GENERATED_MODEL_IMPORT'),
            hasExportPermission: hasPermission('STAGE_GENERATED_MODEL_EXPORT')
        });
    }, [hasPermission]);

    const loadData = useCallback(async () => {
        console.log('loadData called, checking view permission');
        if (!hasPermission('STAGE_GENERATED_MODEL_VIEW')) {
            console.log('No view permission, returning');
            return;
        }
        try {
            setLoading(true);
            const [stageGeneratedModelsData, stagesData, generatedModelsData] = await Promise.all([
                StageGeneratedModelService.getStageGeneratedModels(),
                StageService.getStages(),
                GeneratedModelService.getGeneratedModels()
            ]);
            console.log('Data loaded:', {
                stageGeneratedModels: stageGeneratedModelsData,
                stages: stagesData,
                generatedModels: generatedModelsData
            });
            setStageGeneratedModels(stageGeneratedModelsData);
            setStages(stagesData);
            setGeneratedModels(generatedModelsData);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_generated_models.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [t, hasPermission]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openNew = () => {
        setStageGeneratedModel(emptyStageGeneratedModel);
        setSubmitted(false);
        setStageGeneratedModelDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStageGeneratedModelDialog(false);
    };

    const hideDeleteStageGeneratedModelDialog = () => {
        setDeleteStageGeneratedModelDialog(false);
    };

    const hideDeleteStageGeneratedModelsDialog = () => {
        setDeleteStageGeneratedModelsDialog(false);
    };

    const saveStageGeneratedModel = async () => {
        if (!hasPermission('STAGE_GENERATED_MODEL_CREATE') && !hasPermission('STAGE_GENERATED_MODEL_EDIT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setSubmitted(true);

        if ((stageGeneratedModel as StageGeneratedModel).stage_generated_model_id) {
            if (!hasPermission('STAGE_GENERATED_MODEL_EDIT')) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:common.no_permission'),
                    life: 3000
                });
                return;
            }
            await StageGeneratedModelService.updateStageGeneratedModel(stageGeneratedModel as StageGeneratedModel);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_generated_models.updateSuccess'),
                life: 3000
            });
        } else {
            if (!hasPermission('STAGE_GENERATED_MODEL_CREATE')) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:common.no_permission'),
                    life: 3000
                });
                return;
            }
            await StageGeneratedModelService.createStageGeneratedModel(stageGeneratedModel as StageGeneratedModelCreateDTO);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_generated_models.createSuccess'),
                life: 3000
            });
        }
        await loadData();
        setStageGeneratedModelDialog(false);
        setStageGeneratedModel(emptyStageGeneratedModel);
    };

    const editStageGeneratedModel = (stageGeneratedModel: StageGeneratedModel) => {
        setStageGeneratedModel({ ...stageGeneratedModel });
        setStageGeneratedModelDialog(true);
    };

    const confirmDeleteStageGeneratedModel = (stageGeneratedModel: StageGeneratedModel) => {
        if (!hasPermission('STAGE_GENERATED_MODEL_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setStageGeneratedModel(stageGeneratedModel as any);
        setDeleteStageGeneratedModelDialog(true);
    };

    const deleteStageGeneratedModel = async () => {
        try {
            setLoading(true);
            if ((stageGeneratedModel as StageGeneratedModel).stage_generated_model_id) {
                await StageGeneratedModelService.deleteStageGeneratedModel((stageGeneratedModel as StageGeneratedModel).stage_generated_model_id);
                setDeleteStageGeneratedModelDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:stage_generated_models.deleteSuccess'),
                    life: 3000
                });
                await loadData();
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_generated_models.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteSelectedStageGeneratedModels = () => {
        if (!hasPermission('STAGE_GENERATED_MODEL_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setDeleteStageGeneratedModelsDialog(true);
    };

    const deleteSelectedStageGeneratedModels = async () => {
        try {
            setLoading(true);
            await StageGeneratedModelService.deleteStageGeneratedModels(selectedStageGeneratedModels.map(sgm => sgm.stage_generated_model_id));
            setDeleteStageGeneratedModelsDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_generated_models.deleteMultipleSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_generated_models.deleteMultipleError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputNumberChange = (e: any, name: keyof StageGeneratedModelCreateDTO) => {
        const val = e.value || undefined;
        let _stageGeneratedModel = { ...stageGeneratedModel };
        if (name === 'stage_id') {
            _stageGeneratedModel[name] = val;
        } else if (name === 'generated_model_id') {
            _stageGeneratedModel[name] = val;
        } else if (name === 'quantity') {
            _stageGeneratedModel[name] = val;
        }
        setStageGeneratedModel(_stageGeneratedModel);
    };

    const onUpload = async (event: any) => {
        if (!hasPermission('STAGE_GENERATED_MODEL_IMPORT')) {
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
            await StageGeneratedModelService.importStageGeneratedModels(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_generated_models.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_generated_models.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        if (!hasPermission('STAGE_GENERATED_MODEL_EXPORT')) {
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
            const blob = await StageGeneratedModelService.exportStageGeneratedModels();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stage_generated_models.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_generated_models.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_generated_models.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const actionBodyTemplate = (rowData: StageGeneratedModel) => {
        const canEdit = hasPermission('STAGE_GENERATED_MODEL_EDIT');
        const canDelete = hasPermission('STAGE_GENERATED_MODEL_DELETE');
        console.log('Action buttons permissions:', { canEdit, canDelete });
        
        return (
            <>
                {canEdit && (
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editStageGeneratedModel(rowData)} />
                )}
                {canDelete && (
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteStageGeneratedModel(rowData)} />
                )}
            </>
        );
    };

    const leftToolbarTemplate = () => {
        const canCreate = hasPermission('STAGE_GENERATED_MODEL_CREATE');
        const canDelete = hasPermission('STAGE_GENERATED_MODEL_DELETE');
        console.log('Left toolbar permissions:', { canCreate, canDelete });
        
        return (
            <div className="flex flex-wrap gap-2">
                {canCreate && (
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" onClick={openNew} />
                )}
                {canDelete && (
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={confirmDeleteSelectedStageGeneratedModels} 
                        disabled={!selectedStageGeneratedModels?.length} 
                    />
                )}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        const canImport = hasPermission('STAGE_GENERATED_MODEL_IMPORT');
        const canExport = hasPermission('STAGE_GENERATED_MODEL_EXPORT');
        console.log('Right toolbar permissions:', { canImport, canExport });
        
        return (
            <div className="flex">
                {canImport && (
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
                {canExport && (
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                )}
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:stage_generated_models.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const stageGeneratedModelDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveStageGeneratedModel} loading={loading} />
        </>
    );

    const deleteStageGeneratedModelDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteStageGeneratedModelDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteStageGeneratedModel} loading={loading} />
        </>
    );

    const deleteStageGeneratedModelsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteStageGeneratedModelsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteSelectedStageGeneratedModels} loading={loading} />
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
                        value={stageGeneratedModels} 
                        selection={selectedStageGeneratedModels} 
                        onSelectionChange={(e) => setSelectedStageGeneratedModels(e.value as StageGeneratedModel[])} 
                        dataKey="stage_generated_model_id" 
                        paginator 
                        rows={10} 
                        rowsPerPageOptions={[5, 10, 25]} 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" 
                        globalFilter={globalFilter} 
                        header={header} 
                        responsiveLayout="scroll" 
                        emptyMessage={t('crud:common.no_records')} 
                        loading={loading}
                        selectionMode="multiple"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} className="text-center"></Column>
                        <Column field="stage_generated_model_id" header={t('crud:stage_generated_models.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column 
                            field="stage_id" 
                            header={t('crud:stage_generated_models.stage')} 
                            sortable 
                            style={{ minWidth: '12rem' }} 
                            body={(rowData) => {
                                const stage = stages.find(s => s.stage_id === rowData.stage_id);
                                return stage ? stage.stage_name : '';
                            }}
                        ></Column>
                        <Column 
                            field="generated_model_id" 
                            header={t('crud:stage_generated_models.generated_model')} 
                            sortable 
                            style={{ minWidth: '12rem' }} 
                            body={(rowData) => {
                                const generatedModel = generatedModels.find(gm => gm.generated_model_id === rowData.generated_model_id);
                                return generatedModel ? generatedModel.generated_model_name : '';
                            }}
                        ></Column>
                        <Column field="quantity" header={t('crud:stage_generated_models.quantity')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={stageGeneratedModelDialog} style={{ width: '450px' }} header={(stageGeneratedModel as any).stage_generated_model_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={stageGeneratedModelDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="stage_id">{t('crud:stage_generated_models.stage')}</label>
                            <Dropdown
                                id="stage_id"
                                value={stageGeneratedModel.stage_id}
                                onChange={(e) => onInputNumberChange(e, 'stage_id')}
                                options={stages}
                                optionLabel="stage_name"
                                optionValue="stage_id"
                                placeholder={t('crud:stage_generated_models.select_stage')}
                                className={classNames({ 'p-invalid': submitted && !stageGeneratedModel.stage_id })}
                                filter
                                filterBy="stage_name"
                                showClear
                            />
                            {submitted && !stageGeneratedModel.stage_id && <small className="p-invalid">{t('crud:stage_generated_models.stage_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="generated_model_id">{t('crud:stage_generated_models.generated_model')}</label>
                            <Dropdown
                                id="generated_model_id"
                                value={stageGeneratedModel.generated_model_id}
                                onChange={(e) => onInputNumberChange(e, 'generated_model_id')}
                                options={generatedModels}
                                optionLabel="generated_model_name"
                                optionValue="generated_model_id"
                                placeholder={t('crud:stage_generated_models.select_generated_model')}
                                className={classNames({ 'p-invalid': submitted && !stageGeneratedModel.generated_model_id })}
                                filter
                                filterBy="generated_model_name"
                                showClear
                            />
                            {submitted && !stageGeneratedModel.generated_model_id && <small className="p-invalid">{t('crud:stage_generated_models.generated_model_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="quantity">{t('crud:stage_generated_models.quantity')}</label>
                            <InputNumber 
                                id="quantity" 
                                value={stageGeneratedModel.quantity} 
                                onValueChange={(e) => onInputNumberChange(e, 'quantity')} 
                                className={classNames({ 'p-invalid': submitted && !stageGeneratedModel.quantity })} 
                                min={1}
                            />
                            {submitted && !stageGeneratedModel.quantity && <small className="p-invalid">{t('crud:stage_generated_models.quantity_required')}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStageGeneratedModelDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteStageGeneratedModelDialogFooter} onHide={hideDeleteStageGeneratedModelDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:stage_generated_models.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStageGeneratedModelsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteStageGeneratedModelsDialogFooter} onHide={hideDeleteStageGeneratedModelsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:stage_generated_models.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default StageGeneratedModels; 