import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plane
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const MaintenanceFleet: React.FC = () => {
  const { 
    maintenance, 
    flights, 
    resolveMaintenance, 
    setIsNewMaintenanceModalOpen
  } = useOperational();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredMaintenance = maintenance.filter((m) => 
    severityFilter === 'ALL' || m.severity === severityFilter
  );

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Header Bar */}
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-[#1A1A1A]" />
          <h2 className="text-base font-bold text-[#1A1A1A] uppercase font-mono tracking-wider">Maintenance Work Orders</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            {['ALL', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                  severityFilter === sev
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewMaintenanceModalOpen(true)}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold flex items-center space-x-1.5 border border-[#1A1A1A] text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Log Work Order</span>
          </button>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaintenance.map((m) => {
          const flight = flights.find((f) => f.flightNumber === m.flightNumber);
          return (
            <div
              key={m.id}
              className={`bg-white border border-[#1A1A1A] p-5 space-y-4 ${
                m.severity === 'Critical' ? 'bg-rose-50 border-rose-800' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                <div>
                  <div className="text-base font-bold text-[#1A1A1A] font-mono">{m.issueDescription}</div>
                  <div className="text-[10px] text-[#555555] font-mono">
                    Aircraft: <span className="text-[#1A1A1A] font-bold">{m.aircraftId}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                    m.severity === 'Critical' ? 'bg-rose-100 text-rose-950' :
                    m.severity === 'High' ? 'bg-amber-100 text-amber-950' :
                    'bg-[#F2F1EF] text-[#1A1A1A]'
                  }`}>
                    {m.severity}
                  </span>

                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                    m.status === 'Resolved' ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Work Order Details */}
              <div className="bg-[#F9F8F6] p-3 border border-[#1A1A1A] space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-bold">Work Order:</span>
                  <span className="font-bold text-[#1A1A1A]">{m.workOrderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-bold">Type:</span>
                  <span className="font-bold text-[#1A1A1A]">{m.maintenanceType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-bold">Component:</span>
                  <span className="font-bold text-[#1A1A1A]">{m.component}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-bold">Est. Hours:</span>
                  <span className="font-bold text-[#1A1A1A]">{m.estimatedHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-bold">Grounded:</span>
                  <span className={`font-bold ${m.isGrounded ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {m.isGrounded ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>

              {/* Linked Flight */}
              {flight && (
                <div className="bg-[#F9F8F6] p-2.5 border border-[#1A1A1A] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">Affected Flight</div>
                    <div className="font-bold text-[#1A1A1A] text-xs">{flight.flightNumber} ({flight.airline})</div>
                  </div>
                </div>
              )}

              {/* Assigned Team */}
              <div className="text-[11px] text-[#555555]">
                Team: <span className="text-[#1A1A1A] font-bold">{m.assignedTeam}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
                <div className="text-[10px] text-[#555555]">
                  Reported: <span className="text-[#1A1A1A] font-bold">
                    {m.reportedAt ? new Date(m.reportedAt).toUTCString().slice(17, 22) : 'N/A'} UTC
                  </span>
                </div>

                {m.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveMaintenance(m.id)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition flex items-center space-x-1 border border-[#1A1A1A] text-xs uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sign Off</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
