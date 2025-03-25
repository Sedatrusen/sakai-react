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
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import MovementService from '../../../../../src/services/MovementService';
import BatchComponentService from '../../../../../src/services/BatchComponentService';
import { Movement, MovementCreateDTO, MovementType } from '../../../../../src/types/movement';
import { BatchComponent } from '../../../../../src/types/batch_component';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';

const Movements = () => {
    const { t } = useTranslation();
    let emptyMovement: MovementCreateDTO = {
        batch_component_id: undefined as any,
        serial_number: '',
        movement_type: 'Kullanım',
        quantity: 0,
        movement_date: new Date(),
        description: ''
    };

    const [movements, setMovements] = useState<Movement[]>([]);
    const [movementDialog, setMovementDialog] = useState(false);
    const [deleteMovementDialog, setDeleteMovementDialog] = useState(false);
    const [deleteMovementsDialog, setDeleteMovementsDialog] = useState(false);
    const [movement, setMovement] = useState<MovementCreateDTO>(emptyMovement);
    const [selectedMovements, setSelectedMovements] = useState<Movement[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [batchComponents, setBatchComponents] = useState<BatchComponent[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Movement[]>>(null);
    const { hasPermission } = useAuth();

    const loadData = useCallback(async () => {
        if (!hasPermission('STOCK_MOVEMENT_VIEW')) {
            return;
        }
        try {
            setLoading(true);
            const data = await MovementService.getMovements();
            setMovements(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:movements.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [t, hasPermission]);

    const loadBatchComponents = useCallback(async () => {
        try {
            const data = await BatchComponentService.getBatchComponents();
            setBatchComponents(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batch_components.loadError'),
                life: 3000
            });
        }
    }, [t]);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await Promise.all([loadData(), loadBatchComponents()]);
            } finally {
                setLoading(false);
            }
        };
        initializeData();
    }, [loadData, loadBatchComponents]);

    const openNew = () => {
        setMovement(emptyMovement);
        setSubmitted(false);
        setMovementDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMovementDialog(false);
    };

    const hideDeleteMovementDialog = () => {
        setDeleteMovementDialog(false);
    };

    const hideDeleteMovementsDialog = () => {
        setDeleteMovementsDialog(false);
    };

    const saveMovement = async () => {
        if (!hasPermission('STOCK_MOVEMENT_CREATE') && !hasPermission('STOCK_MOVEMENT_EDIT')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setSubmitted(true);

        if (movement.batch_component_id && movement.serial_number && movement.quantity > 0) {
            try {
                setLoading(true);
                if ((movement as any).movement_id) {
                    if (!hasPermission('STOCK_MOVEMENT_EDIT')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await MovementService.updateMovement(movement as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:movements.updateSuccess'),
                        life: 3000
                    });
                } else {
                    if (!hasPermission('STOCK_MOVEMENT_CREATE')) {
                        toast.current?.show({
                            severity: 'error',
                            summary: t('crud:common.error'),
                            detail: t('crud:common.no_permission'),
                            life: 3000
                        });
                        return;
                    }
                    await MovementService.createMovement(movement);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:movements.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setMovementDialog(false);
                setMovement(emptyMovement);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:movements.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editMovement = (movement: Movement) => {
        setMovement({ ...movement });
        setMovementDialog(true);
    };

    const confirmDeleteMovement = (movement: Movement) => {
        if (!hasPermission('STOCK_MOVEMENT_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setMovement(movement);
        setDeleteMovementDialog(true);
    };

    const deleteMovement = async () => {
        try {
            setLoading(true);
            if (movement.movement_id) {
                await MovementService.deleteMovement(movement.movement_id);
                setDeleteMovementDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:movements.deleteSuccess'),
                    life: 3000
                });
                await loadData();
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:movements.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteSelectedMovements = () => {
        if (!hasPermission('STOCK_MOVEMENT_DELETE')) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:common.no_permission'),
                life: 3000
            });
            return;
        }
        setDeleteMovementsDialog(true);
    };

    const deleteSelectedMovements = async () => {
        try {
            setLoading(true);
            await MovementService.deleteMovements(selectedMovements.map(m => m.movement_id));
            setDeleteMovementsDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:movements.deleteMultipleSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:movements.deleteMultipleError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputNumberChange = (e: any, name: keyof MovementCreateDTO) => {
        const val = e.value || undefined;
        let _movement = { ...movement };
        if (name === 'batch_component_id') {
            _movement[name] = val;
        } else if (name === 'quantity') {
            _movement[name] = val;
        }
        setMovement(_movement);
    };

    const onDateChange = (e: any) => {
        let _movement = { ...movement };
        _movement.movement_date = e.value;
        setMovement(_movement);
    };

    const getBatchComponentInfo = (batchComponentId: number) => {
        const batchComponent = batchComponents.find(bc => bc.batch_component_id === batchComponentId);
        if (!batchComponent) return '';
        return `${batchComponent.batch?.batch_number} - ${batchComponent.component?.name} (Kalan: ${batchComponent.remaining_quantity} ${batchComponent.component?.unit || 'adet'})`;
    };

    const onUpload = async (event: any) => {
        if (!hasPermission('STOCK_MOVEMENT_IMPORT')) {
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
            await MovementService.importMovements(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:movements.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:movements.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        if (!hasPermission('STOCK_MOVEMENT_EXPORT')) {
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
            const blob = await MovementService.exportMovements();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'movements.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:movements.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:movements.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const actionBodyTemplate = (rowData: Movement) => {
        return (
            <>
                {hasPermission('STOCK_MOVEMENT_EDIT') && (
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMovement(rowData)} />
                )}
                {hasPermission('STOCK_MOVEMENT_DELETE') && (
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteMovement(rowData)} />
                )}
            </>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {hasPermission('STOCK_MOVEMENT_CREATE') && (
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" onClick={openNew} />
                )}
                {hasPermission('STOCK_MOVEMENT_DELETE') && (
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={confirmDeleteSelectedMovements} 
                        disabled={!selectedMovements?.length} 
                    />
                )}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                {hasPermission('STOCK_MOVEMENT_IMPORT') && (
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
                {hasPermission('STOCK_MOVEMENT_EXPORT') && (
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                )}
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:movements.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const movementDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveMovement} loading={loading} />
        </>
    );

    const deleteMovementDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteMovementDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteMovement} loading={loading} />
        </>
    );

    const deleteMovementsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteMovementsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteSelectedMovements} loading={loading} />
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
                        value={movements} 
                        selection={selectedMovements} 
                        onSelectionChange={(e) => setSelectedMovements(e.value as Movement[])} 
                        dataKey="movement_id" 
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
                        <Column field="movement_id" header={t('crud:movements.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="batch_component_id" header={t('crud:movements.batch_component')} sortable style={{ minWidth: '12rem' }} body={(rowData) => getBatchComponentInfo(rowData.batch_component_id)}></Column>
                        <Column field="serial_number" header={t('crud:movements.serial_number')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="movement_type" header={t('crud:movements.movement_type')} sortable style={{ minWidth: '10rem' }} body={(rowData) => t(`crud:movements.movement_types.${rowData.movement_type}`)}></Column>
                        <Column field="quantity" header={t('crud:movements.quantity')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="movement_date" header={t('crud:movements.movement_date')} sortable style={{ minWidth: '10rem' }} body={(rowData) => new Date(rowData.movement_date).toLocaleDateString()}></Column>
                        <Column field="description" header={t('crud:movements.description')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={movementDialog} style={{ width: '450px' }} header={(movement as any).movement_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={movementDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="batch_component_id">{t('crud:movements.batch_component')}</label>
                            <Dropdown
                                id="batch_component_id"
                                value={movement.batch_component_id}
                                onChange={(e) => onInputNumberChange(e, 'batch_component_id')}
                                options={batchComponents}
                                optionLabel="displayName"
                                optionValue="batch_component_id"
                                placeholder={t('crud:movements.select_batch_component')}
                                className={classNames({ 'p-invalid': submitted && !movement.batch_component_id })}
                                filter
                                filterBy="displayName"
                                showClear
                            />
                            {submitted && !movement.batch_component_id && <small className="p-invalid">{t('crud:movements.batch_component_required')}</small>}
                            {movement.batch_component_id && (
                                <div className="mt-2 text-sm">
                                    <div className="font-bold">{t('crud:movements.batch_component_details')}:</div>
                                    <div>{getBatchComponentInfo(movement.batch_component_id)}</div>
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="serial_number">{t('crud:movements.serial_number')}</label>
                            <InputText id="serial_number" value={movement.serial_number} onChange={(e) => setMovement({ ...movement, serial_number: e.target.value })} className={classNames({ 'p-invalid': submitted && !movement.serial_number })} />
                            {submitted && !movement.serial_number && <small className="p-invalid">{t('crud:movements.serial_number_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="movement_type">{t('crud:movements.movement_type')}</label>
                            <Dropdown
                                id="movement_type"
                                value={movement.movement_type}
                                onChange={(e) => setMovement({ ...movement, movement_type: e.value })}
                                options={['Kullanım', 'Tüketim', 'Tedarik', 'Hurda']}
                                placeholder={t('crud:movements.select_movement_type')}
                                className={classNames({ 'p-invalid': submitted && !movement.movement_type })}
                            />
                            {submitted && !movement.movement_type && <small className="p-invalid">{t('crud:movements.movement_type_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="quantity">{t('crud:movements.quantity')}</label>
                            <InputNumber id="quantity" value={movement.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} className={classNames({ 'p-invalid': submitted && !movement.quantity })} />
                            {submitted && !movement.quantity && <small className="p-invalid">{t('crud:movements.quantity_required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="movement_date">{t('crud:movements.movement_date')}</label>
                            <Calendar id="movement_date" value={movement.movement_date} onChange={onDateChange} dateFormat="dd/mm/yy" />
                        </div>
                        <div className="field">
                            <label htmlFor="description">{t('crud:movements.description')}</label>
                            <InputText id="description" value={movement.description} onChange={(e) => setMovement({ ...movement, description: e.target.value })} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMovementDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteMovementDialogFooter} onHide={hideDeleteMovementDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:movements.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMovementsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteMovementsDialogFooter} onHide={hideDeleteMovementsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:movements.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Movements; 