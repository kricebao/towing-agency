import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { Vehicle, VehicleStatus } from '../types';

interface FleetMapProps {
  vehicles: Vehicle[];
}

const getStatusColor = (status: VehicleStatus) => {
  switch (status) {
    case VehicleStatus.ACTIVE:
      return '#10B981'; // emerald-500
    case VehicleStatus.BUSY:
      return '#F97316'; // orange-500
    case VehicleStatus.OFFLINE:
      return '#9CA3AF'; // gray-400
    default:
      return '#9CA3AF';
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 p-3 shadow-lg rounded-md text-sm">
        <p className="font-bold text-gray-900">{data.id}</p>
        <p className="text-gray-600">{data.providerName}</p>
        <p className="text-xs text-gray-500 mt-1">
          Lat: {data.lat.toFixed(4)}, Lng: {data.lng.toFixed(4)}
        </p>
      </div>
    );
  }
  return null;
};

export const FleetMap: React.FC<FleetMapProps> = ({ vehicles }) => {
  // Create dummy legend payload
  const legendPayload = [
    { value: 'Active', type: 'circle', color: '#10B981' },
    { value: 'Busy', type: 'circle', color: '#F97316' },
    { value: 'Offline', type: 'circle', color: '#9CA3AF' },
  ];

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Fleet Location Map</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            type="number" 
            dataKey="lng" 
            name="Longitude" 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickCount={5}
            label={{ value: 'Longitude', position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            type="number" 
            dataKey="lat" 
            name="Latitude" 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickCount={5}
            label={{ value: 'Latitude', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend 
             payload={
              legendPayload.map(item => ({
                value: item.value,
                type: 'circle', 
                id: item.value,
                color: item.color
              })) as any
             } 
             verticalAlign="top"
             align="right"
             wrapperStyle={{ top: -40, right: 0, fontSize: '12px' }}
          />
          <Scatter name="Vehicles" data={vehicles} fill="#8884d8">
            {vehicles.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
