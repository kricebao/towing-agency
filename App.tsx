import React, { useState, useEffect, useMemo } from 'react';
import { Search, RotateCw, Filter, WifiOff } from 'lucide-react';
import { INITIAL_VEHICLES } from './constants';
import { Vehicle, VehicleStatus } from './types';
import { FleetMap } from './components/FleetMap';
import { RosterTable } from './components/RosterTable';

// API Endpoint configuration
const API_URL = '/api';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [isSimulating, setIsSimulating] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Load initial data from API on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_URL}/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setVehicles(data);
        setUsingFallback(false);
      } catch (error) {
        console.warn('API unavailable, using local mock data.');
        setUsingFallback(true);
        // Keep INITIAL_VEHICLES as default
      }
    };

    fetchVehicles();
  }, []);

  // Derived state for filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'All Statuses' || v.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  // Derived counts
  const activeCount = vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length;
  const busyCount = vehicles.filter(v => v.status === VehicleStatus.BUSY).length;

  // Simulate updates (Try API first, fallback to local)
  const handleSimulateUpdate = async () => {
    setIsSimulating(true);
    
    try {
      // Attempt API call
      const response = await fetch(`${API_URL}/vehicles/simulate`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('API call failed');
      
      const data = await response.json();
      setVehicles(data);
      setUsingFallback(false);
      setIsSimulating(false);

    } catch (error) {
      // Fallback logic if API is down
      console.log('API update failed, running local simulation...');
      setUsingFallback(true);
      
      setTimeout(() => {
        const updatedVehicles = vehicles.map(v => {
          // Randomly change position slightly
          const latOffset = (Math.random() - 0.5) * 0.01;
          const lngOffset = (Math.random() - 0.5) * 0.01;
          
          // Small chance to change status
          let newStatus = v.status;
          if (Math.random() > 0.8) {
             const statuses = [VehicleStatus.ACTIVE, VehicleStatus.BUSY, VehicleStatus.OFFLINE];
             newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          }

          return {
            ...v,
            lat: v.lat + latOffset,
            lng: v.lng + lngOffset,
            status: newStatus
          };
        });
        setVehicles(updatedVehicles);
        setIsSimulating(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Connection Status Indicator (Visible only when using fallback) */}
        {usingFallback && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded shadow-sm">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-amber-400 mr-2" />
              <div>
                <p className="text-sm text-amber-700">
                  Backend API disconnected. Running in client-side demonstration mode.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Section: Filters & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Filters & Stats (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Filter Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters</h2>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search ID, Name, Driver..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>{VehicleStatus.ACTIVE}</option>
                  <option>{VehicleStatus.BUSY}</option>
                  <option>{VehicleStatus.OFFLINE}</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="text-gray-400" size={16} />
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-32">
                <span className="text-sm font-medium text-gray-500">Active Units</span>
                <span className="text-4xl font-bold text-emerald-500">{activeCount}</span>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-32">
                <span className="text-sm font-medium text-gray-500">On Job</span>
                <span className="text-4xl font-bold text-orange-500">{busyCount}</span>
              </div>
            </div>

            {/* Simulate Button */}
            <div>
              <button
                onClick={handleSimulateUpdate}
                disabled={isSimulating}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all
                  ${isSimulating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
                `}
              >
                <RotateCw size={18} className={isSimulating ? 'animate-spin' : ''} />
                {isSimulating ? 'Updating...' : 'Simulate Update'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                {usingFallback 
                  ? "Client-side simulation (API disconnected)" 
                  : "Triggers /api/vehicles/simulate endpoint"}
              </p>
            </div>
            
          </div>

          {/* Right Column: Map (8 columns) */}
          <div className="lg:col-span-8">
            <FleetMap vehicles={filteredVehicles} />
          </div>
        </div>

        {/* Bottom Section: Roster Table */}
        <div className="w-full">
          <RosterTable vehicles={filteredVehicles} />
        </div>

      </div>
    </div>
  );
}

export default App;