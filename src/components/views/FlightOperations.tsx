import React, { useState } from 'react';
import { 
  Plane, 
  Search, 
  Plus, 
  ChevronRight, 
  Users,
  Clock,
  MapPin
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { useTableSort } from '../../hooks/useTableSort';
import { Flight } from '../../types';

export const FlightOperations: React.FC = () => {
  const { 
    flights, 
    selectedTerminal, 
    searchTerm, 
    statusFilter, 
    setStatusFilter, 
    openFlightDetail,
    setIsNewFlightModalOpen
  } = useOperational();

  const [airlineFilter, setAirlineFilter] = useState<string>('ALL');

  // Get unique airlines from data
  const airlines = Array.from(new Set(flights.map((f) => f.airline)));

  // Filter flights
  const filteredFlights = flights.filter((f) => {
    const matchesTerminal = selectedTerminal === 'ALL' || f.terminal === selectedTerminal;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesAirline = airlineFilter === 'ALL' || f.airline === airlineFilter;
    const matchesSearch = 
      searchTerm === '' ||
      f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.gate.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTerminal && matchesStatus && matchesAirline && matchesSearch;
  });

  // Sort
  const { sortedData: sortedFlights, requestSort, getSortIndicator } = useTableSort<Flight>(filteredFlights, 'flightNumber');

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Control Strip & Filters */}
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Pills */}
          <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            {['ALL', 'On Time', 'Boarding', 'Departed', 'Delayed', 'Scheduled', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-bold transition uppercase tracking-wider border ${
                  statusFilter === st
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Airline Filter */}
          <select
            value={airlineFilter}
            onChange={(e) => setAirlineFilter(e.target.value)}
            className="bg-white border border-[#1A1A1A] text-[#1A1A1A] font-bold px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Airlines ({airlines.length})</option>
            {airlines.map((al) => (
              <option key={al} value={al}>{al}</option>
            ))}
          </select>
        </div>

        {/* Add Flight Dispatch Button */}
        <button
          onClick={() => setIsNewFlightModalOpen(true)}
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold flex items-center space-x-1.5 uppercase tracking-wider text-xs border border-[#1A1A1A] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Flight</span>
        </button>
      </div>

      {/* Flight Count */}
      <div className="text-[11px] text-[#555555] font-bold">
        Showing {filteredFlights.length} of {flights.length} flights
      </div>

      {/* Flight Schedule Table */}
      <div className="bg-white border border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A]">                <tr>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('flightNumber')}>Flight{getSortIndicator('flightNumber')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('airline')}>Airline{getSortIndicator('airline')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('aircraftType')}>Aircraft{getSortIndicator('aircraftType')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('destination')}>Route{getSortIndicator('destination')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('gate')}>Terminal / Gate{getSortIndicator('gate')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('scheduledDeparture')}>Schedule{getSortIndicator('scheduledDeparture')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('passengerCount')}>Pax / Cap{getSortIndicator('passengerCount')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('delayMinutes')}>Delay{getSortIndicator('delayMinutes')}</th>
                  <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
              {sortedFlights.length > 0 ? (
                sortedFlights.map((flight) => (
                  <tr
                    key={flight.id}
                    onClick={() => openFlightDetail(flight.id)}
                    className="hover:bg-[#F9F8F6] cursor-pointer transition"
                  >
                    <td className="p-3">
                      <div className="font-bold text-[#1A1A1A] text-sm flex items-center space-x-2">
                        <Plane className="w-4 h-4 text-[#1A1A1A]" />
                        <span>{flight.flightNumber}</span>
                      </div>
                      <div className="text-[10px] text-[#555555] mt-0.5">{flight.tailNumber}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[#1A1A1A]">{flight.airline}</div>
                      <div className="text-[10px] text-[#555555]">{flight.airlineCode}</div>
                    </td>

                    <td className="p-3 text-[#333333]">
                      {flight.aircraftType}
                    </td>

                    <td className="p-3 font-bold text-[#1A1A1A]">
                      {flight.origin} <span className="text-[#888888]">→</span> {flight.destination}
                      <div className="text-[10px] text-[#555555] font-normal">{flight.routeType}</div>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-[#1A1A1A]">{flight.terminal}</span>
                      <span className="ml-2 text-[#1A1A1A] font-bold bg-[#F2F1EF] px-2 py-0.5 border border-[#1A1A1A]">
                        {flight.gate}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="text-[#1A1A1A] font-bold">
                        {flight.scheduledDeparture ? new Date(flight.scheduledDeparture).toUTCString().slice(17, 22) : '--:--'} UTC
                      </div>
                      <div className="text-[10px] text-[#555555]">
                        {flight.timeOfDay} • {flight.dayOfWeek}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center space-x-1 text-[11px] font-bold">
                        <Users className="w-3 h-3 text-purple-900" />
                        <span>{flight.passengerCount}/{flight.capacity}</span>
                      </div>
                      <div className="text-[10px] text-[#555555]">
                        {flight.capacity > 0 ? Math.round((flight.passengerCount / flight.capacity) * 100) : 0}% load
                      </div>
                    </td>

                    <td className="p-3">
                      {flight.delayMinutes > 0 ? (
                        <div className="text-rose-700 font-bold">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {flight.delayMinutes}min
                        </div>
                      ) : (
                        <span className="text-[#555555]">On time</span>
                      )}
                      {flight.delayReason && (
                        <div className="text-[10px] text-rose-800 mt-0.5 truncate max-w-[120px] font-bold">
                          {flight.delayReason}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase border border-[#1A1A1A] ${
                        flight.status === 'On Time' || flight.status === 'Departed' ? 'bg-emerald-100 text-emerald-950' :
                        flight.status === 'Boarding' ? 'bg-blue-100 text-blue-950' :
                        flight.status === 'Delayed' || flight.status === 'Maintenance' ? 'bg-rose-100 text-rose-950' :
                        flight.status === 'Scheduled' ? 'bg-slate-200 text-slate-900' :
                        'bg-[#F2F1EF] text-[#1A1A1A]'
                      }`}>
                        {flight.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button className="p-1.5 text-[#1A1A1A] bg-white hover:bg-[#F2F1EF] border border-[#1A1A1A] transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#666666] italic">
                    No flight records match the active search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
