import React from 'react';
import { 
  LayoutDashboard, 
  Plane, 
  DoorOpen, 
  Luggage, 
  ShieldCheck, 
  Wrench, 
  Users, 
  ShoppingBag, 
  AlertOctagon, 
  FileSpreadsheet,
  UserCheck
} from 'lucide-react';
import { useOperational } from '../context/OperationalContext';

export type ActiveTab = 
  | 'overview' 
  | 'flights' 
  | 'gates' 
  | 'baggage' 
  | 'passengers'
  | 'security' 
  | 'maintenance' 
  | 'staff' 
  | 'retail' 
  | 'incidents' 
  | 'dataset';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { flights, gateEvents, baggage, security, maintenance, alerts } = useOperational();

  const activeIncidentsCount = alerts.filter(a => !a.resolved).length;
  const delayedFlightsCount = flights.filter(f => f.status === 'Delayed' || f.status === 'Maintenance').length;
  const gateConflictsCount = gateEvents.filter(g => g.status === 'Conflict').length;
  const baggageDelayedCount = baggage.filter(b => b.currentStatus === 'Delayed' || b.currentStatus === 'Lost').length;
  const highSecurityWaitCount = security.filter(s => s.waitTimeMinutes > 20).length;
  const criticalMaintenanceCount = maintenance.filter(m => m.status !== 'Resolved' && (m.severity === 'High' || m.severity === 'Critical')).length;

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flights', label: 'Flights', icon: Plane, badge: delayedFlightsCount },
    { id: 'gates', label: 'Gates', icon: DoorOpen, badge: gateConflictsCount },
    { id: 'baggage', label: 'Baggage', icon: Luggage, badge: baggageDelayedCount },
    { id: 'passengers', label: 'Passengers', icon: UserCheck },
    { id: 'security', label: 'Security', icon: ShieldCheck, badge: highSecurityWaitCount },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: criticalMaintenanceCount },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'retail', label: 'Retail', icon: ShoppingBag },
    { id: 'incidents', label: 'Alerts', icon: AlertOctagon, badge: activeIncidentsCount },
    { id: 'dataset', label: 'Data', icon: FileSpreadsheet },
  ];

  return (
    <nav className="bg-white border-b border-[#1A1A1A] sticky top-[108px] z-30">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold font-mono transition-all border ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-[#F9F8F6] text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:bg-white border-[#1A1A1A]/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1A1A1A]/70'}`} />
                <span className="uppercase tracking-wider">{tab.label}</span>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                    isActive ? 'bg-white text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
