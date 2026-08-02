import React from 'react';
import { 
  X, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  DoorOpen, 
  Plane
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const IncidentDetailModal: React.FC = () => {
  const { 
    selectedAlertId, 
    alerts, 
    closeModals, 
    resolveAlert,
    openFlightDetail,
    openGateDetail
  } = useOperational();

  if (!selectedAlertId) return null;

  const alert = alerts.find((a) => a.id === selectedAlertId);
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white border border-[#1A1A1A] max-w-xl w-full overflow-hidden my-8 text-[#1A1A1A]">
        <div className="bg-[#1A1A1A] px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className={`p-2 border font-mono font-bold ${
              alert.severity === 'CRITICAL' ? 'bg-rose-100 border-[#1A1A1A] text-rose-950' :
              alert.severity === 'WARNING' ? 'bg-amber-100 border-[#1A1A1A] text-amber-950' :
              'bg-blue-100 border-[#1A1A1A] text-blue-950'
            }`}>
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-white ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-950' :
                  alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-950' :
                  'bg-blue-100 text-blue-950'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-[#CCCCCC] font-mono">{alert.category}</span>
              </div>
              <h2 className="text-base font-bold text-white font-mono mt-0.5">{alert.title}</h2>
            </div>
          </div>
          <button
            onClick={closeModals}
            className="p-1.5 text-white hover:bg-white/20 border border-white font-mono transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 font-mono text-xs">
          <div className="bg-[#F9F8F6] p-3 border border-[#1A1A1A] space-y-1">
            <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Timestamp</div>
            <div className="text-[#1A1A1A] font-bold">{new Date(alert.timestamp).toUTCString()}</div>
          </div>

          <div className="bg-[#F9F8F6] p-4 border border-[#1A1A1A] space-y-2">
            <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Situation Briefing</div>
            <div className="text-[#1A1A1A] text-sm leading-relaxed">{alert.description}</div>
          </div>

          {alert.resolutionAction && (
            <div className="bg-blue-50 border border-[#1A1A1A] p-4 space-y-1">
              <div className="text-blue-950 font-bold uppercase text-[10px] tracking-wider">Recommended Protocol:</div>
              <div className="text-blue-900 font-bold">{alert.resolutionAction}</div>
            </div>
          )}

          {alert.entityId && (
            <div className="flex items-center space-x-3 pt-2">
              <span className="text-[#555555] font-bold">Target:</span>
              {alert.entityType === 'flight' && (
                <button
                  onClick={() => { closeModals(); openFlightDetail(alert.entityId!); }}
                  className="px-3 py-1 bg-[#1A1A1A] border border-[#1A1A1A] text-white hover:bg-[#333333] font-bold uppercase tracking-wider transition flex items-center space-x-1.5"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Inspect Flight</span>
                </button>
              )}
              {alert.entityType === 'gate' && (
                <button
                  onClick={() => { closeModals(); openGateDetail(alert.entityId!); }}
                  className="px-3 py-1 bg-[#1A1A1A] border border-[#1A1A1A] text-white hover:bg-[#333333] font-bold uppercase tracking-wider transition flex items-center space-x-1.5"
                >
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span>Inspect Gate</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#F9F8F6] px-6 py-4 border-t border-[#1A1A1A] flex items-center justify-between">
          <div className="text-xs font-mono text-[#555555]">
            Status: {alert.resolved ? <span className="text-emerald-800 font-bold">RESOLVED</span> : <span className="text-rose-800 font-bold">UNRESOLVED</span>}
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={closeModals} className="px-4 py-2 bg-white hover:bg-[#F2F1EF] text-[#1A1A1A] border border-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider transition">
              Cancel
            </button>
            {!alert.resolved && (
              <button
                onClick={() => { resolveAlert(alert.id, 'Action executed by Operations Controller'); closeModals(); }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white border border-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolve</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
