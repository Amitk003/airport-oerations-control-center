import React, { useState } from 'react';
import { OperationalProvider } from './context/OperationalContext';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';

// Views
import { OverviewDashboard } from './components/views/OverviewDashboard';
import { FlightOperations } from './components/views/FlightOperations';
import { GateManagement } from './components/views/GateManagement';
import { BaggageTracking } from './components/views/BaggageTracking';
import { PassengerOperations } from './components/views/PassengerOperations';
import { SecurityScreening } from './components/views/SecurityScreening';
import { MaintenanceFleet } from './components/views/MaintenanceFleet';
import { StaffDispatch } from './components/views/StaffDispatch';
import { RetailAnalytics } from './components/views/RetailAnalytics';
import { IncidentCommand } from './components/views/IncidentCommand';
import { DatasetInspector } from './components/views/DatasetInspector';

// Modals
import { FlightDetailModal } from './components/modals/FlightDetailModal';
import { GateDetailModal } from './components/modals/GateDetailModal';
import { IncidentDetailModal } from './components/modals/IncidentDetailModal';
import { NewFlightModal } from './components/modals/NewFlightModal';
import { NewMaintenanceModal } from './components/modals/NewMaintenanceModal';

const views: { id: ActiveTab; Component: React.FC }[] = [
  { id: 'overview', Component: OverviewDashboard },
  { id: 'flights', Component: FlightOperations },
  { id: 'gates', Component: GateManagement },
  { id: 'baggage', Component: BaggageTracking },
  { id: 'passengers', Component: PassengerOperations },
  { id: 'security', Component: SecurityScreening },
  { id: 'maintenance', Component: MaintenanceFleet },
  { id: 'staff', Component: StaffDispatch },
  { id: 'retail', Component: RetailAnalytics },
  { id: 'incidents', Component: IncidentCommand },
  { id: 'dataset', Component: DatasetInspector },
];

function MainLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="min-h-screen bg-[#F2F1EF] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {views.map(({ id, Component }) => (
          <div
            key={id}
            style={{ display: activeTab === id ? 'block' : 'none' }}
          >
            <Component />
          </div>
        ))}
      </main>

      <footer className="border-t border-[#1A1A1A] bg-[#1A1A1A] text-white py-4 px-6 text-center text-xs font-mono">
        <div className="tracking-widest uppercase font-bold text-slate-200">
          AIRPORT OPERATIONS CONTROL CENTER (AOCC) - DEL AIRPORT
        </div>
        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
          System Operational - {new Date().getFullYear()} - Real CSV Dataset
        </div>
      </footer>

      <FlightDetailModal />
      <GateDetailModal />
      <IncidentDetailModal />
      <NewFlightModal />
      <NewMaintenanceModal />
    </div>
  );
}

export default function App() {
  return (
    <OperationalProvider>
      <MainLayout />
    </OperationalProvider>
  );
}
