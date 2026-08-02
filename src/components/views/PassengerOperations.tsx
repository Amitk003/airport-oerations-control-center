import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  ShieldCheck, 
  Plane, 
  Luggage,
  Users,
  Star,
  AlertTriangle
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const PassengerOperations: React.FC = () => {
  const { passengers, flights, selectedTerminal, openFlightDetail } = useOperational();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPassengers = passengers.filter((p) => {
    const flight = flights.find((f) => f.flightNumber === p.flightNumber);
    const matchesTerminal = selectedTerminal === 'ALL' || (flight && flight.terminal === selectedTerminal);
    const matchesClass = classFilter === 'ALL' || p.ticketClass === classFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch = 
      searchTerm === '' ||
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pnrCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTerminal && matchesClass && matchesStatus && matchesSearch;
  });

  // Metrics
  const totalPassengers = passengers.length;
  const businessClass = passengers.filter(p => p.ticketClass === 'Business').length;
  const economyClass = passengers.filter(p => p.ticketClass === 'Economy').length;
  const firstClass = passengers.filter(p => p.ticketClass === 'First').length;
  const vipPassengers = passengers.filter(p => p.isVip).length;
  const specialAssistance = passengers.filter(p => p.specialAssistance).length;

  // Status distribution
  const statusCounts = passengers.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Passengers</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{totalPassengers}</div>
          <div className="text-[10px] text-[#555555] mt-1">In Dataset</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">First Class</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{firstClass}</div>
          <div className="text-[10px] text-amber-900 mt-1">Premium Pax</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Business Class</div>
          <div className="text-2xl font-bold text-blue-800 mt-1">{businessClass}</div>
          <div className="text-[10px] text-blue-900 mt-1">Corporate Travel</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Economy Class</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{economyClass}</div>
          <div className="text-[10px] text-[#555555] mt-1">Standard Pax</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">VIP Passengers</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{vipPassengers}</div>
          <div className="text-[10px] text-purple-950 mt-1">Loyalty Members</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Special Assistance</div>
          <div className="text-2xl font-bold text-rose-800 mt-1">{specialAssistance}</div>
          <div className="text-[10px] text-rose-900 mt-1">Requires Support</div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            {['ALL', 'First', 'Business', 'Economy'].map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                  classFilter === cls
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            {['ALL', 'Checked-In', 'Security-Passed', 'Boarding', 'Boarded', 'Delayed'].map((st) => (
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
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Name, PNR, Flight..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none font-mono w-64"
          />
        </div>
      </div>

      {/* Passenger Table */}
      <div className="bg-white border border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A] sticky top-0">
              <tr>
                <th className="p-3">Passenger Name</th>
                <th className="p-3">PNR / Passport</th>
                <th className="p-3">Flight</th>
                <th className="p-3">Class / Seat</th>
                <th className="p-3">Nationality</th>
                <th className="p-3">Baggage</th>
                <th className="p-3">Status</th>
                <th className="p-3">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
              {filteredPassengers.length > 0 ? (
                filteredPassengers.map((passenger) => {
                  const flight = flights.find((f) => f.flightNumber === passenger.flightNumber);
                  return (
                    <tr key={passenger.id} className="hover:bg-[#F9F8F6] transition">
                      <td className="p-3">
                        <div className="font-bold text-[#1A1A1A] text-sm">
                          {passenger.firstName} {passenger.lastName}
                        </div>
                        <div className="text-[10px] text-[#555555] mt-0.5">
                          {passenger.gender} • Age {passenger.age}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#1A1A1A]">{passenger.pnrCode}</div>
                        <div className="text-[10px] text-[#555555]">{passenger.maskedPassport}</div>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => flight && openFlightDetail(flight.id)}
                          className="font-bold text-[#1A1A1A] hover:text-blue-700 transition flex items-center space-x-1"
                        >
                          <Plane className="w-3 h-3" />
                          <span>{passenger.flightNumber}</span>
                        </button>
                        {flight && (
                          <div className="text-[10px] text-[#555555]">
                            {flight.origin} → {flight.destination}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                            passenger.ticketClass === 'First' ? 'bg-amber-100 text-amber-950' :
                            passenger.ticketClass === 'Business' ? 'bg-blue-100 text-blue-950' :
                            'bg-[#F2F1EF] text-[#1A1A1A]'
                          }`}>
                            {passenger.ticketClass}
                          </span>
                          <span className="font-bold text-[#1A1A1A]">{passenger.seatNumber}</span>
                        </div>
                      </td>

                      <td className="p-3 text-[#333333]">
                        {passenger.nationality}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Luggage className="w-3 h-3 text-amber-700" />
                          <span className="font-bold">{passenger.baggageCount}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase border border-[#1A1A1A] ${
                          passenger.status === 'Boarded' ? 'bg-emerald-100 text-emerald-950' :
                          passenger.status === 'Boarding' ? 'bg-blue-100 text-blue-950' :
                          passenger.status === 'Security-Passed' ? 'bg-purple-100 text-purple-950' :
                          passenger.status === 'Delayed' ? 'bg-rose-100 text-rose-950' :
                          'bg-[#F2F1EF] text-[#1A1A1A]'
                        }`}>
                          {passenger.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center space-x-1.5">
                          {passenger.isVip && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-950 border border-[#1A1A1A] text-[9px] font-bold flex items-center space-x-0.5">
                              <Star className="w-2.5 h-2.5" />
                              <span>VIP</span>
                            </span>
                          )}
                          {passenger.specialAssistance && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-950 border border-[#1A1A1A] text-[9px] font-bold flex items-center space-x-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>ASSIST</span>
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
                    No passenger records match the filter criteria.
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
