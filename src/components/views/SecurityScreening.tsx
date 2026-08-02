import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Minus,
  ShieldAlert,
  Building2
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const SecurityScreening: React.FC = () => {
  const { security, selectedTerminal, updateSecurityLanes } = useOperational();

  const filteredSecurity = selectedTerminal === 'ALL'
    ? security
    : security.filter((s) => s.terminal === selectedTerminal);

  // Deduplicate by checkpoint
  const uniqueCheckpoints = filteredSecurity.reduce((acc, sc) => {
    if (!acc.find(s => s.checkpointId === sc.checkpointId)) {
      acc.push(sc);
    }
    return acc;
  }, [] as typeof filteredSecurity);

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Active Checkpoints</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{uniqueCheckpoints.length}</div>
          <div className="text-[10px] text-[#555555] mt-1">Terminals A, B, C</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Queue Length</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {security.reduce((acc, s) => acc + s.queueLength, 0)} pax
          </div>
          <div className="text-[10px] text-purple-950 mt-1">Passengers in line</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Avg Wait Time</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {security.length > 0 ? Math.round(security.reduce((acc, s) => acc + s.waitTimeMinutes, 0) / security.length) : 0} min
          </div>
          <div className="text-[10px] text-[#555555] mt-1">SLA Target &lt; 15 min</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Screening Throughput</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {security.reduce((acc, s) => acc + s.lanesOpen * s.throughputPerMin, 0)} /min
          </div>
          <div className="text-[10px] text-emerald-900 mt-1">Across open lanes</div>
        </div>
      </div>

      {/* Checkpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueCheckpoints.map((sc) => {
          const isHighWait = sc.waitTimeMinutes > 20;
          return (
            <div
              key={sc.id}
              className={`bg-white border border-[#1A1A1A] p-5 space-y-4 transition ${
                isHighWait ? 'bg-purple-50 border-purple-800' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#1A1A1A]" />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-base font-mono">{sc.checkpointId}</h3>
                    <p className="text-[10px] text-[#555555] font-mono">{sc.terminal}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase border border-[#1A1A1A] ${
                  sc.threatLevel === 'HIGH' ? 'bg-rose-100 text-rose-950' :
                  sc.threatLevel === 'ELEVATED' ? 'bg-amber-100 text-amber-950' :
                  'bg-emerald-100 text-emerald-950'
                }`}>
                  Threat: {sc.threatLevel}
                </span>
              </div>

              {/* Wait Time Indicator */}
              <div className="grid grid-cols-2 gap-3 bg-[#F9F8F6] p-3 border border-[#1A1A1A]">
                <div>
                  <div className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">Queue Line</div>
                  <div className="text-xl font-bold text-[#1A1A1A] mt-0.5">{sc.queueLength} pax</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">Est. Wait Time</div>
                  <div className={`text-xl font-bold mt-0.5 ${isHighWait ? 'text-rose-800' : 'text-[#1A1A1A]'}`}>
                    {sc.waitTimeMinutes} min
                  </div>
                </div>
              </div>

              {/* Scanner Info */}
              <div className="bg-[#F9F8F6] p-3 border border-[#1A1A1A] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#666666] font-bold">Scanner:</span>
                  <span className="font-bold text-[#1A1A1A]">{sc.scannerId}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#666666] font-bold">Capacity:</span>
                  <span className="font-bold text-[#1A1A1A]">{sc.lanesOpen} / {sc.maxCapacity}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#666666] font-bold">Shift:</span>
                  <span className="font-bold text-[#1A1A1A]">{sc.shiftId}</span>
                </div>
              </div>

              {/* Open Lanes Controls */}
              <div className="bg-[#F9F8F6] p-3.5 border border-[#1A1A1A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#1A1A1A] font-bold">Active Lanes:</span>
                  <span className="text-[#1A1A1A] font-bold text-sm">{sc.lanesOpen} / {sc.maxCapacity}</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    disabled={sc.lanesOpen <= 1}
                    onClick={() => updateSecurityLanes(sc.checkpointId, sc.lanesOpen - 1)}
                    className="flex-1 py-1.5 bg-white hover:bg-[#F2F1EF] disabled:opacity-40 text-[#1A1A1A] border border-[#1A1A1A] font-bold flex items-center justify-center space-x-1 text-xs uppercase tracking-wider"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Close Lane</span>
                  </button>

                  <button
                    disabled={sc.lanesOpen >= sc.maxCapacity}
                    onClick={() => updateSecurityLanes(sc.checkpointId, sc.lanesOpen + 1)}
                    className="flex-1 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-40 text-white font-bold flex items-center justify-center space-x-1 border border-[#1A1A1A] text-xs uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Open Lane</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
