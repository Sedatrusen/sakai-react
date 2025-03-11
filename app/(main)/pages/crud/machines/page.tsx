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
import { useLanguage } from '../../../../../app/contexts/LanguageContext';
import { Permission } from '../../../../../components/Permission';

interface Machine {
    machine_id: number;
    code: string;
    name: string;
    description: string;
    location: string;
    is_deleted: boolean;
}

const Machines = () => {
    let emptyMachine: Machine = {
        machine_id: 0,
        code: '',
        name: '',
        description: '',
        location: '',
        is_deleted: false
    };

    const [machines, setMachines] = useState<Machine[]>([]);
    const [machineDialog, setMachineDialog] = useState(false);
    const [deleteMachineDialog, setDeleteMachineDialog] = useState(false);
    const [deleteMachinesDialog, setDeleteMachinesDialog] = useState(false);
    const [machine, setMachine] = useState<Machine>(emptyMachine);
    const [selectedMachines, setSelectedMachines] = useState<Machine[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Machine[]>>(null);
    const { hasPermission } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to fetch machines
            // const data = await MachineService.getMachines();
            // setMachines(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:machines.loadError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpload = async (event: any) => {
        try {
            setLoading(true);
            // TODO: Implement API call to import machines
            // await MachineService.importMachines(event.files[0]);
            toast.current?.show({
                severity: 'success',
                summary: t('crud:common.success'),
                detail: t('crud:machines.importSuccess'),
                life: 3000
            });
            await loadData();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('crud:common.error'),
                detail: t('crud:machines.importError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setMachine(emptyMachine);
        setSubmitted(false);
        setMachineDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMachineDialog(false);
    };

    const hideDeleteMachineDialog = () => {
        setDeleteMachineDialog(false);
    };

    const hideDeleteMachinesDialog = () => {
        setDeleteMachinesDialog(false);
    };

    const saveMachine = () => {
        setSubmitted(true);

        if (machine.name.trim() && machine.code.trim()) {
            let _machines = [...machines];
            let _machine = { ...machine };
            
            if (machine.machine_id) {
                const index = findIndexById(machine.machine_id);
                _machines[index] = _machine;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Machine Updated',
                    life: 3000
                });
            } else {
                _machine.machine_id = createId();
                _machines.push(_machine);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Machine Created',
                    life: 3000
                });
            }

            setMachines(_machines);
            setMachineDialog(false);
            setMachine(emptyMachine);
        }
    };

    const editMachine = (machine: Machine) => {
        setMachine({ ...machine });
        setMachineDialog(true);
    };

    const confirmDeleteMachine = (machine: Machine) => {
        setMachine(machine);
        setDeleteMachineDialog(true);
    };

    const deleteMachine = () => {
        let _machines = machines.filter((val) => val.machine_id !== machine.machine_id);
        setMachines(_machines);
        setDeleteMachineDialog(false);
        setMachine(emptyMachine);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Machine Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < machines.length; i++) {
            if (machines[i].machine_id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        return Math.floor(Math.random() * 1000);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteMachinesDialog(true);
    };

    const deleteSelectedMachines = () => {
        let _machines = machines.filter((val) => !selectedMachines.includes(val));
        setMachines(_machines);
        setDeleteMachinesDialog(false);
        setSelectedMachines([]);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Machines Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Machine) => {
        const val = (e.target && e.target.value) || '';
        let _machine = { ...machine };
        if (name === 'code' || name === 'name' || name === 'description' || name === 'location') {
            _machine[name] = val;
        }
        setMachine(_machine);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Permission permissionKey="MACHINE_CREATE">
                    <Button label={t('crud:common.new')} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </Permission>
                <Permission permissionKey="MACHINE_DELETE">
                    <Button 
                        label={t('crud:common.delete')} 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setDeleteMachinesDialog(true)} 
                        disabled={!selectedMachines || !selectedMachines.length} 
                    />
                </Permission>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex">
                <Permission permissionKey="MACHINE_IMPORT">
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
                <Permission permissionKey="MACHINE_EXPORT">
                    <Button label={t('crud:common.export')} icon="pi pi-upload" severity="help" onClick={exportCSV} />
                </Permission>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Machine) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMachine(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteMachine(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:align-items-center">
            <h5 className="m-0">{t('crud:machines.title')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder={t('crud:common.search')} className="p-inputtext-sm" />
            </span>
        </div>
    );

    const machineDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveMachine} />
        </>
    );

    const deleteMachineDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMachineDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteMachine} />
        </>
    );

    const deleteMachinesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMachinesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedMachines} />
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
                        value={machines}
                        selection={selectedMachines}
                        onSelectionChange={(e) => setSelectedMachines(e.value as Machine[])}
                        dataKey="machine_id"
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
                        <Column field="machine_id" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="code" header={t('crud:machines.code')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header={t('crud:machines.name')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="description" header={t('crud:machines.description')} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="location" header={t('crud:machines.location')} sortable style={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} header={t('crud:common.actions')}></Column>
                    </DataTable>

                    <Dialog visible={machineDialog} style={{ width: '450px' }} header={(machine as any).machine_id ? t('crud:common.edit') : t('crud:common.new')} modal className="p-fluid" footer={machineDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="code">{t('crud:machines.code')}</label>
                            <InputText id="code" value={machine.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !machine.code })} />
                            {submitted && !machine.code && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">{t('crud:machines.name')}</label>
                            <InputText id="name" value={machine.name} onChange={(e) => onInputChange(e, 'name')} required className={classNames({ 'p-invalid': submitted && !machine.name })} />
                            {submitted && !machine.name && <small className="p-invalid">{t('crud:common.required')}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">{t('crud:machines.description')}</label>
                            <InputTextarea id="description" value={machine.description} onChange={(e) => onInputChange(e, 'description')} rows={3} />
                        </div>
                        <div className="field">
                            <label htmlFor="location">{t('crud:machines.location')}</label>
                            <InputText id="location" value={machine.location} onChange={(e) => onInputChange(e, 'location')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMachineDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteMachineDialogFooter} onHide={hideDeleteMachineDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:machines.deleteConfirm')}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMachinesDialog} style={{ width: '450px' }} header={t('crud:common.confirm')} modal footer={deleteMachinesDialogFooter} onHide={hideDeleteMachinesDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{t('crud:machines.deleteMultipleConfirm')}</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Machines; 