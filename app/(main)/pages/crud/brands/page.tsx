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
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import BrandService, { BrandCreateDTO } from '../../../../../src/services/BrandService';
import { Brand } from '../../../../../src/types/brand';

const Brands = () => {
    let emptyBrand: BrandCreateDTO = {
        name: ''
    };

    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandDialog, setBrandDialog] = useState(false);
    const [deleteBrandDialog, setDeleteBrandDialog] = useState(false);
    const [deleteBrandsDialog, setDeleteBrandsDialog] = useState(false);
    const [brand, setBrand] = useState<BrandCreateDTO>(emptyBrand);
    const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Brand[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await BrandService.getBrands();
            setBrands(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:brands.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await BrandService.importBrands(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:brands.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:brands.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setBrand(emptyBrand);
        setSubmitted(false);
        setBrandDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBrandDialog(false);
    };

    const hideDeleteBrandDialog = () => {
        setDeleteBrandDialog(false);
    };

    const hideDeleteBrandsDialog = () => {
        setDeleteBrandsDialog(false);
    };

    const saveBrand = async () => {
        setSubmitted(true);

        if (brand.name.trim()) {
            try {
                setLoading(true);
                if ((brand as any).brand_id) {
                    await BrandService.updateBrand(brand as any);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:brands.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await BrandService.createBrand(brand);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:brands.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setBrandDialog(false);
                setBrand(emptyBrand);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:brands.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editBrand = (brand: Brand) => {
        setBrand({ ...brand });
        setBrandDialog(true);
    };

    const confirmDeleteBrand = (brand: Brand) => {
        setBrand(brand);
        setDeleteBrandDialog(true);
    };

    const deleteBrand = async () => {
        try {
            setLoading(true);
            await BrandService.deleteBrand((brand as any).brand_id);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:brands.deleteSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteBrandDialog(false);
            setBrand(emptyBrand);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:brands.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < brands.length; i++) {
            if (brands[i].brand_id === id) {
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
            const blob = await BrandService.exportBrands();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'brands.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:brands.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:brands.exportError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteBrandsDialog(true);
    };

    const deleteSelectedBrands = async () => {
        try {
            setLoading(true);
            await BrandService.deleteBrands(selectedBrands.map(brand => brand.brand_id));
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:brands.deleteMultipleSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteBrandsDialog(false);
            setSelectedBrands([]);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:brands.deleteMultipleError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Brand) => {
        const val = (e.target && e.target.value) || '';
        let _brand = { ...brand };
        if (name === 'name') {
            _brand[name] = val;
        }
        setBrand(_brand);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="BRAND_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="BRAND_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteBrandsDialog(true)} 
                        disabled={!selectedBrands || !selectedBrands.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="BRAND_IMPORT">
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
                <Permission permissionKey="BRAND_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Brand) => {
        return (
            <>
                <Permission permissionKey="BRAND_EDIT">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBrand(rowData)} />
                </Permission>
                <Permission permissionKey="BRAND_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBrand(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:brands.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const brandDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveBrand} loading={loading} />
        </>
    );

    const deleteBrandDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteBrandDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteBrand} loading={loading} />
        </>
    );

    const deleteBrandsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteBrandsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteSelectedBrands} loading={loading} />
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
                        value={brands}
                        selection={selectedBrands}
                        onSelectionChange={(e) => setSelectedBrands(e.value as Brand[])}
                        dataKey="brand_id"
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
                        <Column field="brand_id" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header={t('crud:brands.name')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={brandDialog} style={{ width: '450px' }} header={(brand as any).brand_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={brandDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">{t('crud:brands.name')}</label>
                            <InputText id="name" value={brand.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !brand.name })} />
                            {submitted && !brand.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBrandDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteBrandDialogFooter} onHide={hideDeleteBrandDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:brands.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBrandsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteBrandsDialogFooter} onHide={hideDeleteBrandsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:brands.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Brands; 