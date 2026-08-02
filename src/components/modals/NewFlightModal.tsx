import React, { useState } from 'react';
import { X, Plane } from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const NewFlightModal: React.FC = () => {
  const { isNewFlightModalOpen, setIsNewFlightModalOpen, addFlight } = useOperational();

  const [flightNumber, setFlightNumber] = useState('UK-305');
  const [airline, setAirline] = useState('Vistara');
  const [aircraftType, setAircraftType] = useState('A320');
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [terminal, setTerminal] = useState('Terminal A');
  const [gate, setGate] = useState('A01');
  const [passengerCount, setPassengerCount] = useState(180);
  const [capacity, setCapacity] = useState(200);

  if (!isNewFlightModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFlight({
      flightNumber,
      airline,
      airlineCode: airline.substring(0, 2).toUpperCase(),
      origin,
      destination,
      terminal,
      gate,
      scheduledDeparture: new Date().toISOString(),
      actualDeparture: '',
      scheduledArrival: new Date(Date.now() + 4 * 3600000).toISOString(),
      actualArrival: '',
      aircraftType,
      tailNumber: `VT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      capacity: Number(capacity),
      passengerCount: Number(passengerCount),
      status: 'Scheduled',
      delayMinutes: 0,
      delayReason: '',
      bridgeConnected: false,
      distanceKm: 0,
      fuelCost: 0,
      boardingTime: '',
      weatherFlag: false,
      loadFactor: 'Moderate',
      taxiTime: 0,
      timeOfDay: 'Morning',
      dayOfWeek: 'Sat',
      isHoliday: false,
      season: 'Summer',
      routeType: 'Domestic',
    });
    setIsNewFlightModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white border border-[#1A1A1A] max-w-lg w-full overflow-hidden my-8 font-mono text-xs text-[#1A1A1A]">
        <div className="bg-[#1A1A1A] px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between text-white">
          <div className="flex items-center space-x-2 font-bold text-base uppercase tracking-wider">
            <Plane className="w-5 h-5 text-white" />
            <span>Dispatch New Flight</span>
          </div>
          <button onClick={() => setIsNewFlightModalOpen(false)} className="text-white hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Flight Number</label>
              <input
                type="text"
                required
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Airline</label>
              <input
                type="text"
                required
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Origin</label>
              <input type="text" required value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Destination</label>
              <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Terminal</label>
              <select value={terminal} onChange={(e) => setTerminal(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none">
                <option value="Terminal A">Terminal A</option>
                <option value="Terminal B">Terminal B</option>
                <option value="Terminal C">Terminal C</option>
              </select>
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Gate</label>
              <select value={gate} onChange={(e) => setGate(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none">
                {['A01', 'A02', 'A03', 'A04', 'B01', 'B02', 'B03', 'B04', 'B05', 'C01', 'C02', 'C03'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Aircraft</label>
              <input type="text" value={aircraftType} onChange={(e) => setAircraftType(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Passengers</label>
              <input type="number" value={passengerCount} onChange={(e) => setPassengerCount(Number(e.target.value))} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1A1A1A]">
            <button type="button" onClick={() => setIsNewFlightModalOpen(false)} className="px-4 py-2 bg-white text-[#1A1A1A] border border-[#1A1A1A] font-bold uppercase tracking-wider hover:bg-[#F2F1EF]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#1A1A1A] font-bold uppercase tracking-wider">
              Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
