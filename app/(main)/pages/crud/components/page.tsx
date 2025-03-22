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
import ComponentService, { ComponentCreateDTO, ComponentUpdateDTO } from '../../../../../src/services/ComponentService';
import { Component } from '../../../../../src/types/component';
import { Dropdown } from 'primereact/dropdown';
import { Model } from '../../../../../src/types/model';
import ModelService from '../../../../../src/services/ModelService';

const Components = () => {
    let emptyComponent: ComponentCreateDTO = {
        name: '',
        description: '',
        component_img: '',
        model_id: 0,
        stok_critical_level: 0,
        stok_crirical_level_type_id: 1,
        optimum_sayi: 0
    };

    const [components, setComponents] = useState<Component[]>([]);
    const [componentDialog, setComponentDialog] = useState(false);
    const [deleteComponentDialog, setDeleteComponentDialog] = useState(false);
    const [deleteComponentsDialog, setDeleteComponentsDialog] = useState(false);
    const [component, setComponent] = useState<ComponentCreateDTO>(emptyComponent);
    const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState<Model[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Component[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [componentsData, modelsData] = await Promise.all([
                ComponentService.getComponents(),
                ComponentService.getModels()
            ]);
            setComponents(componentsData);
            setModels(modelsData);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:components.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setComponent(emptyComponent);
        setSubmitted(false);
        setComponentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setComponentDialog(false);
    };

    const hideDeleteComponentDialog = () => {
        setDeleteComponentDialog(false);
    };

    const hideDeleteComponentsDialog = () => {
        setDeleteComponentsDialog(false);
    };

    const saveComponent = async () => {
        setSubmitted(true);

        if (component.name.trim()) {
            try {
                setLoading(true);
                if ((component as any).component_id) {
                    await ComponentService.updateComponent(component as ComponentUpdateDTO);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: t('crud:components.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await ComponentService.createComponent(component);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: t('crud:components.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setComponentDialog(false);
                setComponent(emptyComponent);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save component',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editComponent = (component: Component) => {
        setComponent({ ...component });
        setComponentDialog(true);
    };

    const confirmDeleteComponent = (component: Component) => {
        setComponent(component as any);
        setDeleteComponentDialog(true);
    };

    const deleteComponent = async () => {
        try {
            setLoading(true);
            await ComponentService.deleteComponent((component as any).component_id);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:components.deleteSuccess'),
                life: 3000
            });
            await loadData();
            setDeleteComponentDialog(false);
            setComponent(emptyComponent);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete component',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        try {
            setLoading(true);
            const blob = await ComponentService.exportComponents();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'components.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:components.exportSuccess'),
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to export components',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            await ComponentService.importComponents(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: t('crud:components.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to import components',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof ComponentCreateDTO) => {
        const val = (e.target && e.target.value) || '';
        let _component = { ...component };
        if (name === 'name' || name === 'description' || name === 'component_img') {
            _component[name] = val;
        }
        setComponent(_component);
    };

    const onInputNumberChange = (e: any, name: keyof ComponentCreateDTO) => {
        const val = e.value || 0;
        let _component = { ...component };
        if (name === 'model_id' || name === 'stok_critical_level' || name === 'stok_crirical_level_type_id' || name === 'optimum_sayi') {
            _component[name] = val;
        }
        setComponent(_component);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="COMPONENT_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="COMPONENT_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteComponentsDialog(true)} 
                        disabled={!selectedComponents || !selectedComponents.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="COMPONENT_IMPORT">
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
                <Permission permissionKey="COMPONENT_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Component) => {
        return (
            <>
                <Permission permissionKey="COMPONENT_EDIT">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editComponent(rowData)} />
                </Permission>
                <Permission permissionKey="COMPONENT_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteComponent(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:components.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const componentDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveComponent} loading={loading} />
        </>
    );

    const deleteComponentDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteComponentDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteComponent} loading={loading} />
        </>
    );

    const deleteComponentsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteComponentsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteComponent} loading={loading} />
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
                        value={components}
                        selection={selectedComponents}
                        onSelectionChange={(e) => setSelectedComponents(e.value as Component[])}
                        dataKey="component_id"
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
                        <Column field="component_id" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header={t('crud:components.name')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="description" header={t('crud:components.description')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="component_img" header={t('crud:components.image')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column 
                            field="model_id" 
                            header={t('crud:components.model')} 
                            sortable 
                            style={{ minWidth: '10rem' }}
                            body={(rowData) => {
                                const model = models.find(m => m.model_id === rowData.model_id);
                                return model ? model.name : '';
                            }}
                        ></Column>
                        <Column field="stok_critical_level" header={t('crud:components.stockCriticalLevel')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="optimum_sayi" header={t('crud:components.optimumNumber')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={componentDialog} style={{ width: '450px' }} header={(component as any).component_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={componentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">{t('crud:components.name')}</label>
                            <InputText id="name" value={component.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !component.name })} />
                            {submitted && !component.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">{t('crud:components.description')}</label>
                            <InputTextarea id="description" value={component.description} onChange={(e) => onInputChange(e, 'description')} />
                        </div>
                        <div className="field">
                            <label htmlFor="component_img">{t('crud:components.image')}</label>
                            <InputText id="component_img" value={component.component_img} onChange={(e) => onInputChange(e, 'component_img')} />
                        </div>
                        <div className="field">
                            <label htmlFor="model_id">{t('crud:components.model')}</label>
                            <Dropdown
                                id="model_id"
                                value={component.model_id}
                                onChange={(e) => onInputNumberChange(e, 'model_id')}
                                options={models}
                                optionLabel="name"
                                optionValue="model_id"
                                placeholder={t('crud:components.selectModel')}
                                className={classNames({ 'p-invalid': submitted && !component.model_id })}
                            />
                            {submitted && !component.model_id && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="stok_critical_level">{t('crud:components.stockCriticalLevel')}</label>
                            <InputNumber id="stok_critical_level" value={component.stok_critical_level} onValueChange={(e) => onInputNumberChange(e, 'stok_critical_level')} />
                        </div>
                        <div className="field">
                            <label htmlFor="stok_crirical_level_type_id">{t('crud:components.stockCriticalLevelType')}</label>
                            <Dropdown
                                id="stok_crirical_level_type_id"
                                value={component.stok_crirical_level_type_id}
                                onChange={(e) => onInputNumberChange(e, 'stok_crirical_level_type_id')}
                                options={[
                                    { label: 'Adet', value: 1 },
                                    { label: 'Oran', value: 2 }
                                ]}
                                optionLabel="label"
                                optionValue="value"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="optimum_sayi">{t('crud:components.optimumNumber')}</label>
                            <InputNumber id="optimum_sayi" value={component.optimum_sayi} onValueChange={(e) => onInputNumberChange(e, 'optimum_sayi')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteComponentDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteComponentDialogFooter} onHide={hideDeleteComponentDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:components.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteComponentsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteComponentsDialogFooter} onHide={hideDeleteComponentsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:components.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Components;