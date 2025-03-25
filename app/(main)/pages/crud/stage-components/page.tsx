'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../../contexts/AuthContext';
import StageComponentService from '../../../../../src/services/StageComponentService';
import StageService from '../../../../../src/services/StageService';
import ComponentService from '../../../../../src/services/ComponentService';
import { StageComponent, StageComponentCreateDTO } from '../../../../../src/types/stage_component';
import { Stage } from '../../../../../src/types/stage';
import { Component } from '../../../../../src/types/component';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';

const StageComponents = () => {
    const { t } = useTranslation();
    let emptyStageComponent: StageComponentCreateDTO = {
        stage_id: undefined as any,
        component_id: undefined as any,
        quantity: 0
    };

    const [stageComponents, setStageComponents] = useState<StageComponent[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [stageComponentDialog, setStageComponentDialog] = useState(false);
    const [deleteStageComponentDialog, setDeleteStageComponentDialog] = useState(false);
    const [deleteStageComponentsDialog, setDeleteStageComponentsDialog] = useState(false);
    const [stageComponent, setStageComponent] = useState<StageComponentCreateDTO>(emptyStageComponent);
    const [selectedStageComponents, setSelectedStageComponents] = useState<StageComponent[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<StageComponent[]>>(null);
    const { hasPermission } = useAuth();

    const loadData = useCallback(async () => {
        if (!hasPermission('STAGE_COMPONENT_VIEW')) {
            return;
        }
        try {
            setLoading(true);
            const [stageComponentsData, stagesData, componentsData] = await Promise.all([
                StageComponentService.getStageComponents(),
                StageService.getStages(),
                ComponentService.getComponents()
            ]);
            setStageComponents(stageComponentsData);
            setStages(stagesData);
            setComponents(componentsData);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_components.loadError'),
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
        setStageComponent(emptyStageComponent);
        setSubmitted(false);
        setStageComponentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStageComponentDialog(false);
    };

    const hideDeleteStageComponentDialog = () => {
        setDeleteStageComponentDialog(false);
    };

    const hideDeleteStageComponentsDialog = () => {
        setDeleteStageComponentsDialog(false);
    };

    const saveStageComponent = async () => {
        if (!hasPermission('STAGE_COMPONENT_CREATE') && !hasPermission('STAGE_COMPONENT_EDIT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setSubmitted(true);

        if (stageComponent.stage_id && stageComponent.component_id && stageComponent.quantity > 0) {
            try {
                setLoading(true);
                if ((stageComponent as any).stage_component_id) {
                    if (!hasPermission('STAGE_COMPONENT_EDIT')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await StageComponentService.updateStageComponent(stageComponent as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:stage_components.updateSuccess'),
                        life: 3000
                    });
                } else {
                    if (!hasPermission('STAGE_COMPONENT_CREATE')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await StageComponentService.createStageComponent(stageComponent);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:stage_components.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setStageComponentDialog(false);
                setStageComponent(emptyStageComponent);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:stage_components.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editStageComponent = (stageComponent: StageComponent) => {
        setStageComponent({ ...stageComponent });
        setStageComponentDialog(true);
    };

    const confirmDeleteStageComponent = (stageComponent: StageComponent) => {
        if (!hasPermission('STAGE_COMPONENT_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setStageComponent(stageComponent as any);
        setDeleteStageComponentDialog(true);
    };

    const deleteStageComponent = async () => {
        try {
            setLoading(true);
            if (stageComponent.stage_component_id) {
                await StageComponentService.deleteStageComponent(stageComponent.stage_component_id);
                setDeleteStageComponentDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:stage_components.deleteSuccess'),
                    life: 3000
                });
                await loadData();
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_components.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteSelectedStageComponents = () => {
        if (!hasPermission('STAGE_COMPONENT_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setDeleteStageComponentsDialog(true);
    };

    const deleteSelectedStageComponents = async () => {
        try {
            setLoading(true);
            await StageComponentService.deleteStageComponents(selectedStageComponents.map(sc => sc.stage_component_id));
            setDeleteStageComponentsDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_components.deleteMultipleSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_components.deleteMultipleError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputNumberChange = (e: any, name: keyof StageComponentCreateDTO) => {
        const val = e.value || undefined;
        let _stageComponent = { ...stageComponent };
        if (name === 'stage_id') {
            _stageComponent[name] = val;
        } else if (name === 'component_id') {
            _stageComponent[name] = val;
        } else if (name === 'quantity') {
            _stageComponent[name] = val;
        }
        setStageComponent(_stageComponent);
    };

    const onUpload = async (event: any) => {
        if (!hasPermission('STAGE_COMPONENT_IMPORT')) {
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
            await StageComponentService.importStageComponents(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_components.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_components.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        if (!hasPermission('STAGE_COMPONENT_EXPORT')) {
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
            const blob = await StageComponentService.exportStageComponents();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stage_components.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:stage_components.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:stage_components.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const actionBodyTemplate = (rowData: StageComponent) => {
        return (
            <>
                {hasPermission('STAGE_COMPONENT_EDIT') && (
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editStageComponent(rowData)} />
                )}
                {hasPermission('STAGE_COMPONENT_DELETE') && (
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteStageComponent(rowData)} />
                )}
            </>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {hasPermission('STAGE_COMPONENT_CREATE') && (
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" onClick={openNew} />
                )}
                {hasPermission('STAGE_COMPONENT_DELETE') && (
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={confirmDeleteSelectedStageComponents} 
                        disabled={!selectedStageComponents?.length} 
                    />
                )}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                {hasPermission('STAGE_COMPONENT_IMPORT') && (
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
                {hasPermission('STAGE_COMPONENT_EXPORT') && (
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                )}
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:stage_components.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const stageComponentDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveStageComponent} loading={loading} />
        </>
    );

    const deleteStageComponentDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteStageComponentDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteStageComponent} loading={loading} />
        </>
    );

    const deleteStageComponentsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteStageComponentsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteSelectedStageComponents} loading={loading} />
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
                        value={stageComponents} 
                        selection={selectedStageComponents} 
                        onSelectionChange={(e) => setSelectedStageComponents(e.value as StageComponent[])} 
                        dataKey="stage_component_id" 
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
                        <Column field="stage_component_id" header={t('crud:stage_components.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column 
                            field="stage_id" 
                            header={t('crud:stage_components.stage')} 
                            sortable 
                            style={{ minWidth: '12rem' }} 
                            body={(rowData) => {
                                const stage = stages.find(s => s.stage_id === rowData.stage_id);
                                return stage ? stage.stage_name : '';
                            }}
                        ></Column>
                        <Column 
                            field="component_id" 
                            header={t('crud:stage_components.component')} 
                            sortable 
                            style={{ minWidth: '12rem' }} 
                            body={(rowData) => {
                                const component = components.find(c => c.component_id === rowData.component_id);
                                return component ? component.name : '';
                            }}
                        ></Column>
                        <Column field="quantity" header={t('crud:stage_components.quantity')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={stageComponentDialog} style={{ width: '450px' }} header={(stageComponent as any).stage_component_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={stageComponentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="stage_id">{t('crud:stage_components.stage')}</label>
                            <Dropdown
                                id="stage_id"
                                value={stageComponent.stage_id}
                                onChange={(e) => onInputNumberChange(e, 'stage_id')}
                                options={stages}
                                optionLabel="stage_name"
                                optionValue="stage_id"
                                placeholder={t('crud:stage_components.select_stage')}
                                className={classNames({ 'p-invalid': submitted && !stageComponent.stage_id })}
                                filter
                                filterBy="stage_name"
                                showClear
                            />
                            {submitted && !stageComponent.stage_id && <small className="p-invalid">{t('crud:stage_components.stage_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="component_id">{t('crud:stage_components.component')}</label>
                            <Dropdown
                                id="component_id"
                                value={stageComponent.component_id}
                                onChange={(e) => onInputNumberChange(e, 'component_id')}
                                options={components}
                                optionLabel="name"
                                optionValue="component_id"
                                placeholder={t('crud:stage_components.select_component')}
                                className={classNames({ 'p-invalid': submitted && !stageComponent.component_id })}
                                filter
                                filterBy="name"
                                showClear
                            />
                            {submitted && !stageComponent.component_id && <small className="p-invalid">{t('crud:stage_components.component_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="quantity">{t('crud:stage_components.quantity')}</label>
                            <InputNumber 
                                id="quantity" 
                                value={stageComponent.quantity} 
                                onValueChange={(e) => onInputNumberChange(e, 'quantity')} 
                                className={classNames({ 'p-invalid': submitted && !stageComponent.quantity })} 
                                min={1}
                            />
                            {submitted && !stageComponent.quantity && <small className="p-invalid">{t('crud:stage_components.quantity_required')}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStageComponentDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteStageComponentDialogFooter} onHide={hideDeleteStageComponentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:stage_components.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteStageComponentsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteStageComponentsDialogFooter} onHide={hideDeleteStageComponentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:stage_components.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default StageComponents; 