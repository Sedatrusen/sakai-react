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
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../app/contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import BatchService, { Batch, BatchCreateDTO } from '../../../../../src/services/BatchService';

const Batches = () => {
    let emptyBatch: BatchCreateDTO = {
        product_id: 0,
        batch_number: '',
        manufacture_date: new Date(),
        expiration_date: new Date(),
        total_quantity: 0,
        used_quantity: 0,
        remaining_quantity: 0,
        price: 0
    };

    const [batches, setBatches] = useState<Batch[]>([]);
    const [batchDialog, setBatchDialog] = useState(false);
    const [deleteBatchDialog, setDeleteBatchDialog] = useState(false);
    const [deleteBatchesDialog, setDeleteBatchesDialog] = useState(false);
    const [batch, setBatch] = useState<BatchCreateDTO>(emptyBatch);
    const [selectedBatches, setSelectedBatches] = useState<Batch[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Batch[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await BatchService.getBatches();
            setBatches(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batches.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openNew = () => {
        setBatch(emptyBatch);
        setSubmitted(false);
        setBatchDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBatchDialog(false);
    };

    const hideDeleteBatchDialog = () => {
        setDeleteBatchDialog(false);
    };

    const hideDeleteBatchesDialog = () => {
        setDeleteBatchesDialog(false);
    };

    const saveBatch = async () => {
        setSubmitted(true);

        if (batch.batch_number.trim()) {
            try {
                setLoading(true);
                if ((batch as any).batch_id) {
                    await BatchService.updateBatch(batch as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:batches.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await BatchService.createBatch(batch);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:batches.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setBatchDialog(false);
                setBatch(emptyBatch);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:batches.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editBatch = (batch: Batch) => {
        setBatch({ ...batch });
        setBatchDialog(true);
    };

    const confirmDeleteBatch = (batch: Batch) => {
        setBatch(batch as any);
        setDeleteBatchDialog(true);
    };

    const deleteBatch = async () => {
        try {
            setLoading(true);
            await BatchService.deleteBatch((batch as any).batch_id);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:batches.deleteSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteBatchDialog(false);
            setBatch(emptyBatch);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batches.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        try {
            setLoading(true);
            const blob = await BatchService.exportBatches();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'batches.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:batches.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batches.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await BatchService.importBatches(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:batches.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:batches.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof BatchCreateDTO) => {
        const val = (e.target && e.target.value) || '';
        let _batch = { ...batch };
        if (name === 'batch_number') {
            _batch[name] = val;
        }
        setBatch(_batch);
    };

    const onInputNumberChange = (e: any, name: keyof BatchCreateDTO) => {
        const val = e.value || 0;
        let _batch = { ...batch };
        if (name === 'product_id' || name === 'total_quantity' || name === 'used_quantity' || name === 'remaining_quantity' || name === 'price') {
            _batch[name] = val;
        }
        setBatch(_batch);
    };

    const onDateChange = (e: any, name: keyof BatchCreateDTO) => {
        const val = e.value || new Date();
        let _batch = { ...batch };
        if (name === 'manufacture_date' || name === 'expiration_date') {
            _batch[name] = val;
        }
        setBatch(_batch);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="BATCH_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="BATCH_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteBatchesDialog(true)} 
                        disabled={!selectedBatches || !selectedBatches.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="BATCH_IMPORT">
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
                <Permission permissionKey="BATCH_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Batch) => {
        return (
            <>
                <Permission permissionKey="BATCH_UPDATE">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBatch(rowData)} />
                </Permission>
                <Permission permissionKey="BATCH_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBatch(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:batches.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const batchDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveBatch} loading={loading} />
        </>
    );

    const deleteBatchDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteBatchDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteBatch} loading={loading} />
        </>
    );

    const deleteBatchesDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteBatchesDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteBatch} loading={loading} />
        </>
    );

    const formatDate = (value: any) => {
        return value ? new Date(value).toLocaleDateString() : '';
    };

    const dateBodyTemplate = (rowData: any, field: keyof Batch) => {
        return formatDate(rowData[field]);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={batches}
                        selection={selectedBatches}
                        onSelectionChange={(e) => setSelectedBatches(e.value as Batch[])}
                        dataKey="batch_id"
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
                        <Column field="batch_id" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="product_id" header={t('crud:batches.product')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="batch_number" header={t('crud:batches.batchNumber')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="manufacture_date" header={t('crud:batches.manufactureDate')} body={(rowData) => dateBodyTemplate(rowData, 'manufacture_date')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="expiration_date" header={t('crud:batches.expirationDate')} body={(rowData) => dateBodyTemplate(rowData, 'expiration_date')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="total_quantity" header={t('crud:batches.totalQuantity')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="used_quantity" header={t('crud:batches.usedQuantity')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="remaining_quantity" header={t('crud:batches.remainingQuantity')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="price" header={t('crud:batches.price')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={batchDialog} style={{ width: '450px' }} header={(batch as any).batch_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={batchDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="batch_number">{t('crud:batches.batchNumber')}</label>
                            <InputText id="batch_number" value={batch.batch_number} onChange={(e) => onInputChange(e, 'batch_number')} required autoFocus className={classNames({ 'p-invalid': submitted && !batch.batch_number })} />
                            {submitted && !batch.batch_number && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="product_id">{t('crud:batches.product')}</label>
                            <InputNumber id="product_id" value={batch.product_id} onValueChange={(e) => onInputNumberChange(e, 'product_id')} />
                        </div>
                        <div className="field">
                            <label htmlFor="manufacture_date">{t('crud:batches.manufactureDate')}</label>
                            <Calendar id="manufacture_date" value={batch.manufacture_date} onChange={(e) => onDateChange(e, 'manufacture_date')} showIcon dateFormat="dd/mm/yy" />
                        </div>
                        <div className="field">
                            <label htmlFor="expiration_date">{t('crud:batches.expirationDate')}</label>
                            <Calendar id="expiration_date" value={batch.expiration_date} onChange={(e) => onDateChange(e, 'expiration_date')} showIcon dateFormat="dd/mm/yy" />
                        </div>
                        <div className="field">
                            <label htmlFor="total_quantity">{t('crud:batches.totalQuantity')}</label>
                            <InputNumber id="total_quantity" value={batch.total_quantity} onValueChange={(e) => onInputNumberChange(e, 'total_quantity')} />
                        </div>
                        <div className="field">
                            <label htmlFor="used_quantity">{t('crud:batches.usedQuantity')}</label>
                            <InputNumber id="used_quantity" value={batch.used_quantity} onValueChange={(e) => onInputNumberChange(e, 'used_quantity')} />
                        </div>
                        <div className="field">
                            <label htmlFor="remaining_quantity">{t('crud:batches.remainingQuantity')}</label>
                            <InputNumber id="remaining_quantity" value={batch.remaining_quantity} onValueChange={(e) => onInputNumberChange(e, 'remaining_quantity')} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">{t('crud:batches.price')}</label>
                            <InputNumber id="price" value={batch.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="TRY" locale="tr-TR" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBatchDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteBatchDialogFooter} onHide={hideDeleteBatchDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:batches.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBatchesDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteBatchesDialogFooter} onHide={hideDeleteBatchesDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:batches.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Batches; 