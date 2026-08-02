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
  const { flights, gateEvents, baggage, security, maintenance, alerts, passengers } = useOperational();

  const activeIncidentsCount = alerts.filter(a => !a.resolved).length;
  const delayedFlightsCount = flights.filter(f => f.status === 'Delayed' || f.status === 'Maintenance').length;
  const gateConflictsCount = gateEvents.filter(g => g.status === 'Conflict').length;
  const baggageDelayedCount = baggage.filter(b => b.currentStatus === 'Delayed' || b.currentStatus === 'Lost').length;
  const highSecurityWaitCount = security.filter(s => s.waitTimeMinutes > 20).length;
  const criticalMaintenanceCount = maintenance.filter(m => m.status !== 'Resolved' && (m.severity === 'High' || m.severity === 'Critical')).length;
  const passengerCount = passengers.length;

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Ops Dashboard', icon: LayoutDashboard },
    { id: 'flights', label: 'Flights', icon: Plane, badge: delayedFlightsCount, badgeColor: 'bg-amber-600 text-amber-100' },
    { id: 'gates', label: 'Gates', icon: DoorOpen, badge: gateConflictsCount, badgeColor: 'bg-rose-600 text-rose-100' },
    { id: 'baggage', label: 'Baggage', icon: Luggage, badge: baggageDelayedCount, badgeColor: 'bg-amber-600 text-amber-100' },
    { id: 'passengers', label: 'Passengers', icon: UserCheck, badge: passengerCount, badgeColor: 'bg-blue-600 text-blue-100' },
    { id: 'security', label: 'Security', icon: ShieldCheck, badge: highSecurityWaitCount, badgeColor: 'bg-purple-600 text-purple-100' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: criticalMaintenanceCount, badgeColor: 'bg-rose-600 text-rose-100' },
    { id: 'staff', label: 'Staffing', icon: Users },
    { id: 'retail', label: 'Retail', icon: ShoppingBag },
    { id: 'incidents', label: 'Incidents', icon: AlertOctagon, badge: activeIncidentsCount, badgeColor: 'bg-rose-600 text-white font-bold animate-pulse' },
    { id: 'dataset', label: 'Datasets', icon: FileSpreadsheet },
  ];

  return (
    <nav className="bg-white border-b border-[#1A1A1A] sticky top-[108px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center overflow-x-auto space-x-1 py-2 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold font-mono whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#F9F8F6] text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:bg-white border-[#1A1A1A]/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1A1A1A]/70'}`} />
              <span className="uppercase tracking-wider">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-mono font-bold border ${
                  isActive ? 'bg-white text-[#1A1A1A] border-white' : 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
