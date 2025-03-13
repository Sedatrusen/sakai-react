import axios from 'axios';
import { Machine } from '../types/machine';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface MachineCreateDTO {
    code: string;
    name: string;
    description: string;
    location: string;
}

export interface MachineUpdateDTO extends MachineCreateDTO {
    machine_id: number;
}

class MachineService {
    async getMachines(): Promise<Machine[]> {
        // Mocked data
        return [
            { machine_id: 1, code: 'M001', name: 'Machine 1', description: 'Description 1', location: 'Location 1', is_deleted: false },
            { machine_id: 2, code: 'M002', name: 'Machine 2', description: 'Description 2', location: 'Location 2', is_deleted: false },
            { machine_id: 3, code: 'M003', name: 'Machine 3', description: 'Description 3', location: 'Location 3', is_deleted: false }
        ];
    }

    async getMachine(id: number): Promise<Machine> {
        // Mocked data
        return { 
            machine_id: id, 
            code: `M${id.toString().padStart(3, '0')}`, 
            name: `Machine ${id}`, 
            description: `Description ${id}`, 
            location: `Location ${id}`, 
            is_deleted: false 
        };
    }

    async createMachine(machine: MachineCreateDTO): Promise<Machine> {
        // Mocked data
        return { 
            machine_id: Math.floor(Math.random() * 1000),
            code: machine.code,
            name: machine.name,
            description: machine.description,
            location: machine.location,
            is_deleted: false
        };
    }

    async updateMachine(machine: MachineUpdateDTO): Promise<Machine> {
        // Mocked data
        return { 
            machine_id: machine.machine_id,
            code: machine.code,
            name: machine.name,
            description: machine.description,
            location: machine.location,
            is_deleted: false
        };
    }

    async deleteMachine(id: number): Promise<void> {
        // Mocked data
        console.log(`Deleting machine with id: ${id}`);
    }

    async deleteMachines(ids: number[]): Promise<void> {
        // Mocked data
        console.log(`Deleting machines with ids: ${ids.join(', ')}`);
    }

    async importMachines(file: File): Promise<void> {
        // Mocked data
        console.log(`Importing machines from file: ${file.name}`);
    }

    async exportMachines(): Promise<Blob> {
        // Mocked data
        const csv = 'machine_id,code,name,description,location\n1,M001,Machine 1,Description 1,Location 1\n2,M002,Machine 2,Description 2,Location 2\n3,M003,Machine 3,Description 3,Location 3';
        return new Blob([csv], { type: 'text/csv' });
    }
}

export default new MachineService(); 