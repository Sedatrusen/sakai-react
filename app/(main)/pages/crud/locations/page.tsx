'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';
import LocationService from '../../../../../src/services/LocationService';
import { Location } from '../../../../../src/types/location';

const Locations = () => {
    let emptyLocation: Omit<Location, 'location_id' | 'created_at' | 'updated_at'> = {
        name: '',
        description: ''
    };

    const [locations, setLocations] = useState<Location[]>([]);
    const [locationDialog, setLocationDialog] = useState(false);
    const [deleteLocationDialog, setDeleteLocationDialog] = useState(false);
    const [deleteLocationsDialog, setDeleteLocationsDialog] = useState(false);
    const [location, setLocation] = useState<Location>(emptyLocation as Location);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Location[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await LocationService.getLocations();
            setLocations(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:locations.loadError'),
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
        setLocation(emptyLocation as Location);
        setSubmitted(false);
        setLocationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setLocationDialog(false);
    };

    const hideDeleteLocationDialog = () => {
        setDeleteLocationDialog(false);
    };

    const hideDeleteLocationsDialog = () => {
        setDeleteLocationsDialog(false);
    };

    const saveLocation = async () => {
        setSubmitted(true);

        if (location.name.trim()) {
            try {
                setLoading(true);
                if (location.location_id) {
                    await LocationService.updateLocation(location);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:locations.updateSuccess'),
                        life: 3000
                    });
                } else {
                    await LocationService.createLocation(location);
                    toast.current?.show({
                        severity: 'success',
                        summary: t('crud:common.success'),
                        detail: t('crud:locations.createSuccess'),
                        life: 3000
                    });
                }
                await loadData();
                setLocationDialog(false);
                setLocation(emptyLocation as Location);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: t('crud:common.error'),
                    detail: t('crud:locations.saveError'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const editLocation = (location: Location) => {
        setLocation({ ...location });
        setLocationDialog(true);
    };

    const confirmDeleteLocation = (location: Location) => {
        setLocation(location);
        setDeleteLocationDialog(true);
    };

    const deleteLocation = async () => {
        try {
            setLoading(true);
            if (deleteLocationsDialog) {
                await Promise.all(selectedLocations.map(location => LocationService.deleteLocation(location.location_id)));
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:locations.deleteMultipleSuccess'),
                    life: 3000
                });
            } else {
                await LocationService.deleteLocation(location.location_id);
                toast.current?.show({
                    severity: 'success',
                    summary: t('crud:common.success'),
                    detail: t('crud:locations.deleteSuccess'),
                    life: 3000
                });
            }
            await loadData();
            setDeleteLocationDialog(false);
            setDeleteLocationsDialog(false);
            setLocation(emptyLocation as Location);
            setSelectedLocations([]);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: deleteLocationsDialog ? t('crud:locations.deleteMultipleError') : t('crud:locations.deleteError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Location) => {
        const val = (e.target && e.target.value) || '';
        let _location = { ...location };
        if (name === 'name' || name === 'description') {
            _location[name] = val;
        }
        setLocation(_location);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="LOCATION_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="LOCATION_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteLocationsDialog(true)} 
                        disabled={!selectedLocations || !selectedLocations.length} 
                    />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Location) => {
        return (
            <>
                <Permission permissionKey="LOCATION_EDIT">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editLocation(rowData)} />
                </Permission>
                <Permission permissionKey="LOCATION_DELETE">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteLocation(rowData)} />
                </Permission>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:locations.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const locationDialogFooter = (
        <>
            <Button label={t('crud:common.cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('crud:common.save')} icon="pi pi-check" className="p-button-text" onClick={saveLocation} loading={loading} />
        </>
    );

    const deleteLocationDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteLocationDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteLocation} loading={loading} />
        </>
    );

    const deleteLocationsDialogFooter = (
        <>
            <Button label={t('crud:common.no')} icon="pi pi-times" className="p-button-text" onClick={hideDeleteLocationsDialog} />
            <Button label={t('crud:common.yes')} icon="pi pi-check" className="p-button-text" onClick={deleteLocation} loading={loading} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={locations}
                        selection={selectedLocations}
                        onSelectionChange={(e) => setSelectedLocations(e.value as Location[])}
                        dataKey="location_id"
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
                        <Column field="location_id" header={t('crud:locations.id')} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header={t('crud:locations.name')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="description" header={t('crud:locations.description')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="created_at" header={t('crud:locations.createdAt')} sortable style={{ minWidth: '12rem' }} body={(rowData) => new Date(rowData.created_at).toLocaleDateString()}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={locationDialog} style={{ width: '450px' }} header={location.location_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={locationDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">{t('crud:locations.name')}</label>
                            <InputText id="name" value={location.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !location.name })} />
                            {submitted && !location.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">{t('crud:locations.description')}</label>
                            <InputText id="description" value={location.description} onChange={(e) => onInputChange(e, 'description')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteLocationDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteLocationDialogFooter} onHide={hideDeleteLocationDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:locations.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteLocationsDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteLocationsDialogFooter} onHide={hideDeleteLocationsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:locations.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Locations; 