import React, { useState, useMemo, memo } from 'react';
import { 
  Plane, 
  Search, 
  Plus, 
  ChevronRight, 
  Users,
  Clock
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { useTableSort } from '../../hooks/useTableSort';
import { Flight } from '../../types';
import { Pagination } from '../Pagination';

const ITEMS_PER_PAGE = 25;

const FlightRow = memo(({ flight, onClick }: { flight: Flight; onClick: () => void }) => (
  <tr onClick={onClick} className="hover:bg-[#F9F8F6] cursor-pointer transition">
    <td className="p-3">
      <div className="font-bold text-[#1A1A1A] text-sm flex items-center space-x-2">
        <Plane className="w-4 h-4 text-[#1A1A1A]" />
        <span>{flight.flightNumber}</span>
      </div>
      <div className="text-[10px] text-[#555555] mt-0.5">{flight.tailNumber}</div>
    </td>
    <td className="p-3">
      <div className="font-bold text-[#1A1A1A]">{flight.airline}</div>
    </td>
    <td className="p-3 text-[#333333]">{flight.aircraftType}</td>
    <td className="p-3 font-bold text-[#1A1A1A]">
      {flight.origin} <span className="text-[#888888]">to</span> {flight.destination}
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
    </td>
    <td className="p-3">
      <div className="flex items-center space-x-1 text-[11px] font-bold">
        <Users className="w-3 h-3 text-purple-900" />
        <span>{flight.passengerCount}/{flight.capacity}</span>
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
    </td>
    <td className="p-3">
      <span className={`px-2 py-0.5 text-xs font-bold uppercase border border-[#1A1A1A] ${
        flight.status === 'On Time' || flight.status === 'Departed' ? 'bg-emerald-100 text-emerald-950' :
        flight.status === 'Boarding' ? 'bg-blue-100 text-blue-950' :
        flight.status === 'Delayed' || flight.status === 'Maintenance' ? 'bg-rose-100 text-rose-950' :
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
));
FlightRow.displayName = 'FlightRow';

export const FlightOperations: React.FC = memo(() => {
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
  const [currentPage, setCurrentPage] = useState(1);

  const airlines = useMemo(() => Array.from(new Set(flights.map((f) => f.airline))), [flights]);

  const filteredFlights = useMemo(() => flights.filter((f) => {
    const matchesTerminal = selectedTerminal === 'ALL' || f.terminal === selectedTerminal;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesAirline = airlineFilter === 'ALL' || f.airline === airlineFilter;
    const matchesSearch = 
      searchTerm === '' ||
      f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTerminal && matchesStatus && matchesAirline && matchesSearch;
  }), [flights, selectedTerminal, statusFilter, airlineFilter, searchTerm]);

  const { sortedData: sortedFlights, requestSort, getSortIndicator } = useTableSort<Flight>(filteredFlights, 'flightNumber');

  const totalPages = Math.ceil(sortedFlights.length / ITEMS_PER_PAGE);
  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedFlights.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedFlights, currentPage]);

  return (
    <div className="space-y-4 font-mono text-xs text-[#1A1A1A]">
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            {['ALL', 'On Time', 'Boarding', 'Departed', 'Delayed', 'Scheduled'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-2 py-1 text-[11px] font-bold transition uppercase tracking-wider border ${
                  statusFilter === st
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={airlineFilter}
            onChange={(e) => { setAirlineFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-[#1A1A1A] text-[#1A1A1A] font-bold px-3 py-1.5 focus:outline-none text-[11px]"
          >
            <option value="ALL">All Airlines</option>
            {airlines.map((al) => (
              <option key={al} value={al}>{al}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsNewFlightModalOpen(true)}
          className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold flex items-center space-x-1 uppercase tracking-wider text-[11px] border border-[#1A1A1A] transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch</span>
        </button>
      </div>

      <div className="text-[11px] text-[#555555] font-bold">
        Showing {paginatedFlights.length} of {sortedFlights.length} flights (Page {currentPage} of {totalPages || 1})
      </div>

      <div className="bg-white border border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A]">
              <tr>
                <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('flightNumber')}>Flight{getSortIndicator('flightNumber')}</th>
                <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('airline')}>Airline{getSortIndicator('airline')}</th>
                <th className="p-3">Aircraft</th>
                <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('destination')}>Route{getSortIndicator('destination')}</th>
                <th className="p-3">Gate</th>
                <th className="p-3">Schedule</th>
                <th className="p-3">Pax</th>
                <th className="p-3">Delay</th>
                <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
              {paginatedFlights.map((flight) => (
                <FlightRow
                  key={flight.id}
                  flight={flight}
                  onClick={() => openFlightDetail(flight.id)}
                />
              ))}
              {paginatedFlights.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#666666] italic">
                    No flights match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
});
FlightOperations.displayName = 'FlightOperations';
