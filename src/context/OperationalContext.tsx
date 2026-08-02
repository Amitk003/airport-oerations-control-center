import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Flight, GateEvent, BaggageItem, Passenger, PassengerStatus,
  SecurityScreening, MaintenanceLog, StaffShift, 
  RetailTransaction, AlertItem, SystemMetrics, 
  FlightStatus, EventFeedItem 
} from '../types';
import { 
  parseFlightsCSV, parseGateEventsCSV, parseBaggageCSV,
  parsePassengersCSV, parseSecurityCSV, parseMaintenanceCSV,
  parseStaffCSV, parseRetailCSV 
} from '../utils/csvColumnMap';

interface OperationalContextType {
  flights: Flight[];
  gateEvents: GateEvent[];
  baggage: BaggageItem[];
  passengers: Passenger[];
  security: SecurityScreening[];
  maintenance: MaintenanceLog[];
  staff: StaffShift[];
  retail: RetailTransaction[];
  alerts: AlertItem[];
  metrics: SystemMetrics;
  eventFeed: EventFeedItem[];
  isLoaded: boolean;
  loadError: string | null;
  currentTime: Date;
  isPlaying: boolean;
  speedMultiplier: number;
  tickCount: number;
  selectedTerminal: string;
  searchTerm: string;
  statusFilter: string;
  selectedFlightId: string | null;
  selectedGateId: string | null;
  selectedAlertId: string | null;
  selectedPassengerId: string | null;
  isNewFlightModalOpen: boolean;
  isNewMaintenanceModalOpen: boolean;
  toggleSimulation: () => void;
  setSpeedMultiplier: (speed: number) => void;
  setSelectedTerminal: (terminal: string) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  openFlightDetail: (id: string) => void;
  openGateDetail: (id: string) => void;
  openAlertDetail: (id: string) => void;
  openPassengerDetail: (id: string) => void;
  setIsNewFlightModalOpen: (open: boolean) => void;
  setIsNewMaintenanceModalOpen: (open: boolean) => void;
  closeModals: () => void;
  resolveAlert: (alertId: string, resolutionText?: string) => void;
  addFlight: (newFlight: Omit<Flight, 'id'>) => void;
  updateFlightStatus: (flightId: string, newStatus: FlightStatus, reason?: string) => void;
  reassignGate: (flightId: string, newGate: string, newTerminal: string) => void;
  toggleGateBridge: (gateId: string) => void;
  toggleGatePower: (gateId: string) => void;
  updateSecurityLanes: (checkpointId: string, lanesOpen: number) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  resolveMaintenance: (logId: string) => void;
  updateStaffStatus: (staffId: string, status: StaffShift['status']) => void;
  resetDataToDefault: () => void;
  importCSVDataset: (tableName: string, csvContent: string) => boolean;
  addEventToFeed: (event: Omit<EventFeedItem, 'id' | 'timestamp'>) => void;
}

const OperationalContext = createContext<OperationalContextType | undefined>(undefined);

const CSV_BASE_PATH = '/data';

const CSV_FILES = {
  flights: 'flights.csv',
  gateEvents: 'gate_events.csv',
  baggage: 'baggage.csv',
  passengers: 'passengers.csv',
  security: 'security_screening.csv',
  maintenance: 'maintenance_logs.csv',
  staff: 'staff_shifts.csv',
  retail: 'retail_transactions.csv',
};

export const OperationalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [gateEvents, setGateEvents] = useState<GateEvent[]>([]);
  const [baggage, setBaggage] = useState<BaggageItem[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [security, setSecurity] = useState<SecurityScreening[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
  const [staff, setStaff] = useState<StaffShift[]>([]);
  const [retail, setRetail] = useState<RetailTransaction[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [eventFeed, setEventFeed] = useState<EventFeedItem[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date('2026-08-02T08:30:00.000Z'));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [tickCount, setTickCount] = useState<number>(0);
  const [selectedTerminal, setSelectedTerminal] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null);
  const [isNewFlightModalOpen, setIsNewFlightModalOpen] = useState<boolean>(false);
  const [isNewMaintenanceModalOpen, setIsNewMaintenanceModalOpen] = useState<boolean>(false);

  // Load CSV data on mount
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const [flightsCsv, gatesCsv, baggageCsv, passengersCsv, securityCsv, maintenanceCsv, staffCsv, retailCsv] = 
          await Promise.all([
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.flights}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.gateEvents}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.baggage}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.passengers}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.security}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.maintenance}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.staff}`).then(r => r.text()),
            fetch(`${CSV_BASE_PATH}/${CSV_FILES.retail}`).then(r => r.text()),
          ]);

        const parsedFlights = parseFlightsCSV(flightsCsv);
        const parsedGates = parseGateEventsCSV(gatesCsv);
        const parsedBaggage = parseBaggageCSV(baggageCsv);
        const parsedPassengers = parsePassengersCSV(passengersCsv);
        const parsedSecurity = parseSecurityCSV(securityCsv);
        const parsedMaintenance = parseMaintenanceCSV(maintenanceCsv);
        const parsedStaff = parseStaffCSV(staffCsv);
        const parsedRetail = parseRetailCSV(retailCsv);

        setFlights(parsedFlights);
        setGateEvents(parsedGates);
        setBaggage(parsedBaggage);
        setPassengers(parsedPassengers);
        setSecurity(parsedSecurity);
        setMaintenance(parsedMaintenance);
        setStaff(parsedStaff);
        setRetail(parsedRetail);

        // Generate initial events from loaded data
        const initialEvents: EventFeedItem[] = [];

        // Add flight events
        parsedFlights.slice(0, 10).forEach((f) => {
          initialEvents.push({
            id: `feed-flight-${f.id}`,
            timestamp: f.scheduledDeparture || new Date().toISOString(),
            type: 'flight',
            severity: f.delayMinutes > 30 ? 'warning' : 'info',
            title: `${f.flightNumber} ${f.status}`,
            description: `${f.airline} ${f.origin} to ${f.destination}`,
            flightNumber: f.flightNumber,
            terminal: f.terminal,
          });
        });

        // Add gate events
        parsedGates.slice(0, 5).forEach((g) => {
          initialEvents.push({
            id: `feed-gate-${g.id}`,
            timestamp: g.timestamp || new Date().toISOString(),
            type: 'gate',
            severity: g.isEmergency ? 'critical' : 'info',
            title: `Gate ${g.gate}: ${g.eventType}`,
            description: `Flight ${g.flightNumber} at ${g.terminal}`,
            flightNumber: g.flightNumber,
            terminal: g.terminal,
          });
        });

        // Add maintenance events
        parsedMaintenance.slice(0, 3).forEach((m) => {
          initialEvents.push({
            id: `feed-mt-${m.id}`,
            timestamp: m.reportedAt || new Date().toISOString(),
            type: 'maintenance',
            severity: m.severity === 'Critical' || m.severity === 'High' ? 'warning' : 'info',
            title: `Maintenance: ${m.issueDescription}`,
            description: `Aircraft ${m.aircraftId} - ${m.status}`,
            terminal: 'All',
          });
        });

        // Add security events
        parsedSecurity.slice(0, 3).forEach((s) => {
          initialEvents.push({
            id: `feed-sec-${s.id}`,
            timestamp: s.screeningTime || new Date().toISOString(),
            type: 'security',
            severity: s.waitTimeMinutes > 30 ? 'warning' : 'info',
            title: `Security ${s.checkpointId}: ${s.result}`,
            description: `Queue: ${s.queueLength} pax, Wait: ${s.waitTimeMinutes}min`,
            terminal: s.terminal,
          });
        });

        // Sort by timestamp descending
        initialEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setEventFeed(initialEvents.slice(0, 20));

        // Generate initial alerts from anomalies
        const initialAlerts: AlertItem[] = [];
        parsedFlights.filter(f => f.delayMinutes > 60).slice(0, 2).forEach(f => {
          initialAlerts.push({
            id: `alert-delay-${f.id}`,
            timestamp: new Date().toISOString(),
            severity: 'WARNING',
            category: 'Flight',
            title: `Flight ${f.flightNumber} delayed by ${f.delayMinutes}min`,
            description: `${f.airline} ${f.origin} to ${f.destination}. Reason: ${f.delayReason || 'Not specified'}`,
            entityId: f.id,
            entityType: 'flight',
            resolved: false,
          });
        });
        parsedSecurity.filter(s => s.waitTimeMinutes > 40).slice(0, 2).forEach(s => {
          initialAlerts.push({
            id: `alert-sec-${s.id}`,
            timestamp: new Date().toISOString(),
            severity: 'WARNING',
            category: 'Security',
            title: `Security ${s.checkpointId} congested`,
            description: `Queue: ${s.queueLength} pax, Wait: ${s.waitTimeMinutes}min`,
            entityId: s.id,
            entityType: 'checkpoint',
            resolved: false,
          });
        });
        setAlerts(initialAlerts);

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load CSV data:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load data');
        setIsLoaded(true);
      }
    };
    loadCSVData();
  }, []);

  // Simulation
  useEffect(() => {
    if (!isPlaying || !isLoaded) return;
    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);
      setCurrentTime((prevTime) => new Date(prevTime.getTime() + speedMultiplier * 1000));
      setTickCount((currentTick) => {
        if (currentTick % 3 === 0) {
          setSecurity((prev) => prev.map((sc) => {
            const delta = Math.floor(Math.random() * 7) - 3;
            const newQueue = Math.max(5, sc.queueLength + delta);
            const calculatedWait = Math.round((newQueue / Math.max(1, sc.lanesOpen * sc.throughputPerMin)) * 10);
            return { ...sc, queueLength: newQueue, waitTimeMinutes: Math.max(2, calculatedWait), isOvercrowded: newQueue > sc.maxCapacity * 0.8, threatLevel: calculatedWait > 45 ? 'HIGH' : calculatedWait > 25 ? 'ELEVATED' : 'LOW' };
          }));
        }
        if (currentTick % 5 === 0) {
          setPassengers((prev) => prev.map((ps) => {
            if (ps.status === 'Checked-In' && Math.random() > 0.6) return { ...ps, status: 'Security-Passed' as PassengerStatus };
            if (ps.status === 'Security-Passed' && Math.random() > 0.5) return { ...ps, status: 'Boarding' as PassengerStatus };
            if (ps.status === 'Boarding' && Math.random() > 0.4) return { ...ps, status: 'Boarded' as PassengerStatus };
            return ps;
          }));
        }
        if (currentTick % 4 === 0) {
          setBaggage((prev) => prev.map((bg) => {
            if (bg.status === 'Check-in' && Math.random() > 0.5) return { ...bg, status: 'Sorting', lastUpdated: new Date().toISOString() };
            if (bg.status === 'Sorting' && Math.random() > 0.5) return { ...bg, status: 'Loaded', lastUpdated: new Date().toISOString() };
            return bg;
          }));
        }
        if (currentTick % 10 === 0) {
          setFlights((prev) => {
            let newFeed = false;
            const updated = prev.map((f) => {
              if (f.status === 'Scheduled' && Math.random() > 0.7) {
                setEventFeed((ef) => [{ id: `feed-${Date.now()}-${f.id}`, timestamp: new Date().toISOString(), type: 'flight', severity: 'info', title: `${f.flightNumber} now boarding`, description: `${f.airline} ${f.origin} to ${f.destination}` }, ...ef].slice(0, 50));
                return { ...f, status: 'Boarding' as FlightStatus };
              }
              if (f.status === 'On Time' && Math.random() > 0.7) {
                setEventFeed((ef) => [{ id: `feed-${Date.now()}-${f.id}`, timestamp: new Date().toISOString(), type: 'flight', severity: 'info', title: `${f.flightNumber} now boarding`, description: `${f.airline} ${f.origin} to ${f.destination}` }, ...ef].slice(0, 50));
                return { ...f, status: 'Boarding' as FlightStatus };
              }
              if (f.status === 'Boarding' && Math.random() > 0.6) {
                setEventFeed((ef) => [{ id: `feed-${Date.now()}-${f.id}`, timestamp: new Date().toISOString(), type: 'flight', severity: 'info', title: `${f.flightNumber} departed`, description: `${f.airline} ${f.origin} to ${f.destination}` }, ...ef].slice(0, 50));
                return { ...f, status: 'Departed' as FlightStatus, actualDeparture: new Date().toISOString() };
              }
              return f;
            });
            return updated;
          });
        }
        if (currentTick > 0 && currentTick % 20 === 0) {
          const alertTypes = ['security', 'baggage', 'flight'] as const;
          const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          if (randomType === 'security') {
            setAlerts((prev) => [{ id: `alt-gen-${Date.now()}`, timestamp: new Date().toISOString(), severity: 'WARNING', category: 'Security', title: 'High Security Line Congestion', description: 'Queue sensors detected passenger backlog.', resolved: false, resolutionAction: 'Increase open lanes.' }, ...prev]);
            setEventFeed((prev) => [{ id: `feed-gen-${Date.now()}`, timestamp: new Date().toISOString(), type: 'security', severity: 'warning', title: 'Security queue surge detected', description: 'Passenger backlog at checkpoint.' }, ...prev].slice(0, 50));
          } else if (randomType === 'baggage') {
            setEventFeed((prev) => [{ id: `feed-gen-${Date.now()}`, timestamp: new Date().toISOString(), type: 'baggage', severity: 'info', title: 'Baggage sorting in progress', description: 'Belt conveyor operating normally.' }, ...prev].slice(0, 50));
          } else {
            setEventFeed((prev) => [{ id: `feed-gen-${Date.now()}`, timestamp: new Date().toISOString(), type: 'flight', severity: 'info', title: 'Flight status update', description: 'Operational status changed.' }, ...prev].slice(0, 50));
          }
        }
        return currentTick;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, isLoaded]);

  // Metrics
  const activeFlights = flights.filter((f) => f.status !== 'Departed' && f.status !== 'Cancelled').length;
  const onTimeCount = flights.filter((f) => f.status === 'On Time' || f.status === 'Boarding' || f.status === 'Departed').length;
  const onTimePercentage = flights.length > 0 ? Math.round((onTimeCount / flights.length) * 100) : 100;
  const occupiedGates = gateEvents.filter((g) => g.status === 'Occupied' || g.status === 'Conflict').length;
  const gateUtilization = gateEvents.length > 0 ? Math.round((occupiedGates / gateEvents.length) * 100) : 0;
  const deliveredBags = baggage.filter((b) => b.currentStatus === 'Loaded').length;
  const bagSlaPercentage = baggage.length > 0 ? Math.round((deliveredBags / baggage.length) * 100) : 100;
  const totalSecurityWait = security.reduce((acc, s) => acc + s.waitTimeMinutes, 0);
  const avgSecurityWait = security.length > 0 ? Math.round(totalSecurityWait / security.length) : 0;
  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
  const totalPassengers = passengers.length;
  const totalRetailRevenue = retail.reduce((acc, r) => acc + r.amount, 0);

  const metrics: SystemMetrics = { activeFlights, onTimePercentage, gateUtilization, bagSlaPercentage, avgSecurityWait, activeAlertsCount, totalPassengers, totalRetailRevenue };

  // Handlers
  const toggleSimulation = () => setIsPlaying((prev) => !prev);
  const openFlightDetail = (id: string) => setSelectedFlightId(id);
  const openGateDetail = (id: string) => setSelectedGateId(id);
  const openAlertDetail = (id: string) => setSelectedAlertId(id);
  const openPassengerDetail = (id: string) => setSelectedPassengerId(id);
  const closeModals = () => { setSelectedFlightId(null); setSelectedGateId(null); setSelectedAlertId(null); setSelectedPassengerId(null); setIsNewFlightModalOpen(false); setIsNewMaintenanceModalOpen(false); };
  const addEventToFeed = (event: Omit<EventFeedItem, 'id' | 'timestamp'>) => { setEventFeed((prev) => [{ ...event, id: `feed-${Date.now()}`, timestamp: new Date().toISOString() }, ...prev].slice(0, 100)); };
  const resolveAlert = (alertId: string, resolutionText?: string) => { setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, resolved: true, resolutionAction: resolutionText || 'Resolved' } : a)); };
  const addFlight = (newFlightData: Omit<Flight, 'id'>) => { const newId = `fl-${Date.now().toString().slice(-4)}`; setFlights((prev) => [{ ...newFlightData, id: newId }, ...prev]); };
  const updateFlightStatus = (flightId: string, newStatus: FlightStatus, reason?: string) => { setFlights((prev) => prev.map((f) => f.id === flightId ? { ...f, status: newStatus, delayReason: reason || f.delayReason } : f)); };
  const reassignGate = (flightId: string, newGate: string, newTerminal: string) => { setFlights((prev) => prev.map((f) => f.id === flightId ? { ...f, gate: newGate, terminal: newTerminal } : f)); };
  const toggleGateBridge = (gateId: string) => { setGateEvents((prev) => prev.map((ge) => ge.gate === gateId ? { ...ge, bridgeConnected: !ge.bridgeConnected } : ge)); };
  const toggleGatePower = (gateId: string) => { setGateEvents((prev) => prev.map((ge) => ge.gate === gateId ? { ...ge, powerSupplied: !ge.powerSupplied } : ge)); };
  const updateSecurityLanes = (checkpointId: string, lanesOpen: number) => { setSecurity((prev) => prev.map((sc) => sc.checkpointId === checkpointId ? { ...sc, lanesOpen, waitTimeMinutes: Math.max(2, Math.round((sc.queueLength / Math.max(1, lanesOpen * sc.throughputPerMin)) * 10)) } : sc)); };
  const addMaintenanceLog = (logData: Omit<MaintenanceLog, 'id'>) => { setMaintenance((prev) => [{ ...logData, id: `mt-${Date.now().toString().slice(-4)}` }, ...prev]); };
  const resolveMaintenance = (logId: string) => { setMaintenance((prev) => prev.map((m) => m.id === logId ? { ...m, status: 'Resolved' } : m)); };
  const updateStaffStatus = (staffId: string, status: StaffShift['status']) => { setStaff((prev) => prev.map((s) => s.id === staffId ? { ...s, status } : s)); };

  const resetDataToDefault = async () => {
    try {
      const [flightsCsv, gatesCsv, baggageCsv, passengersCsv, securityCsv, maintenanceCsv, staffCsv, retailCsv] = 
        await Promise.all([`${CSV_BASE_PATH}/${CSV_FILES.flights}`, `${CSV_BASE_PATH}/${CSV_FILES.gateEvents}`, `${CSV_BASE_PATH}/${CSV_FILES.baggage}`, `${CSV_BASE_PATH}/${CSV_FILES.passengers}`, `${CSV_BASE_PATH}/${CSV_FILES.security}`, `${CSV_BASE_PATH}/${CSV_FILES.maintenance}`, `${CSV_BASE_PATH}/${CSV_FILES.staff}`, `${CSV_BASE_PATH}/${CSV_FILES.retail}`].map(url => fetch(url).then(r => r.text())));
      setFlights(parseFlightsCSV(flightsCsv));
      setGateEvents(parseGateEventsCSV(gatesCsv));
      setBaggage(parseBaggageCSV(baggageCsv));
      setPassengers(parsePassengersCSV(passengersCsv));
      setSecurity(parseSecurityCSV(securityCsv));
      setMaintenance(parseMaintenanceCSV(maintenanceCsv));
      setStaff(parseStaffCSV(staffCsv));
      setRetail(parseRetailCSV(retailCsv));
      setAlerts([]);
      setEventFeed([]);
    } catch (error) { console.error('Failed to reset:', error); }
  };

  const importCSVDataset = (tableName: string, csvContent: string): boolean => {
    try {
      switch (tableName) {
        case 'flights.csv': { const p = parseFlightsCSV(csvContent); if (p.length > 0) { setFlights(p); return true; } break; }
        case 'gate_events.csv': { const p = parseGateEventsCSV(csvContent); if (p.length > 0) { setGateEvents(p); return true; } break; }
        case 'baggage.csv': { const p = parseBaggageCSV(csvContent); if (p.length > 0) { setBaggage(p); return true; } break; }
        case 'passengers.csv': { const p = parsePassengersCSV(csvContent); if (p.length > 0) { setPassengers(p); return true; } break; }
        case 'security_screening.csv': { const p = parseSecurityCSV(csvContent); if (p.length > 0) { setSecurity(p); return true; } break; }
        case 'maintenance_logs.csv': { const p = parseMaintenanceCSV(csvContent); if (p.length > 0) { setMaintenance(p); return true; } break; }
        case 'staff_shifts.csv': { const p = parseStaffCSV(csvContent); if (p.length > 0) { setStaff(p); return true; } break; }
        case 'retail_transactions.csv': { const p = parseRetailCSV(csvContent); if (p.length > 0) { setRetail(p); return true; } break; }
      }
    } catch (e) { console.error('CSV import error', e); }
    return false;
  };

  return (
    <OperationalContext.Provider value={{
      flights, gateEvents, baggage, passengers, security, maintenance, staff, retail, alerts, metrics, eventFeed, isLoaded, loadError,
      currentTime, isPlaying, speedMultiplier, tickCount, selectedTerminal, searchTerm, statusFilter,
      selectedFlightId, selectedGateId, selectedAlertId, selectedPassengerId, isNewFlightModalOpen, isNewMaintenanceModalOpen,
      toggleSimulation, setSpeedMultiplier, setSelectedTerminal, setSearchTerm, setStatusFilter,
      openFlightDetail, openGateDetail, openAlertDetail, openPassengerDetail, setIsNewFlightModalOpen, setIsNewMaintenanceModalOpen, closeModals,
      resolveAlert, addFlight, updateFlightStatus, reassignGate, toggleGateBridge, toggleGatePower, updateSecurityLanes,
      addMaintenanceLog, resolveMaintenance, updateStaffStatus, resetDataToDefault, importCSVDataset, addEventToFeed,
    }}>
      {children}
    </OperationalContext.Provider>
  );
};

export const useOperational = () => {
  const context = useContext(OperationalContext);
  if (!context) throw new Error('useOperational must be used within an OperationalProvider');
  return context;
};
