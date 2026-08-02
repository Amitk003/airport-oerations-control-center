// ============================================================
// Types matching actual CSV dataset schema (Delhi Airport - DEL)
// ============================================================

export type FlightStatus = 
  | 'Scheduled' 
  | 'On Time' 
  | 'Boarding' 
  | 'Departed' 
  | 'Delayed' 
  | 'In-Flight' 
  | 'Landed' 
  | 'Cancelled' 
  | 'Maintenance';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  actualArrival: string;
  aircraftType: string;
  tailNumber: string;
  capacity: number;
  passengerCount: number;
  status: FlightStatus;
  delayMinutes: number;
  delayReason: string;
  terminal: string;
  gate: string;
  bridgeConnected: boolean;
  distanceKm: number;
  fuelCost: number;
  boardingTime: string;
  weatherFlag: boolean;
  loadFactor: string;
  taxiTime: number;
  timeOfDay: string;
  dayOfWeek: string;
  isHoliday: boolean;
  season: string;
  routeType: string;
}

export type GateStatus = 'Occupied' | 'Available' | 'Maintenance' | 'Conflict';

export interface GateEvent {
  id: string;
  eventId: string;
  flightNumber: string;
  gate: string;
  terminal: string;
  eventType: string;
  timestamp: string;
  staffId: string;
  durationMinutes: number;
  priority: string;
  isEmergency: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  scheduledTime: string;
  status: GateStatus;
  bridgeConnected: boolean;
  powerSupplied: boolean;
  fuelConnected: boolean;
  conflictReason?: string;
}

export type BaggageStatus = 
  | 'Checked-In' 
  | 'Sorting' 
  | 'Loaded' 
  | 'In-Transit' 
  | 'Claim-Carousel' 
  | 'Delayed' 
  | 'Lost'
  | 'Check-in'
  | 'Ramp';

export interface BaggageItem {
  id: string;
  bagId: string;
  bagTag: string;
  flightNumber: string;
  passengerId: string;
  weightKg: number;
  dimensions: string;
  status: string;
  carousel: string;
  checkinTime: string;
  lastUpdated: string;
  priority: number;
  currentStatus: string;
  isDangerous: boolean;
  transferCount: number;
  location: string;
  scanTime: string;
  isInternational: boolean;
}

export type PassengerStatus = 
  | 'Checked-In' 
  | 'Security-Passed' 
  | 'Boarding' 
  | 'Boarded' 
  | 'No-Show' 
  | 'Delayed';

export interface Passenger {
  id: string;
  pnrCode: string;
  passportNumber: string;
  maskedPassport: string;
  firstName: string;
  lastName: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  seatNumber: string;
  ticketClass: string;
  flightNumber: string;
  checkinTime: string;
  boardingTime: string;
  gate: string;
  baggageCount: number;
  email: string;
  phone: string;
  specialAssistance: boolean;
  loyaltyScore: number;
  isVip: boolean;
  originalClass: string;
  age: number;
  ageGroup: string;
  status: PassengerStatus;
}

export interface SecurityScreening {
  id: string;
  screeningId: string;
  passengerId: string;
  checkpointCode: string;
  terminalNumber: number;
  screeningTime: string;
  checkinTime: string;
  boardingTime: string;
  result: string;
  hasFlag: boolean;
  officerId: string;
  scannerId: string;
  waitTimeMinutes: number;
  secondaryCheck: boolean;
  isPriority: boolean;
  shiftId: string;
  queueLength: number;
  lanesOpen: number;
  maxCapacity: number;
  isOvercrowded: boolean;
  terminal: string;
  checkpointId: string;
  threatLevel: 'LOW' | 'ELEVATED' | 'HIGH';
  throughputPerMin: number;
}

export type MaintenanceSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type MaintenanceStatus = 'Pending' | 'In-Progress' | 'Resolved';

export interface MaintenanceLog {
  id: string;
  workOrderId: string;
  aircraftId: string;
  flightNumber: string;
  maintenanceType: string;
  technicianId: string;
  reportedAt: string;
  resolvedAt: string;
  priority: number;
  estimatedHours: number;
  issueDescription: string;
  component: string;
  severity: MaintenanceSeverity;
  assignedTeam: string;
  isGrounded: boolean;
  isRecurring: boolean;
  status: MaintenanceStatus;
}

export type StaffRole = 'ATC' | 'Ground' | 'Gate' | 'Security' | 'Maintenance' | 'Baggage' | 'Retail' | 'Ops' | 'Agent';
export type StaffStatus = 'Active' | 'On-Break' | 'Off-Duty';

export interface StaffShift {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  role: string;
  hireDate: string;
  shiftStart: string;
  shiftEnd: string;
  terminal: string;
  assignedGate: string;
  teamId: string;
  hoursWorked: number;
  isOvertime: boolean;
  contractEndDate: string;
  language: string;
  status: StaffStatus;
  contactNumber: string;
  location: string;
}

export interface RetailTransaction {
  id: string;
  transactionId: string;
  storeId: string;
  category: string;
  department: string;
  passengerId: string;
  flightNumber: string;
  transactionTime: string;
  itemName: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  currency: string;
  terminal: string;
  location: string;
  isInternational: boolean;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertCategory = 'Gate' | 'Flight' | 'Baggage' | 'Security' | 'Maintenance' | 'Staff';

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  entityId?: string;
  entityType?: 'flight' | 'gate' | 'baggage' | 'passenger' | 'checkpoint' | 'maintenance' | 'staff';
  resolved: boolean;
  resolutionAction?: string;
}

export interface SystemMetrics {
  activeFlights: number;
  onTimePercentage: number;
  gateUtilization: number;
  bagSlaPercentage: number;
  avgSecurityWait: number;
  activeAlertsCount: number;
  totalPassengers: number;
  totalRetailRevenue: number;
}

export interface EventFeedItem {
  id: string;
  timestamp: string;
  type: 'flight' | 'gate' | 'baggage' | 'security' | 'maintenance' | 'staff' | 'retail';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  flightNumber?: string;
  terminal?: string;
}
