'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import SupplierService, { SupplierCreateDTO, SupplierUpdateDTO } from '../../../../../src/services/SupplierService';
import { Supplier } from '../../../../../src/types/supplier';

const Suppliers = () => {
    let emptySupplier: SupplierCreateDTO = {
        name: '',
        contact_info: ''
    };

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierDialog, setSupplierDialog] = useState(false);
    const [deleteSupplierDialog, setDeleteSupplierDialog] = useState(false);
    const [deleteSuppliersDialog, setDeleteSuppliersDialog] = useState(false);
    const [supplier, setSupplier] = useState<SupplierCreateDTO>(emptySupplier);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Supplier[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const suppliersData = await SupplierService.getSuppliers();
            setSuppliers(suppliersData);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load data',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setSupplier(emptySupplier);
        setSubmitted(false);
        setSupplierDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSupplierDialog(false);
    };

    const hideDeleteSupplierDialog = () => {
        setDeleteSupplierDialog(false);
    };

    const hideDeleteSuppliersDialog = () => {
        setDeleteSuppliersDialog(false);
    };

    const saveSupplier = async () => {
        setSubmitted(true);

        if (supplier.name.trim()) {
            try {
                setLoading(true);
                if ((supplier as any).supplier_id) {
                    await SupplierService.updateSupplier(supplier as SupplierUpdateDTO);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: t('crud:common.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await SupplierService.createSupplier(supplier);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: t('crud:common.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setSupplierDialog(false);
                setSupplier(emptySupplier);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save supplier',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editSupplier = (supplier: Supplier) => {
        setSupplier({ ...supplier } as SupplierCreateDTO);
        setSupplierDialog(true);
    };

    const confirmDeleteSupplier = (supplier: Supplier) => {
        setSupplier(supplier as any);
        setDeleteSupplierDialog(true);
    };

    const deleteSupplier = async () => {
        try {
            setLoading(true);
            await SupplierService.deleteSupplier((supplier as any).supplier_id);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:common.deleteSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteSupplierDialog(false);
            setSupplier(emptySupplier);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete supplier',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        try {
            setLoading(true);
            const blob = await SupplierService.exportSuppliers();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'suppliers.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:common.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to export suppliers',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await SupplierService.importSuppliers(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:common.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to import suppliers',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof SupplierCreateDTO) => {
        const val = (e.target && e.target.value) || '';
        let _supplier = { ...supplier };
        _supplier[name] = val;
        setSupplier(_supplier);
    };

    const confirmDeleteSelected = () => {
        setDeleteSuppliersDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Permission permissionKey="SUPPLIER_CREATE">
                    <Button
                        label={t('crud:common.new')}
                        icon="pi pi-plus"
                        severity="success"
                        onClick={openNew}
                    />
                </Permission>
                <Permission permissionKey="SUPPLIER_DELETE">
                    <Button
                        label={t('crud:common.delete')}
                        icon="pi pi-trash"
                        severity="danger"
                        onClick={confirmDeleteSelected}
                        disabled={!selectedSuppliers || !selectedSuppliers.length}
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Permission permissionKey="SUPPLIER_IMPORT">
                    <FileUpload
                        mode="basic"
                        name="suppliers.csv"
                        url="/api/upload"
                        accept=".csv"
                        maxFileSize={1000000}
                        onUpload={onUpload}
                        chooseLabel={t('crud:common.import')}
                        auto
                    />
                </Permission>
                <Permission permissionKey="SUPPLIER_EXPORT">
                    <Button
                        label={t('crud:common.export')}
                        icon="pi pi-download"
                        severity="info"
                        onClick={exportCSV}
                    />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Supplier) => {
        return (
            <>
                <Permission permissionKey="SUPPLIER_UPDATE">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editSupplier(rowData)} />
                </Permission>
                <Permission permissionKey="SUPPLIER_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteSupplier(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:suppliers.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const supplierDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveSupplier} loading={loading} />
        </>
    );

    const deleteSupplierDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteSupplierDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteSupplier} loading={loading} />
        </>
    );

    const deleteSuppliersDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteSuppliersDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteSupplier} loading={loading} />
        </>
    );

    const onRowEditComplete = async (e: any) => {
        const { newData } = e;
        try {
            setLoading(true);
            await SupplierService.updateSupplier(newData);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:common.updateSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update supplier',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const textEditor = (options: any) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} className="p-inputtext-sm" />;
    };

    const textAreaEditor = (options: any) => {
        return <InputTextarea value={options.value} onChange={(e) => options.editorCallback(e.target.value)} className="p-inputtext-sm" rows={3} cols={20} />;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={suppliers}
                        selection={selectedSuppliers}
                        onSelectionChange={(e) => setSelectedSuppliers(e.value as Supplier[])}
                        dataKey="supplier_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        globalFilter={globalFilter}
                        header={header}
                        responsiveLayout="scroll"
                        selectionMode="multiple"
                        loading={loading}
                        editMode="row"
                        onRowEditComplete={onRowEditComplete}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} className="text-center"></Column>
                        <Column field="name" header={t('crud:suppliers.name')} sortable style={{ minWidth: '12rem' }} editor={textEditor}></Column>
                        <Column field="contact_info" header={t('crud:suppliers.contactInfo')} sortable style={{ minWidth: '16rem' }} editor={textAreaEditor}></Column>
                        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={supplierDialog} style={{ width: '450px' }} header={(supplier as any).supplier_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={supplierDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">{t('crud:suppliers.name')}</label>
                            <InputText id="name" value={supplier.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !supplier.name })} />
                            {submitted && !supplier.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="contact_info">{t('crud:suppliers.contactInfo')}</label>
                            <InputTextarea id="contact_info" value={supplier.contact_info} onChange={(e) => onInputChange(e, 'contact_info')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSupplierDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteSupplierDialogFooter} onHide={hideDeleteSupplierDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:suppliers.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSuppliersDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteSuppliersDialogFooter} onHide={hideDeleteSuppliersDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:suppliers.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Suppliers; 