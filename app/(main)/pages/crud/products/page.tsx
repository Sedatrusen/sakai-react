'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../app/contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import ProductService, { Product, ProductCreateDTO, ProductUpdateDTO } from '../../../../../src/services/ProductService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';

const Products = () => {
    let emptyProduct: ProductCreateDTO = {
        name: '',
        description: '',
        supplier_id: 0,
        brand_id: 0,
        model_id: 0
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<ProductCreateDTO>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Product[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, suppliersData, brandsData, modelsData] = await Promise.all([
                ProductService.getProducts(),
                // TODO: Implement other service calls
                Promise.resolve([]),
                Promise.resolve([]),
                Promise.resolve([])
            ]);
            setProducts(productsData);
            setSuppliers(suppliersData);
            setBrands(brandsData);
            setModels(modelsData);
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
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim()) {
            try {
                setLoading(true);
                if ((product as any).product_id) {
                    await ProductService.updateProduct(product as ProductUpdateDTO);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: t('crud:products.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await ProductService.createProduct(product);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: t('crud:products.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setProductDialog(false);
                setProduct(emptyProduct);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save product',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editProduct = (product: Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product as any);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        try {
            setLoading(true);
            await ProductService.deleteProduct((product as any).product_id);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:products.deleteSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete product',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        try {
            setLoading(true);
            const blob = await ProductService.exportProducts();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:products.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to export products',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await ProductService.importProducts(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:products.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to import products',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof ProductCreateDTO) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        if (name === 'name' || name === 'description') {
            _product[name] = val;
        }
        setProduct(_product);
    };

    const onInputNumberChange = (e: any, name: keyof ProductCreateDTO) => {
        const val = e.value || 0;
        let _product = { ...product };
        if (name === 'supplier_id' || name === 'brand_id' || name === 'model_id') {
            _product[name] = val;
        }
        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="PRODUCT_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="PRODUCT_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteProductsDialog(true)} 
                        disabled={!selectedProducts || !selectedProducts.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="PRODUCT_IMPORT">
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
                <Permission permissionKey="PRODUCT_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <Permission permissionKey="PRODUCT_UPDATE">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                </Permission>
                <Permission permissionKey="PRODUCT_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:products.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveProduct} loading={loading} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteProduct} loading={loading} />
        </>
    );

    const deleteProductsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteProduct} loading={loading} />
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
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as Product[])}
                        dataKey="product_id"
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
                        <Column field="product_id" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header={t('crud:products.name')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="description" header={t('crud:products.description')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="supplier_id" header={t('crud:products.supplier')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="brand_id" header={t('crud:products.brand')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="model_id" header={t('crud:products.model')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={(product as any).product_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">{t('crud:products.name')}</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">{t('crud:products.description')}</label>
                            <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} />
                        </div>
                        <div className="field">
                            <label htmlFor="supplier_id">{t('crud:products.supplier')}</label>
                            <InputNumber id="supplier_id" value={product.supplier_id} onValueChange={(e) => onInputNumberChange(e, 'supplier_id')} />
                        </div>
                        <div className="field">
                            <label htmlFor="brand_id">{t('crud:products.brand')}</label>
                            <InputNumber id="brand_id" value={product.brand_id} onValueChange={(e) => onInputNumberChange(e, 'brand_id')} />
                        </div>
                        <div className="field">
                            <label htmlFor="model_id">{t('crud:products.model')}</label>
                            <InputNumber id="model_id" value={product.model_id} onValueChange={(e) => onInputNumberChange(e, 'model_id')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:products.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:products.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Products; 