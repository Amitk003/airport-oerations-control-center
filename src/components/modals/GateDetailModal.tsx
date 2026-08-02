import React from 'react';
import { 
  X, 
  DoorOpen, 
  Plane, 
  Zap, 
  Link2, 
  AlertTriangle, 
  CheckCircle2, 
  Users,
  Clock
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const GateDetailModal: React.FC = () => {
  const { 
    selectedGateId, 
    gateEvents, 
    flights, 
    staff, 
    closeModals,
    toggleGateBridge,
    toggleGatePower,
    openFlightDetail
  } = useOperational();

  if (!selectedGateId) return null;

  const gateEvent = gateEvents.find((g) => g.gate === selectedGateId);
  const gateFlight = flights.find((f) => f.gate === selectedGateId);
  const assignedGateStaff = staff.filter((s) => s.assignedGate === selectedGateId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white border border-[#1A1A1A] max-w-2xl w-full overflow-hidden my-8 text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white text-[#1A1A1A] border border-[#1A1A1A] font-mono font-bold">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold font-mono text-white">Gate {selectedGateId}</h2>
                <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase border border-white bg-emerald-100 text-emerald-950">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#CCCCCC] font-mono">
                {gateEvent?.terminal || 'Terminal'} • Gate Telemetry & Controls
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 font-mono text-xs">
          {/* Emergency Banner */}
          {gateEvent?.isEmergency && (
            <div className="bg-rose-100 border border-[#1A1A1A] p-3 flex items-start space-x-2.5 text-rose-950 font-bold">
              <AlertTriangle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-950 uppercase tracking-wider text-xs">Emergency Event Active</div>
                <div className="text-xs text-rose-900 mt-0.5">This gate has an active emergency event.</div>
              </div>
            </div>
          )}

          {/* Gate Event Info */}
          {gateEvent && (
            <div className="bg-[#F9F8F6] p-4 border border-[#1A1A1A] space-y-3">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center space-x-2 uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                <Clock className="w-4 h-4 text-[#1A1A1A]" />
                <span>Current Gate Event</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#666666] font-bold">Event Type:</span>{' '}
                  <span className="font-bold text-[#1A1A1A]">{gateEvent.eventType}</span>
                </div>
                <div className="bg-white p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#666666] font-bold">Duration:</span>{' '}
                  <span className="font-bold text-[#1A1A1A]">{gateEvent.durationMinutes} min</span>
                </div>
                <div className="bg-white p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#666666] font-bold">Priority:</span>{' '}
                  <span className="font-bold text-[#1A1A1A]">{gateEvent.priority}</span>
                </div>
                <div className="bg-white p-2.5 border border-[#1A1A1A]">
                  <span className="text-[#666666] font-bold">Staff:</span>{' '}
                  <span className="font-bold text-[#1A1A1A]">{gateEvent.staffId}</span>
                </div>
              </div>
            </div>
          )}

          {/* Equipment Controls */}
          <div className="bg-[#F9F8F6] p-4 border border-[#1A1A1A] space-y-3">
            <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center space-x-2 uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
              <Zap className="w-4 h-4 text-[#1A1A1A]" />
              <span>Ground Support Controls</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 border border-[#1A1A1A] flex items-center justify-between">
                <div>
                  <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Jet Bridge</div>
                  <div className="font-bold text-[#1A1A1A] flex items-center space-x-1.5 mt-0.5">
                    <Link2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>{gateEvent?.bridgeConnected ? 'CONNECTED' : 'RETRACTED'}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleGateBridge(selectedGateId)}
                  className={`px-3 py-1.5 font-bold text-xs border uppercase tracking-wider transition ${
                    gateEvent?.bridgeConnected
                      ? 'bg-rose-100 text-rose-950 border-[#1A1A1A] hover:bg-rose-200'
                      : 'bg-emerald-800 text-white border-[#1A1A1A] hover:bg-emerald-900'
                  }`}
                >
                  {gateEvent?.bridgeConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

              <div className="bg-white p-3 border border-[#1A1A1A] flex items-center justify-between">
                <div>
                  <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Ground Power Unit</div>
                  <div className="font-bold text-[#1A1A1A] flex items-center space-x-1.5 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>{gateEvent?.powerSupplied ? 'ACTIVE 400Hz' : 'POWER OFF'}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleGatePower(selectedGateId)}
                  className={`px-3 py-1.5 font-bold text-xs border uppercase tracking-wider transition ${
                    gateEvent?.powerSupplied
                      ? 'bg-rose-100 text-rose-950 border-[#1A1A1A] hover:bg-rose-200'
                      : 'bg-emerald-800 text-white border-[#1A1A1A] hover:bg-emerald-900'
                  }`}
                >
                  {gateEvent?.powerSupplied ? 'Power Off' : 'Engage'}
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Flight */}
          {gateFlight && (
            <div className="bg-[#F9F8F6] p-4 border border-[#1A1A1A] space-y-3">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center space-x-2 uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                <Plane className="w-4 h-4 text-[#1A1A1A]" />
                <span>Assigned Aircraft</span>
              </h3>
              <div className="bg-white p-3 border border-[#1A1A1A] flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-[#1A1A1A]">{gateFlight.flightNumber} - {gateFlight.airline}</div>
                  <div className="text-xs text-[#555555] mt-0.5">{gateFlight.aircraftType} • {gateFlight.origin} → {gateFlight.destination}</div>
                </div>
                <button
                  onClick={() => {
                    closeModals();
                    openFlightDetail(gateFlight.id);
                  }}
                  className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#1A1A1A] font-bold text-xs uppercase tracking-wider transition"
                >
                  Inspect
                </button>
              </div>
            </div>
          )}

          {/* Assigned Staff */}
          {assignedGateStaff.length > 0 && (
            <div className="bg-[#F9F8F6] p-4 border border-[#1A1A1A] space-y-2">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center space-x-2 uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                <Users className="w-4 h-4 text-[#1A1A1A]" />
                <span>Assigned Personnel</span>
              </h3>
              <div className="space-y-1.5">
                {assignedGateStaff.map((s) => (
                  <div key={s.id} className="bg-white p-2.5 border border-[#1A1A1A] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1A1A1A]">{s.staffName}</span>
                      <span className="text-[#555555] ml-2">({s.department} - {s.role})</span>
                    </div>
                    <span className="text-[#555555] font-bold">{s.contactNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F9F8F6] px-6 py-3 border-t border-[#1A1A1A] flex justify-end">
          <button
            onClick={closeModals}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
