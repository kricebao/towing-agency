export enum VehicleStatus {
  ACTIVE = 'Active',
  BUSY = 'Busy',
  OFFLINE = 'Offline'
}

export interface Vehicle {
  id: string;
  status: VehicleStatus;
  providerName: string;
  driverName: string;
  lat: number;
  lng: number;
  rating: number;
}
