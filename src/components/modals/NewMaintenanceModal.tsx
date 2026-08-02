import React, { useState } from 'react';
import { X, Wrench } from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const NewMaintenanceModal: React.FC = () => {
  const { isNewMaintenanceModalOpen, setIsNewMaintenanceModalOpen, addMaintenanceLog, flights } = useOperational();

  const [aircraftId, setAircraftId] = useState('VT-ABC');
  const [flightNumber, setFlightNumber] = useState('');
  const [issueDescription, setIssueDescription] = useState('Avionics Radar Transceiver Fault');
  const [component, setComponent] = useState('Avionics');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [maintenanceType, setMaintenanceType] = useState('Inspection');
  const [estimatedHours, setEstimatedHours] = useState(8);

  if (!isNewMaintenanceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceLog({
      workOrderId: `WO-${Date.now().toString().slice(-6)}`,
      aircraftId,
      flightNumber,
      maintenanceType,
      technicianId: `TECH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      reportedAt: new Date().toISOString(),
      resolvedAt: '',
      priority: severity === 'Critical' ? 5 : severity === 'High' ? 4 : severity === 'Medium' ? 3 : 2,
      estimatedHours,
      issueDescription,
      component,
      severity,
      assignedTeam: `Team-${Math.floor(Math.random() * 10)}`,
      isGrounded: severity === 'Critical',
      isRecurring: false,
      status: 'Pending',
    });
    setIsNewMaintenanceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto font-mono text-xs">
      <div className="bg-white border border-[#1A1A1A] max-w-lg w-full overflow-hidden my-8 text-[#1A1A1A]">
        <div className="bg-[#1A1A1A] px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between text-white">
          <div className="flex items-center space-x-2 font-bold text-base uppercase tracking-wider">
            <Wrench className="w-5 h-5 text-white" />
            <span>Issue Work Order</span>
          </div>
          <button onClick={() => setIsNewMaintenanceModalOpen(false)} className="text-white hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Aircraft ID</label>
              <input type="text" required value={aircraftId} onChange={(e) => setAircraftId(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Flight Number</label>
              <select value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none">
                <option value="">None</option>
                {flights.slice(0, 20).map((f) => (
                  <option key={f.id} value={f.flightNumber}>{f.flightNumber} ({f.aircraftType})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Issue Description</label>
            <input type="text" required value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Component</label>
              <input type="text" value={component} onChange={(e) => setComponent(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Est. Hours</label>
              <input type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(Number(e.target.value))} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[#555555] font-bold block mb-1 uppercase text-[10px] tracking-wider">Maintenance Type</label>
            <select value={maintenanceType} onChange={(e) => setMaintenanceType(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-2 text-[#1A1A1A] font-bold focus:outline-none">
              <option value="Inspection">Inspection</option>
              <option value="Repair">Repair</option>
              <option value="Replacement">Replacement</option>
              <option value="Overhaul">Overhaul</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1A1A1A]">
            <button type="button" onClick={() => setIsNewMaintenanceModalOpen(false)} className="px-4 py-2 bg-white text-[#1A1A1A] border border-[#1A1A1A] font-bold uppercase tracking-wider hover:bg-[#F2F1EF]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#1A1A1A] font-bold uppercase tracking-wider">
              Log Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
