import React from 'react';
import { 
  DoorOpen, 
  Plane, 
  Zap, 
  Link2, 
  AlertTriangle, 
  Building2
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const GateManagement: React.FC = () => {
  const { 
    gateEvents, 
    flights, 
    selectedTerminal, 
    openGateDetail, 
    toggleGateBridge, 
    toggleGatePower,
    openFlightDetail
  } = useOperational();

  const filteredGates = selectedTerminal === 'ALL' 
    ? gateEvents 
    : gateEvents.filter((g) => g.terminal === selectedTerminal);

  // Deduplicate gates by gate name (take first occurrence)
  const uniqueGates = filteredGates.reduce((acc, gate) => {
    if (!acc.find(g => g.gate === gate.gate)) {
      acc.push(gate);
    }
    return acc;
  }, [] as typeof filteredGates);

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Gates</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{uniqueGates.length}</div>
          <div className="text-[10px] text-[#555555] mt-1">Terminals A, B, C</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Gate Events</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{gateEvents.length}</div>
          <div className="text-[10px] text-emerald-900 mt-1">Activity Records</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Emergencies</div>
          <div className="text-2xl font-bold text-rose-800 mt-1">
            {gateEvents.filter(g => g.isEmergency).length}
          </div>
          <div className="text-[10px] text-rose-900 mt-1">Emergency Events</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Avg Duration</div>
          <div className="text-2xl font-bold text-blue-800 mt-1">
            {gateEvents.length > 0 ? Math.round(gateEvents.reduce((acc, g) => acc + g.durationMinutes, 0) / gateEvents.length) : 0}min
          </div>
          <div className="text-[10px] text-blue-900 mt-1">Gate Activity</div>
        </div>
      </div>

      {/* Gate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueGates.map((gate) => {
          const flight = flights.find((f) => f.gate === gate.gate);
          return (
            <div
              key={gate.id}
              className={`bg-white border border-[#1A1A1A] p-5 space-y-4 transition ${
                gate.isEmergency ? 'bg-rose-50 border-rose-800' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                <div className="flex items-center space-x-2">
                  <DoorOpen className="w-5 h-5 text-[#1A1A1A]" />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-base font-mono">Gate {gate.gate}</h3>
                    <p className="text-[10px] text-[#555555] font-mono">{gate.terminal}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {gate.isEmergency && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase border border-rose-800 bg-rose-100 text-rose-950">
                      EMERGENCY
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-bold font-mono uppercase border border-[#1A1A1A] ${
                    gate.priority === 'High' ? 'bg-rose-100 text-rose-950' :
                    gate.priority === 'Routine' ? 'bg-emerald-100 text-emerald-950' :
                    'bg-[#F2F1EF] text-[#1A1A1A]'
                  }`}>
                    {gate.priority}
                  </span>
                </div>
              </div>

              {/* Event Type */}
              <div className="bg-[#F9F8F6] p-3 border border-[#1A1A1A] space-y-1.5 font-mono">
                <div className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">Event Type</div>
                <div className="font-bold text-[#1A1A1A] text-sm">{gate.eventType}</div>
                <div className="text-[11px] text-[#333333]">
                  Duration: {gate.durationMinutes} min
                </div>
              </div>

              {/* Assigned Aircraft / Flight */}
              <div className="bg-[#F9F8F6] p-3 border border-[#1A1A1A] space-y-1.5 font-mono">
                <div className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">Assigned Flight</div>
                {flight ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#1A1A1A] text-sm">{flight.flightNumber}</div>
                      <div className="text-[11px] text-[#333333] font-bold">{flight.airline} • {flight.destination}</div>
                    </div>
                    <button
                      onClick={() => openFlightDetail(flight.id)}
                      className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#333333] border border-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider"
                    >
                      Inspect
                    </button>
                  </div>
                ) : (
                  <div className="text-[#666666] italic text-[11px]">No active aircraft position.</div>
                )}
              </div>

              {/* Equipment Control Switches */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <button
                  onClick={() => toggleGateBridge(gate.gate)}
                  className={`p-2.5 border border-[#1A1A1A] font-bold flex flex-col items-center justify-center space-y-1 transition ${
                    gate.bridgeConnected
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#F2F1EF]'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>Bridge: {gate.bridgeConnected ? 'Connected' : 'Off'}</span>
                </button>

                <button
                  onClick={() => toggleGatePower(gate.gate)}
                  className={`p-2.5 border border-[#1A1A1A] font-bold flex flex-col items-center justify-center space-y-1 transition ${
                    gate.powerSupplied
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#F2F1EF]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>GPU: {gate.powerSupplied ? 'Active' : 'Off'}</span>
                </button>
              </div>

              {/* Footer detail trigger */}
              <div className="pt-2 border-t border-[#1A1A1A] flex justify-end">
                <button
                  onClick={() => openGateDetail(gate.gate)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F2F1EF] text-[#1A1A1A] border border-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider transition"
                >
                  Gate Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
