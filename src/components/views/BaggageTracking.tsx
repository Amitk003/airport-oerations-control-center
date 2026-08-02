import React, { useState } from 'react';
import { 
  Luggage, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  MapPin
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const BaggageTracking: React.FC = () => {
  const { baggage, flights, passengers, selectedTerminal } = useOperational();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBaggage = baggage.filter((b) => {
    const flight = flights.find((f) => f.flightNumber === b.flightNumber);
    const matchesTerminal = selectedTerminal === 'ALL' || (flight && flight.terminal === selectedTerminal);
    const matchesStatus = statusFilter === 'ALL' || b.currentStatus === statusFilter || b.status === statusFilter;
    const matchesSearch = 
      searchTerm === '' ||
      b.bagTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.carousel.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTerminal && matchesStatus && matchesSearch;
  });

  const statusCounts = baggage.reduce((acc, b) => {
    const status = b.currentStatus || b.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Tracked Bags</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{baggage.length}</div>
          <div className="text-[10px] text-[#555555] mt-1">In System</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Loaded on Aircraft</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {baggage.filter((b) => b.currentStatus === 'Loaded').length}
          </div>
          <div className="text-[10px] text-emerald-900 mt-1">Secured in Hold</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">In Sorting</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">
            {baggage.filter((b) => b.status === 'Sorting' || b.status === 'Check-in').length}
          </div>
          <div className="text-[10px] text-amber-900 mt-1">Processing</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Dangerous Goods</div>
          <div className="text-2xl font-bold text-rose-800 mt-1">
            {baggage.filter((b) => b.isDangerous).length}
          </div>
          <div className="text-[10px] text-rose-900 mt-1">Requires Attention</div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
          {['ALL', 'Check-in', 'Sorting', 'Loaded', 'In-Transit', 'Claim-Carousel'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                statusFilter === st
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
              }`}
            >
              {st} ({statusCounts[st] || 0})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Bag Tag #, Flight..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none font-mono w-56"
          />
        </div>
      </div>

      {/* Baggage Table */}
      <div className="bg-white border border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A] sticky top-0">
              <tr>
                <th className="p-3">Bag Tag</th>
                <th className="p-3">Flight</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Dimensions</th>
                <th className="p-3">Location</th>
                <th className="p-3">Carousel</th>
                <th className="p-3">Status</th>
                <th className="p-3">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
              {filteredBaggage.length > 0 ? (
                filteredBaggage.map((item) => {
                  const flight = flights.find((f) => f.flightNumber === item.flightNumber);
                  return (
                    <tr key={item.id} className="hover:bg-[#F9F8F6] transition">
                      <td className="p-3">
                        <div className="font-bold text-[#1A1A1A] text-sm">#{item.bagTag}</div>
                        <div className="text-[10px] text-[#555555]">{item.bagId}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#1A1A1A]">{item.flightNumber}</div>
                        {flight && (
                          <div className="text-[10px] text-[#555555]">{flight.origin} → {flight.destination}</div>
                        )}
                      </td>

                      <td className="p-3 text-[#333333]">
                        {item.weightKg.toFixed(1)} kg
                      </td>

                      <td className="p-3 text-[#555555]">
                        {item.dimensions}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#666666]" />
                          <span className="font-bold text-[#1A1A1A]">{item.location}</span>
                        </div>
                      </td>

                      <td className="p-3 text-[#1A1A1A] font-bold">
                        {item.carousel}
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase border border-[#1A1A1A] ${
                          item.currentStatus === 'Loaded' ? 'bg-emerald-100 text-emerald-950' :
                          item.currentStatus === 'Delayed' || item.currentStatus === 'Lost' ? 'bg-rose-100 text-rose-950' :
                          'bg-amber-100 text-amber-950'
                        }`}>
                          {item.currentStatus || item.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          {item.isDangerous && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-950 border border-[#1A1A1A] text-[9px] font-bold">
                              DGR
                            </span>
                          )}
                          {item.isInternational && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-950 border border-[#1A1A1A] text-[9px] font-bold">
                              INTL
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#666666] italic">
                    No baggage records matched the filter query.
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
