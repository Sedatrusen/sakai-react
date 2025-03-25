import { Location } from '../types/location';
import locationData from '../data/locations.json';

// JSON'dan gelen verileri uygun tiplere çeviriyoruz
const dummyLocations: Location[] = locationData.locations.map(loc => ({
    ...loc,
    created_at: new Date(loc.created_at),
    updated_at: loc.updated_at ? new Date(loc.updated_at) : undefined
}));

class LocationService {
    getLocations(): Promise<Location[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...dummyLocations]);
            }, 500);
        });
    }

    getLocation(id: number): Promise<Location | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dummyLocations.find(loc => loc.location_id === id));
            }, 500);
        });
    }

    createLocation(location: Omit<Location, 'location_id' | 'created_at' | 'updated_at'>): Promise<Location> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newLocation: Location = {
                    ...location,
                    location_id: Math.max(...dummyLocations.map(loc => loc.location_id)) + 1,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                dummyLocations.push(newLocation);
                resolve(newLocation);
            }, 500);
        });
    }

    updateLocation(location: Location): Promise<Location> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyLocations.findIndex(loc => loc.location_id === location.location_id);
                if (index !== -1) {
                    dummyLocations[index] = {
                        ...location,
                        updated_at: new Date()
                    };
                    resolve(dummyLocations[index]);
                } else {
                    reject(new Error('Location not found'));
                }
            }, 500);
        });
    }

    deleteLocation(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyLocations.findIndex(loc => loc.location_id === id);
                if (index !== -1) {
                    dummyLocations.splice(index, 1);
                    resolve();
                } else {
                    reject(new Error('Location not found'));
                }
            }, 500);
        });
    }

    deleteLocations(ids: number[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                ids.forEach(id => {
                    const index = dummyLocations.findIndex(loc => loc.location_id === id);
                    if (index !== -1) {
                        dummyLocations.splice(index, 1);
                    }
                });
                resolve();
            }, 500);
        });
    }
}

export default new LocationService(); 