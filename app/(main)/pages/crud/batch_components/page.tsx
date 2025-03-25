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
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import BatchComponentService from '../../../../../src/services/BatchComponentService';
import BatchService from '../../../../../src/services/BatchService';
import ComponentService from '../../../../../src/services/ComponentService';
import { BatchComponent, BatchComponentCreateDTO } from '../../../../../src/types/batch_component';
import { Batch } from '../../../../../src/services/BatchService';
import { Component } from '../../../../../src/types/component';
import { useTranslation } from 'react-i18next';
import LocationService from '../../../../../src/services/LocationService';
import { Location } from '../../../../../src/types/location';

const BatchComponents = () => {
    const { t } = useTranslation();
    let emptyBatchComponent: BatchComponentCreateDTO = {
        batch_id: 0,
        component_id: 0,
        expiration_date: new Date(),
        total_quantity: 0,
        used_quantity: 0,
        remaining_quantity: 0,
        price: 0,
        location_id: 1,
        state_id: 1
    };

    const [batchComponents, setBatchComponents] = useState<BatchComponent[]>([]);
    const [batchComponentDialog, setBatchComponentDialog] = useState(false);
    const [deleteBatchComponentDialog, setDeleteBatchComponentDialog] = useState(false);
    const [deleteBatchComponentsDialog, setDeleteBatchComponentsDialog] = useState(false);
    const [batchComponent, setBatchComponent] = useState<BatchComponentCreateDTO>(emptyBatchComponent);
    const [selectedBatchComponents, setSelectedBatchComponents] = useState<BatchComponent[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<BatchComponent[]>>(null);
    const { hasPermission } = useAuth();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await BatchComponentService.getBatchComponents();
            setBatchComponents(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batch_components.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [t]);

    const loadBatches = useCallback(async () => {
        try {
            const data = await BatchService.getBatches();
            setBatches(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batches.loadError'),
                life: 3000
            });
        }
    }, [t]);

    const loadComponents = useCallback(async () => {
        try {
            const data = await ComponentService.getComponents();
            setComponents(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:components.loadError'),
                life: 3000
            });
        }
    }, [t]);

    const loadLocations = useCallback(async () => {
        try {
            const data = await LocationService.getLocations();
            setLocations(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:locations.loadError'),
                life: 3000
            });
        }
    }, [t]);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await Promise.all([loadData(), loadBatches(), loadComponents(), loadLocations()]);
            } finally {
                setLoading(false);
            }
        };
        initializeData();
    }, [loadData, loadBatches, loadComponents, loadLocations]);

    const openNew = () => {
        setBatchComponent(emptyBatchComponent);
        setSubmitted(false);
        setBatchComponentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBatchComponentDialog(false);
    };

    const hideDeleteBatchComponentDialog = () => {
        setDeleteBatchComponentDialog(false);
    };

    const hideDeleteBatchComponentsDialog = () => {
        setDeleteBatchComponentsDialog(false);
    };

    const saveBatchComponent = async () => {
        setSubmitted(true);

        if (batchComponent.batch_id && batchComponent.component_id && 
            batchComponent.total_quantity >= 0 && 
            batchComponent.used_quantity >= 0 && 
            batchComponent.remaining_quantity >= 0 && 
            batchComponent.used_quantity <= batchComponent.total_quantity && 
            batchComponent.remaining_quantity === (batchComponent.total_quantity - batchComponent.used_quantity)) {
            try {
                setLoading(true);
                if ((batchComponent as any).batch_component_id) {
                    await BatchComponentService.updateBatchComponent(batchComponent as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:batch_components.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await BatchComponentService.createBatchComponent(batchComponent);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:batch_components.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setBatchComponentDialog(false);
                setBatchComponent(emptyBatchComponent);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:batch_components.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        } else {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batch_components.quantityError'),
                life: 3000
            });
        }
    };

    const editBatchComponent = (batchComponent: BatchComponent) => {
        setBatchComponent({ ...batchComponent });
        setBatchComponentDialog(true);
    };

    const confirmDeleteBatchComponent = (batchComponent: BatchComponent) => {
        setBatchComponent(batchComponent as any);
        setDeleteBatchComponentDialog(true);
    };

    const deleteBatchComponent = async () => {
        try {
            setLoading(true);
            if (deleteBatchComponentsDialog) {
                await Promise.all(selectedBatchComponents.map(bc => BatchComponentService.deleteBatchComponent(bc.batch_component_id)));
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:batch_components.deleteMultipleSuccess'),
                    life: 3000
                });
            } else {
                await BatchComponentService.deleteBatchComponent((batchComponent as any).batch_component_id);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:batch_components.deleteSuccess'),
                    life: 3000
                });
            }
            await loadData();
            setDeleteBatchComponentDialog(false);
            setDeleteBatchComponentsDialog(false);
            setBatchComponent(emptyBatchComponent);
            setSelectedBatchComponents([]);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: deleteBatchComponentsDialog ? t('crud:batch_components.deleteMultipleError') : t('crud:batch_components.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        try {
            setLoading(true);
            const blob = await BatchComponentService.exportBatchComponents();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'batch_components.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:batch_components.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batch_components.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await BatchComponentService.importBatchComponents(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:batch_components.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batch_components.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputNumberChange = (e: any, name: keyof BatchComponentCreateDTO) => {
        const val = e.value || 0;
        let _batchComponent = { ...batchComponent };
        if (name === 'batch_id' || name === 'component_id' || name === 'location_id' || name === 'state_id') {
            _batchComponent[name] = val;
        } else if (name === 'total_quantity') {
            _batchComponent.total_quantity = val;
            _batchComponent.remaining_quantity = val - _batchComponent.used_quantity;
        } else if (name === 'used_quantity') {
            _batchComponent.used_quantity = val;
            _batchComponent.remaining_quantity = _batchComponent.total_quantity - val;
        } else if (name === 'remaining_quantity') {
            _batchComponent.remaining_quantity = val;
            _batchComponent.used_quantity = _batchComponent.total_quantity - val;
        } else if (name === 'price') {
            _batchComponent.price = val;
        }
        setBatchComponent(_batchComponent);
    };

    const onDateChange = (e: any) => {
        let _batchComponent = { ...batchComponent };
        _batchComponent.expiration_date = e.value;
        setBatchComponent(_batchComponent);
    };

    const getBatchNumber = (batchId: number) => {
        const batch = batches.find(b => b.batch_id === batchId);
        return batch ? batch.batch_number : '';
    };

    const getComponentName = (componentId: number) => {
        const component = components.find(c => c.component_id === componentId);
        return component ? component.name : '';
    };

    const getLocationName = (locationId: number) => {
        const location = locations.find(l => l.location_id === locationId);
        return location ? location.name : '';
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="BATCH_COMPONENT_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="BATCH_COMPONENT_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteBatchComponentsDialog(true)} 
                        disabled={!selectedBatchComponents || !selectedBatchComponents.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="BATCH_COMPONENT_IMPORT">
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
                <Permission permissionKey="BATCH_COMPONENT_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: BatchComponent) => {
        return (
            <>
                <Permission permissionKey="BATCH_COMPONENT_EDIT">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBatchComponent(rowData)} />
                </Permission>
                <Permission permissionKey="BATCH_COMPONENT_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBatchComponent(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:batch_components.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const batchComponentDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveBatchComponent} loading={loading} />
        </>
    );

    const deleteBatchComponentDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteBatchComponentDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteBatchComponent} loading={loading} />
        </>
    );

    const deleteBatchComponentsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteBatchComponentsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteBatchComponent} loading={loading} />
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
                        value={batchComponents}
                        selection={selectedBatchComponents}
                        onSelectionChange={(e) => setSelectedBatchComponents(e.value as BatchComponent[])}
                        dataKey="batch_component_id"
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
                        <Column field="batch_component_id" header={t('crud:batch_components.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="batch_id" header={t('crud:batch_components.batch')} sortable style={{ minWidth: '10rem' }} body={(rowData) => getBatchNumber(rowData.batch_id)}></Column>
                        <Column field="component_id" header={t('crud:batch_components.component')} sortable style={{ minWidth: '10rem' }} body={(rowData) => getComponentName(rowData.component_id)}></Column>
                        <Column field="total_quantity" header={t('crud:batch_components.total_quantity')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="used_quantity" header={t('crud:batch_components.used_quantity')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="remaining_quantity" header={t('crud:batch_components.remaining_quantity')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="price" header={t('crud:batch_components.price')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="location_id" header={t('crud:batch_components.location')} sortable style={{ minWidth: '8rem' }} body={(rowData) => getLocationName(rowData.location_id)}></Column>
                        <Column field="state_id" header={t('crud:batch_components.state')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="expiration_date" header={t('crud:batch_components.expiration_date')} sortable style={{ minWidth: '10rem' }} body={(rowData) => new Date(rowData.expiration_date).toLocaleDateString()}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={batchComponentDialog} style={{ width: '450px' }} header={(batchComponent as any).batch_component_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={batchComponentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="batch_id">{t('crud:batch_components.batch')}</label>
                            <Dropdown
                                id="batch_id"
                                value={batchComponent.batch_id === 0 ? null : batchComponent.batch_id}
                                onChange={(e) => onInputNumberChange(e, 'batch_id')}
                                options={batches}
                                optionLabel="batch_number"
                                optionValue="batch_id"
                                placeholder={t('crud:batch_components.select_batch')}
                                className={classNames({ 'p-invalid': submitted && !batchComponent.batch_id })}
                                filter
                                filterBy="batch_number"
                                showClear
                            />
                            {submitted && !batchComponent.batch_id && <small className="p-invalid">{t('crud:batch_components.no_batch_selected')}</small>}
                            {batchComponent.batch_id && (
                                <div className="mt-2 text-sm">
                                    <div className="font-bold">{t('crud:batch_components.batch_details')}:</div>
                                    <div>{t('crud:batch_components.batch_number')}: {getBatchNumber(batchComponent.batch_id) || '-'}</div>
                                    <div>{t('crud:batch_components.batch_date')}: {batches.find(b => b.batch_id === batchComponent.batch_id)?.created_at ? new Date(batches.find(b => b.batch_id === batchComponent.batch_id)?.created_at || '').toLocaleDateString() : '-'}</div>
                                    <div>{t('crud:batch_components.batch_status')}: {batches.find(b => b.batch_id === batchComponent.batch_id)?.status || '-'}</div>
                                    <div>{t('crud:batch_components.batch_quantity')}: {batches.find(b => b.batch_id === batchComponent.batch_id)?.total_quantity || '-'}</div>
                                    <div>{t('crud:batch_components.batch_price')}: {batches.find(b => b.batch_id === batchComponent.batch_id)?.price ? `${batches.find(b => b.batch_id === batchComponent.batch_id)?.price} TL` : '-'}</div>
                                    <div>{t('crud:batch_components.batch_location')}: {batches.find(b => b.batch_id === batchComponent.batch_id)?.location || '-'}</div>
                                    {batches.find(b => b.batch_id === batchComponent.batch_id)?.notes && (
                                        <div>{t('crud:batch_components.batch_notes')}: {batches.find(b => b.batch_id === batchComponent.batch_id)?.notes}</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="component_id">{t('crud:batch_components.component')}</label>
                            <Dropdown
                                id="component_id"
                                value={batchComponent.component_id === 0 ? null : batchComponent.component_id}
                                onChange={(e) => onInputNumberChange(e, 'component_id')}
                                options={components}
                                optionLabel="name"
                                optionValue="component_id"
                                placeholder={t('crud:batch_components.select_component')}
                                className={classNames({ 'p-invalid': submitted && !batchComponent.component_id })}
                                filter
                                filterBy="name"
                                showClear
                            />
                            {submitted && !batchComponent.component_id && <small className="p-invalid">{t('crud:batch_components.no_component_selected')}</small>}
                            {batchComponent.component_id && (
                                <div className="mt-2 text-sm">
                                    <div className="font-bold">{t('crud:batch_components.component_details')}:</div>
                                    <div>{t('crud:batch_components.component_name')}: {getComponentName(batchComponent.component_id)}</div>
                                    <div>{t('crud:components.description')}: {components.find(c => c.component_id === batchComponent.component_id)?.description || '-'}</div>
                                    <div>{t('crud:components.model')}: {components.find(c => c.component_id === batchComponent.component_id)?.model_id || '-'}</div>
                                    <div>{t('crud:components.stock_critical_level')}: {components.find(c => c.component_id === batchComponent.component_id)?.stok_critical_level || '-'}</div>
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="expiration_date">{t('crud:batch_components.expiration_date')}</label>
                            <Calendar id="expiration_date" value={batchComponent.expiration_date} onChange={onDateChange} dateFormat="dd/mm/yy" />
                        </div>
                        <div className="field">
                            <label htmlFor="total_quantity">{t('crud:batch_components.total_quantity')}</label>
                            <InputNumber id="total_quantity" value={batchComponent.total_quantity} onValueChange={(e) => onInputNumberChange(e, 'total_quantity')} />
                        </div>
                        <div className="field">
                            <label htmlFor="used_quantity">{t('crud:batch_components.used_quantity')}</label>
                            <InputNumber id="used_quantity" value={batchComponent.used_quantity} onValueChange={(e) => onInputNumberChange(e, 'used_quantity')} />
                        </div>
                        <div className="field">
                            <label htmlFor="remaining_quantity">{t('crud:batch_components.remaining_quantity')}</label>
                            <InputNumber id="remaining_quantity" value={batchComponent.remaining_quantity} onValueChange={(e) => onInputNumberChange(e, 'remaining_quantity')} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">{t('crud:batch_components.price')}</label>
                            <InputNumber id="price" value={batchComponent.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="TRY" locale="tr-TR" />
                        </div>
                        <div className="field">
                            <label htmlFor="location_id">{t('crud:batch_components.location')}</label>
                            <Dropdown
                                id="location_id"
                                value={batchComponent.location_id === 0 ? null : batchComponent.location_id}
                                onChange={(e) => onInputNumberChange(e, 'location_id')}
                                options={locations}
                                optionLabel="name"
                                optionValue="location_id"
                                placeholder={t('crud:batch_components.select_location')}
                                className={classNames({ 'p-invalid': submitted && !batchComponent.location_id })}
                                filter
                                filterBy="name"
                                showClear
                            />
                            {submitted && !batchComponent.location_id && <small className="p-invalid">{t('crud:batch_components.location_required')}</small>}
                            {batchComponent.location_id && (
                                <div className="mt-2 text-sm">
                                    <div className="font-bold">{t('crud:batch_components.location_details')}:</div>
                                    <div>{t('crud:batch_components.location_name')}: {getLocationName(batchComponent.location_id)}</div>
                                    <div>{t('crud:batch_components.location_description')}: {locations.find(l => l.location_id === batchComponent.location_id)?.description || '-'}</div>
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="state_id">{t('crud:batch_components.state')}</label>
                            <InputNumber id="state_id" value={batchComponent.state_id} onValueChange={(e) => onInputNumberChange(e, 'state_id')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBatchComponentDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteBatchComponentDialogFooter} onHide={hideDeleteBatchComponentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:batch_components.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBatchComponentsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteBatchComponentsDialogFooter} onHide={hideDeleteBatchComponentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:batch_components.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default BatchComponents; 