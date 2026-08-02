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

function MainLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="min-h-screen bg-[#F2F1EF] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Tactical Top Header */}
      <Header />

      {/* Main Mission Control Tabs Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Primary Workspace Viewport */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'overview' && <OverviewDashboard />}
        {activeTab === 'flights' && <FlightOperations />}
        {activeTab === 'gates' && <GateManagement />}
        {activeTab === 'baggage' && <BaggageTracking />}
        {activeTab === 'passengers' && <PassengerOperations />}
        {activeTab === 'security' && <SecurityScreening />}
        {activeTab === 'maintenance' && <MaintenanceFleet />}
        {activeTab === 'staff' && <StaffDispatch />}
        {activeTab === 'retail' && <RetailAnalytics />}
        {activeTab === 'incidents' && <IncidentCommand />}
        {activeTab === 'dataset' && <DatasetInspector />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] bg-[#1A1A1A] text-white py-4 px-6 text-center text-xs font-mono">
        <div className="tracking-widest uppercase font-bold text-slate-200">
          AIRPORT OPERATIONS CONTROL CENTER (AOCC) • DEL AIRPORT
        </div>
        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
          System Operational • {new Date().getFullYear()} • Real CSV Dataset • Live Telemetry Stream
        </div>
      </footer>

      {/* Global Inspectors & Modals */}
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
