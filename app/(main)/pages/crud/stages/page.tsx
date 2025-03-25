'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import StageService from '../../../../../src/services/StageService';
import { Stage, StageCreateDTO } from '../../../../../src/types/stage';
import { useTranslation } from 'react-i18next';
import GeneratedModelService from '../../../../../src/services/GeneratedModelService';
import { GeneratedModel } from '../../../../../src/types/generated_model';

const Stages = () => {
    const { t } = useTranslation();
    
    let emptyStage: StageCreateDTO = {
        stage_name: '',
        generated_model_id: 0,
        stage_info: ''
    };

    const [stages, setStages] = useState<Stage[]>([]);
    const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]);
    const [stageDialog, setStageDialog] = useState(false);
    const [deleteStageDialog, setDeleteStageDialog] = useState(false);
    const [deleteStagesDialog, setDeleteStagesDialog] = useState(false);
    const [stage, setStage] = useState<StageCreateDTO>(emptyStage);
    const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Stage[]>>(null);
    const { hasPermission } = useAuth();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [stagesData, modelsData] = await Promise.all([
                StageService.getStages(),
                GeneratedModelService.getGeneratedModels()
            ]);
            setStages(stagesData);
            setGeneratedModels(modelsData);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stages.loadError'),
                life: 3000
            });
            setStages([]);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openNew = () => {
        setStage(emptyStage);
        setSubmitted(false);
        setStageDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStageDialog(false);
    };

    const hideDeleteStageDialog = () => {
        setDeleteStageDialog(false);
    };

    const hideDeleteStagesDialog = () => {
        setDeleteStagesDialog(false);
    };

    const saveStage = async () => {
        if (!hasPermission('STAGE_CREATE') && !hasPermission('STAGE_EDIT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setSubmitted(true);

        if (stage.stage_name && stage.generated_model_id) {
            try {
                setLoading(true);
                if ((stage as any).stage_id) {
                    if (!hasPermission('STAGE_EDIT')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await StageService.updateStage(stage as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:stages.updateSuccess'),
                        life: 3000
                    });
                } else {
                    if (!hasPermission('STAGE_CREATE')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await StageService.createStage(stage);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:stages.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setStageDialog(false);
                setStage(emptyStage);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:stages.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editStage = (stage: Stage) => {
        setStage({ ...stage });
        setStageDialog(true);
    };

    const confirmDeleteStage = (stage: Stage) => {
        if (!hasPermission('STAGE_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setStage(stage as any);
        setDeleteStageDialog(true);
    };

    const deleteStage = async () => {
        try {
            setLoading(true);
            if (deleteStagesDialog) {
                await Promise.all(selectedStages.map(s => StageService.deleteStage(s.stage_id)));
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:stages.deleteMultipleSuccess'),
                    life: 3000
                });
            } else {
                await StageService.deleteStage((stage as any).stage_id);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:stages.deleteSuccess'),
                    life: 3000
                });
            }
            await loadData();
            setDeleteStageDialog(false);
            setDeleteStagesDialog(false);
            setStage(emptyStage);
            setSelectedStages([]);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: deleteStagesDialog ? t('crud:stages.deleteMultipleError') : t('crud:stages.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        if (!hasPermission('STAGE_EXPORT')) {
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
            const blob = await StageService.exportStages();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stages.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stages.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stages.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        if (!hasPermission('STAGE_IMPORT')) {
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
            await StageService.importStages(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stages.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stages.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {hasPermission('STAGE_CREATE') && (
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" onClick={openNew} />
                )}
                {hasPermission('STAGE_DELETE') && (
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteStagesDialog(true)} 
                        disabled={!selectedStages || !selectedStages.length} 
                    />
                )}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                {hasPermission('STAGE_IMPORT') && (
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
                {hasPermission('STAGE_EXPORT') && (
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                )}
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Stage) => {
        return (
            <>
                {hasPermission('STAGE_EDIT') && (
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editStage(rowData)} />
                )}
                {hasPermission('STAGE_DELETE') && (
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteStage(rowData)} />
                )}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:stages.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const stageDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveStage} loading={loading} />
        </>
    );

    const deleteStageDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteStageDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteStage} loading={loading} />
        </>
    );

    const deleteStagesDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteStagesDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteStage} loading={loading} />
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
                        value={stages}
                        selection={selectedStages}
                        onSelectionChange={(e) => setSelectedStages(e.value as Stage[])}
                        dataKey="stage_id"
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
                        <Column field="stage_id" header={t('crud:stages.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="stage_name" header={t('crud:stages.name')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="stage_info" header={t('crud:stages.info')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column
                            field="generated_model_id"
                            header={t('crud:stages.generated_model')}
                            sortable
                            body={(rowData) => {
                                const model = generatedModels.find(m => m.generated_model_id === rowData.generated_model_id);
                                return model ? model.generated_model_name : '';
                            }}
                        ></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>

                    <Dialog visible={stageDialog} style={{ width: '450px' }} header={(stage as any).stage_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={stageDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="stage_name">{t('crud:stages.name')}</label>
                            <InputText id="stage_name" value={stage.stage_name} onChange={(e) => setStage({ ...stage, stage_name: e.target.value })} className={classNames({ 'p-invalid': submitted && !stage.stage_name })} />
                            {submitted && !stage.stage_name && <small className="p-invalid">{t('crud:stages.name_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="stage_info">{t('crud:stages.info')}</label>
                            <InputText id="stage_info" value={stage.stage_info} onChange={(e) => setStage({ ...stage, stage_info: e.target.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="generated_model_id">{t('crud:stages.generated_model')}</label>
                            <Dropdown
                                id="generated_model_id"
                                value={stage.generated_model_id}
                                options={generatedModels}
                                optionLabel="generated_model_name"
                                optionValue="generated_model_id"
                                onChange={(e) => setStage({ ...stage, generated_model_id: e.value })}
                                placeholder={t('crud:stages.select_model')}
                                className={classNames({ 'p-invalid': submitted && !stage.generated_model_id })}
                            />
                            {submitted && !stage.generated_model_id && <small className="p-invalid">{t('crud:stages.model_required')}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStageDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteStageDialogFooter} onHide={hideDeleteStageDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:stages.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStagesDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteStagesDialogFooter} onHide={hideDeleteStagesDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:stages.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Stages; 