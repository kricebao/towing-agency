import React from 'react';
import { Vehicle } from '../types';
import { StatusBadge } from './StatusBadge';
import { Star, Truck, User, MapPin } from 'lucide-react';

interface RosterTableProps {
  vehicles: Vehicle[];
}

export const RosterTable: React.FC<RosterTableProps> = ({ vehicles }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Fleet Roster</h2>
        <span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
          {vehicles.length} vehicles found
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-2">ID / Status</div>
        <div className="col-span-3">Provider Name</div>
        <div className="col-span-2">Driver</div>
        <div className="col-span-3">Location (Lat/Lon)</div>
        <div className="col-span-1 text-center">Rating</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto custom-scrollbar">
        {vehicles.length === 0 ? (
           <div className="p-8 text-center text-gray-500">No vehicles match your search.</div>
        ) : (
          vehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
            >
              {/* ID & Status */}
              <div className="col-span-2 flex flex-col items-start gap-2">
                <span className="text-sm font-medium text-gray-600 font-mono">{vehicle.id}</span>
                <StatusBadge status={vehicle.status} />
              </div>

              {/* Provider */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Truck size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {vehicle.providerName}
                </span>
              </div>

              {/* Driver */}
              <div className="col-span-2 flex items-center gap-2 text-gray-600">
                <User size={14} className="text-gray-400" />
                <span className="text-sm">{vehicle.driverName}</span>
              </div>

              {/* Location */}
              <div className="col-span-3 flex items-center gap-2 text-gray-500 font-mono text-xs">
                <MapPin size={14} className="text-gray-400" />
                <span>
                  {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
                </span>
              </div>

              {/* Rating */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-700">{vehicle.rating}</span>
                </div>
              </div>

              {/* Action */}
              <div className="col-span-1 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
