import React, { useState, useMemo, memo } from 'react';
import { 
  UserCheck, 
  Search, 
  Plane, 
  Luggage,
  Star,
  AlertTriangle
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { useTableSort } from '../../hooks/useTableSort';
import { Passenger } from '../../types';
import { Pagination } from '../Pagination';

const ITEMS_PER_PAGE = 25;

const PassengerRow = memo(({ passenger, flights }: { passenger: Passenger; flights: any[] }) => {
  const flight = flights.find((f: any) => f.flightNumber === passenger.flightNumber);
  return (
    <tr className="hover:bg-[#F9F8F6] transition">
      <td className="p-3">
        <div className="font-bold text-[#1A1A1A] text-sm">{passenger.firstName} {passenger.lastName}</div>
        <div className="text-[10px] text-[#555555]">{passenger.gender} / {passenger.age}y</div>
      </td>
      <td className="p-3">
        <div className="font-bold text-[#1A1A1A]">{passenger.pnrCode}</div>
      </td>
      <td className="p-3 font-bold text-[#1A1A1A]">{passenger.flightNumber}</td>
      <td className="p-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
          passenger.ticketClass === 'First' ? 'bg-amber-100 text-amber-950' :
          passenger.ticketClass === 'Business' ? 'bg-blue-100 text-blue-950' :
          'bg-[#F2F1EF] text-[#1A1A1A]'
        }`}>
          {passenger.ticketClass}
        </span>
      </td>
      <td className="p-3 text-[#333333]">{passenger.nationality}</td>
      <td className="p-3 font-bold">{passenger.baggageCount}</td>
      <td className="p-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
          passenger.status === 'Boarded' ? 'bg-emerald-100 text-emerald-950' :
          passenger.status === 'Boarding' ? 'bg-blue-100 text-blue-950' :
          'bg-[#F2F1EF] text-[#1A1A1A]'
        }`}>
          {passenger.status}
        </span>
      </td>
      <td className="p-3">
        {passenger.isVip && <span className="px-1 py-0.5 bg-purple-100 text-purple-950 text-[9px] font-bold">VIP</span>}
        {passenger.specialAssistance && <span className="px-1 py-0.5 bg-amber-100 text-amber-950 text-[9px] font-bold ml-1">ASSIST</span>}
      </td>
    </tr>
  );
});
PassengerRow.displayName = 'PassengerRow';

export const PassengerOperations: React.FC = memo(() => {
  const { passengers, flights, selectedTerminal } = useOperational();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPassengers = useMemo(() => passengers.filter((p) => {
    const flight = flights.find((f) => f.flightNumber === p.flightNumber);
    const matchesTerminal = selectedTerminal === 'ALL' || (flight && flight.terminal === selectedTerminal);
    const matchesClass = classFilter === 'ALL' || p.ticketClass === classFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch = searchTerm === '' ||
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTerminal && matchesClass && matchesStatus && matchesSearch;
  }), [passengers, flights, selectedTerminal, classFilter, statusFilter, searchTerm]);

  const { sortedData: sortedPassengers, requestSort, getSortIndicator } = useTableSort<Passenger>(filteredPassengers, 'lastName');

  const totalPages = Math.ceil(sortedPassengers.length / ITEMS_PER_PAGE);
  const paginatedPassengers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPassengers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedPassengers, currentPage]);

  const statusCounts = useMemo(() => passengers.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>), [passengers]);

  return (
    <div className="space-y-4 font-mono text-xs text-[#1A1A1A]">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white border border-[#1A1A1A] p-3">
          <div className="text-[10px] text-[#666666] uppercase font-bold">Total</div>
          <div className="text-xl font-bold">{passengers.length}</div>
        </div>
        <div className="bg-white border border-[#1A1A1A] p-3">
          <div className="text-[10px] text-[#666666] uppercase font-bold">First</div>
          <div className="text-xl font-bold text-amber-800">{passengers.filter(p => p.ticketClass === 'First').length}</div>
        </div>
        <div className="bg-white border border-[#1A1A1A] p-3">
          <div className="text-[10px] text-[#666666] uppercase font-bold">Business</div>
          <div className="text-xl font-bold text-blue-800">{passengers.filter(p => p.ticketClass === 'Business').length}</div>
        </div>
        <div className="bg-white border border-[#1A1A1A] p-3">
          <div className="text-[10px] text-[#666666] uppercase font-bold">Economy</div>
          <div className="text-xl font-bold">{passengers.filter(p => p.ticketClass === 'Economy').length}</div>
        </div>
        <div className="bg-white border border-[#1A1A1A] p-3">
          <div className="text-[10px] text-[#666666] uppercase font-bold">VIP</div>
          <div className="text-xl font-bold text-purple-900">{passengers.filter(p => p.isVip).length}</div>
        </div>
        <div className="bg-white border border-[#1A1A1A] p-3">
          <div className="text-[10px] text-[#666666] uppercase font-bold">Assist</div>
          <div className="text-xl font-bold text-rose-800">{passengers.filter(p => p.specialAssistance).length}</div>
        </div>
      </div>

      <div className="bg-white border border-[#1A1A1A] p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1">
          {['ALL', 'First', 'Business', 'Economy'].map((cls) => (
            <button key={cls} onClick={() => { setClassFilter(cls); setCurrentPage(1); }}
              className={`px-2 py-1 text-[11px] font-bold uppercase border ${classFilter === cls ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#555555] border-transparent hover:border-[#1A1A1A]'}`}>
              {cls}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-1">
          {['ALL', 'Checked-In', 'Boarding', 'Boarded'].map((st) => (
            <button key={st} onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
              className={`px-2 py-1 text-[11px] font-bold uppercase border ${statusFilter === st ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#555555] border-transparent hover:border-[#1A1A1A]'}`}>
              {st}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="w-3 h-3 text-[#666666] absolute left-2 top-1.5" />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-6 pr-2 py-1 bg-white border border-[#1A1A1A] text-[11px] focus:outline-none font-mono w-40" />
        </div>
      </div>

      <div className="text-[11px] text-[#555555] font-bold">
        {sortedPassengers.length} passengers (Page {currentPage} of {totalPages || 1})
      </div>

      <div className="bg-white border border-[#1A1A1A] overflow-hidden">
        <table className="w-full text-left font-mono">
          <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider">
            <tr>
              <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('lastName')}>Name{getSortIndicator('lastName')}</th>
              <th className="p-3">PNR</th>
              <th className="p-3">Flight</th>
              <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('ticketClass')}>Class{getSortIndicator('ticketClass')}</th>
              <th className="p-3">Nationality</th>
              <th className="p-3">Bags</th>
              <th className="p-3 cursor-pointer hover:bg-white/20" onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
              <th className="p-3">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]/20">
            {paginatedPassengers.map((p) => (
              <PassengerRow key={p.id} passenger={p} flights={flights} />
            ))}
            {paginatedPassengers.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-[#666666]">No records found.</td></tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
});
PassengerOperations.displayName = 'PassengerOperations';
