import React, { useState, Suspense, lazy } from 'react';
import { OperationalProvider } from './context/OperationalContext';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';

// Lazy load views for better performance
const OverviewDashboard = lazy(() => import('./components/views/OverviewDashboard').then(m => ({ default: m.OverviewDashboard })));
const FlightOperations = lazy(() => import('./components/views/FlightOperations').then(m => ({ default: m.FlightOperations })));
const GateManagement = lazy(() => import('./components/views/GateManagement').then(m => ({ default: m.GateManagement })));
const BaggageTracking = lazy(() => import('./components/views/BaggageTracking').then(m => ({ default: m.BaggageTracking })));
const PassengerOperations = lazy(() => import('./components/views/PassengerOperations').then(m => ({ default: m.PassengerOperations })));
const SecurityScreening = lazy(() => import('./components/views/SecurityScreening').then(m => ({ default: m.SecurityScreening })));
const MaintenanceFleet = lazy(() => import('./components/views/MaintenanceFleet').then(m => ({ default: m.MaintenanceFleet })));
const StaffDispatch = lazy(() => import('./components/views/StaffDispatch').then(m => ({ default: m.StaffDispatch })));
const RetailAnalytics = lazy(() => import('./components/views/RetailAnalytics').then(m => ({ default: m.RetailAnalytics })));
const IncidentCommand = lazy(() => import('./components/views/IncidentCommand').then(m => ({ default: m.IncidentCommand })));
const DatasetInspector = lazy(() => import('./components/views/DatasetInspector').then(m => ({ default: m.DatasetInspector })));

// Modals
import { FlightDetailModal } from './components/modals/FlightDetailModal';
import { GateDetailModal } from './components/modals/GateDetailModal';
import { IncidentDetailModal } from './components/modals/IncidentDetailModal';
import { NewFlightModal } from './components/modals/NewFlightModal';
import { NewMaintenanceModal } from './components/modals/NewMaintenanceModal';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-[#1A1A1A] font-mono text-sm">Loading...</div>
    </div>
  );
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const renderView = () => {
    switch (activeTab) {
      case 'overview': return <OverviewDashboard />;
      case 'flights': return <FlightOperations />;
      case 'gates': return <GateManagement />;
      case 'baggage': return <BaggageTracking />;
      case 'passengers': return <PassengerOperations />;
      case 'security': return <SecurityScreening />;
      case 'maintenance': return <MaintenanceFleet />;
      case 'staff': return <StaffDispatch />;
      case 'retail': return <RetailAnalytics />;
      case 'incidents': return <IncidentCommand />;
      case 'dataset': return <DatasetInspector />;
      default: return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F1EF] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6">
        <Suspense fallback={<LoadingSpinner />}>
          {renderView()}
        </Suspense>
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
