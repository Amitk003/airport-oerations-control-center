import React from 'react';
import { 
  X, 
  Plane, 
  Building2, 
  Users, 
  Luggage, 
  Wrench, 
  Clock, 
  ShieldCheck,
  MapPin,
  Fuel
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const FlightDetailModal: React.FC = () => {
  const { 
    selectedFlightId, 
    flights, 
    gateEvents, 
    passengers, 
    baggage, 
    maintenance, 
    staff,
    closeModals,
    updateFlightStatus,
    reassignGate
  } = useOperational();

  if (!selectedFlightId) return null;

  const flight = flights.find((f) => f.id === selectedFlightId);
  if (!flight) return null;

  // Cross-table relationships
  const gateEvent = gateEvents.find((g) => g.gate === flight.gate);
  const flightPassengers = passengers.filter((p) => p.flightNumber === flight.flightNumber);
  const flightBaggage = baggage.filter((b) => b.flightNumber === flight.flightNumber);
  const flightMaintenance = maintenance.filter((m) => m.flightNumber === flight.flightNumber);

  const boardedPassengers = flightPassengers.filter((p) => p.status === 'Boarded').length;
  const boardingProgress = flightPassengers.length > 0 ? Math.round((boardedPassengers / flightPassengers.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white border border-[#1A1A1A] max-w-4xl w-full overflow-hidden my-8 text-[#1A1A1A]">
        {/* Header */}
        <div className="bg-[#1A1A1A] px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white text-[#1A1A1A] border border-[#1A1A1A] font-mono font-bold">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold font-mono text-white">{flight.flightNumber}</h2>
                <span className={`px-2 py-0.5 text-xs font-mono font-bold uppercase border border-white ${
                  flight.status === 'On Time' || flight.status === 'Departed' ? 'bg-emerald-100 text-emerald-950' :
                  flight.status === 'Boarding' ? 'bg-blue-100 text-blue-950' :
                  flight.status === 'Delayed' || flight.status === 'Maintenance' ? 'bg-rose-100 text-rose-950' :
                  'bg-[#F2F1EF] text-[#1A1A1A]'
                }`}>
                  {flight.status}
                </span>
              </div>
              <p className="text-xs text-[#CCCCCC] font-mono">
                {flight.airline} ({flight.airlineCode}) • {flight.aircraftType} • <span className="text-white font-bold">{flight.origin} → {flight.destination}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeModals}
            className="p-1.5 text-white hover:bg-white/20 border border-white font-mono transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-mono text-xs">
          {/* Quick Actions & Status Control Strip */}
          <div className="bg-[#F9F8F6] border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#666666] uppercase font-bold tracking-wider">Quick Status Override</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {(['On Time', 'Boarding', 'Departed', 'Delayed', 'Scheduled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateFlightStatus(flight.id, st)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold border transition uppercase tracking-wider ${
                      flight.status === st
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#F2F1EF]'
                    }`}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#555555] font-bold uppercase">Gate:</span>
              <select
                value={flight.gate}
                onChange={(e) => reassignGate(flight.id, e.target.value, flight.terminal)}
                className="bg-white border border-[#1A1A1A] text-[#1A1A1A] text-xs font-mono font-bold px-2.5 py-1.5 focus:outline-none"
              >
                {['A01', 'A02', 'A03', 'A04', 'B01', 'B02', 'B03', 'B04', 'B05', 'C01', 'C02', 'C03'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Flight Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Scheduled Departure</div>
              <div className="text-[#1A1A1A] font-bold text-sm mt-0.5">
                {flight.scheduledDeparture ? new Date(flight.scheduledDeparture).toUTCString().slice(17, 22) : '--:--'} UTC
              </div>
              <div className="text-[#555555] text-[10px] mt-1">Actual: {flight.actualDeparture ? new Date(flight.actualDeparture).toUTCString().slice(17, 22) : 'Pending'}</div>
            </div>

            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Scheduled Arrival</div>
              <div className="text-[#1A1A1A] font-bold text-sm mt-0.5">
                {flight.scheduledArrival ? new Date(flight.scheduledArrival).toUTCString().slice(17, 22) : '--:--'} UTC
              </div>
            </div>

            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Aircraft & Tail</div>
              <div className="text-[#1A1A1A] font-bold text-sm mt-0.5">{flight.aircraftType}</div>
              <div className="text-[#555555] text-[10px] mt-1">Tail: {flight.tailNumber}</div>
            </div>

            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Route Info</div>
              <div className="text-[#1A1A1A] font-bold text-sm mt-0.5">{flight.routeType}</div>
              <div className="text-[#555555] text-[10px] mt-1">{flight.distanceKm} km</div>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Passengers</div>
              <div className="text-[#1A1A1A] font-bold text-lg mt-0.5">{flight.passengerCount}/{flight.capacity}</div>
              <div className="text-[10px] text-[#555555]">{flight.capacity > 0 ? Math.round((flight.passengerCount / flight.capacity) * 100) : 0}% load factor</div>
            </div>

            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Delay</div>
              <div className={`font-bold text-lg mt-0.5 ${flight.delayMinutes > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {flight.delayMinutes > 0 ? `${flight.delayMinutes}min` : 'On time'}
              </div>
              {flight.delayReason && <div className="text-[10px] text-rose-700">{flight.delayReason}</div>}
            </div>

            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Fuel Cost</div>
              <div className="text-[#1A1A1A] font-bold text-lg mt-0.5">₹{flight.fuelCost.toLocaleString()}</div>
            </div>

            <div className="bg-white border border-[#1A1A1A] p-3">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Weather</div>
              <div className="text-[#1A1A1A] font-bold text-lg mt-0.5">{flight.weatherFlag ? 'Adverse' : 'Clear'}</div>
            </div>
          </div>

          {/* Gate Telemetry */}
          {gateEvent && (
            <div className="bg-white border border-[#1A1A1A] p-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] font-mono flex items-center space-x-2 mb-3 uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                <Building2 className="w-4 h-4 text-[#1A1A1A]" />
                <span>Gate Event Telemetry</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#F9F8F6] p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#555555] font-bold">Event:</span>{' '}
                  <span className="font-bold text-[#1A1A1A]">{gateEvent.eventType}</span>
                </div>
                <div className="bg-[#F9F8F6] p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#555555] font-bold">Bridge:</span>{' '}
                  <span className={gateEvent.bridgeConnected ? 'text-emerald-950 font-bold' : 'text-[#555555]'}>{gateEvent.bridgeConnected ? 'Connected' : 'Off'}</span>
                </div>
                <div className="bg-[#F9F8F6] p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#555555] font-bold">Duration:</span>{' '}
                  <span className="font-bold text-[#1A1A1A]">{gateEvent.durationMinutes}min</span>
                </div>
                <div className="bg-[#F9F8F6] p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#555555] font-bold">Emergency:</span>{' '}
                  <span className={gateEvent.isEmergency ? 'text-rose-700 font-bold' : 'text-[#555555]'}>{gateEvent.isEmergency ? 'YES' : 'NO'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Manifest */}
          <div className="bg-white border border-[#1A1A1A] p-4">
            <div className="flex items-center justify-between mb-3 border-b border-[#1A1A1A] pb-2">
              <h3 className="text-sm font-bold text-[#1A1A1A] font-mono flex items-center space-x-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#1A1A1A]" />
                <span>Passenger Manifest ({flightPassengers.length} records)</span>
              </h3>
              <div className="text-xs font-mono font-bold text-[#1A1A1A]">
                Boarded: {boardedPassengers}/{flightPassengers.length} ({boardingProgress}%)
              </div>
            </div>

            <div className="w-full bg-[#F2F1EF] border border-[#1A1A1A] h-2 overflow-hidden mb-3">
              <div className="bg-[#1A1A1A] h-full transition-all duration-500" style={{ width: `${boardingProgress}%` }}></div>
            </div>

            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase border-b border-[#1A1A1A] tracking-wider sticky top-0">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">PNR</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Seat</th>
                    <th className="p-2">Nationality</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
                  {flightPassengers.slice(0, 20).map((ps) => (
                    <tr key={ps.id} className="hover:bg-[#F9F8F6]">
                      <td className="p-2 font-bold text-[#1A1A1A]">{ps.firstName} {ps.lastName}</td>
                      <td className="p-2 text-[#333333]">{ps.pnrCode}</td>
                      <td className="p-2 text-[#333333] font-bold">{ps.ticketClass}</td>
                      <td className="p-2 text-[#333333]">{ps.seatNumber}</td>
                      <td className="p-2 text-[#333333]">{ps.nationality}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                          ps.status === 'Boarded' ? 'bg-emerald-100 text-emerald-950' :
                          ps.status === 'Boarding' ? 'bg-blue-100 text-blue-950' :
                          'bg-[#F2F1EF] text-[#1A1A1A]'
                        }`}>
                          {ps.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {flightPassengers.length > 20 && (
              <div className="text-center text-[10px] text-[#555555] mt-2">Showing 20 of {flightPassengers.length} passengers</div>
            )}
          </div>

          {/* Baggage */}
          {flightBaggage.length > 0 && (
            <div className="bg-white border border-[#1A1A1A] p-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] font-mono flex items-center space-x-2 mb-3 uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                <Luggage className="w-4 h-4 text-[#1A1A1A]" />
                <span>Baggage ({flightBaggage.length} items)</span>
              </h3>
              <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase border-b border-[#1A1A1A] tracking-wider sticky top-0">
                    <tr>
                      <th className="p-2">Bag Tag</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Location</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
                    {flightBaggage.slice(0, 10).map((bg) => (
                      <tr key={bg.id} className="hover:bg-[#F9F8F6]">
                        <td className="p-2 font-bold text-[#1A1A1A]">#{bg.bagTag}</td>
                        <td className="p-2 text-[#333333]">{bg.weightKg.toFixed(1)} kg</td>
                        <td className="p-2 text-[#333333]">{bg.location}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                            bg.currentStatus === 'Loaded' ? 'bg-emerald-100 text-emerald-950' :
                            bg.currentStatus === 'Delayed' ? 'bg-rose-100 text-rose-950' :
                            'bg-amber-100 text-amber-950'
                          }`}>
                            {bg.currentStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          {bg.isDangerous && <span className="px-1 bg-rose-100 text-rose-950 text-[9px] font-bold">DGR</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Maintenance */}
          {flightMaintenance.length > 0 && (
            <div className="bg-white border border-rose-800 p-4">
              <h3 className="text-sm font-bold text-rose-950 font-mono flex items-center space-x-2 mb-3 uppercase tracking-wider border-b border-rose-800 pb-2">
                <Wrench className="w-4 h-4 text-rose-800" />
                <span>Maintenance Work Orders</span>
              </h3>
              <div className="space-y-2">
                {flightMaintenance.map((m) => (
                  <div key={m.id} className="bg-rose-50 p-3 border border-[#1A1A1A] text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#1A1A1A]">{m.issueDescription} - <span className="text-rose-900 font-bold">Severity: {m.severity}</span></div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                        m.status === 'Resolved' ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="text-[#555555] text-[11px] mt-1">Team: {m.assignedTeam} • Est: {m.estimatedHours}h</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F9F8F6] px-6 py-3 border-t border-[#1A1A1A] flex justify-end">
          <button
            onClick={closeModals}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
