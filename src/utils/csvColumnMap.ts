// ============================================================
// CSV Column Mapping - Maps numeric indices to field names
// Based on actual CSV dataset schema from Delhi Airport (DEL)
// ============================================================

import Papa from 'papaparse';
import { 
  Flight, GateEvent, BaggageItem, Passenger, 
  SecurityScreening, MaintenanceLog, StaffShift, RetailTransaction 
} from '../types';

// ============================================================
// Column index mappings for each CSV file
// ============================================================

const FLIGHT_COLUMNS: Record<number, string> = {
  0: 'flightNumber',
  1: 'airline',
  2: 'airlineCode',
  3: 'origin',
  4: 'destination',
  5: 'scheduledDeparture',
  6: 'actualDeparture',
  7: 'scheduledArrival',
  8: 'actualArrival',
  9: 'aircraftType',
  10: 'tailNumber',
  11: 'capacity',
  12: 'passengerCount',
  13: 'status',
  14: 'delayMinutes',
  15: 'delayReason',
  16: 'terminal',
  17: 'gate',
  18: 'bridgeConnected',
  19: 'distanceKm',
  20: 'fuelCost',
  21: 'boardingTime',
  22: 'weatherFlag',
  23: 'loadFactor',
  24: 'taxiTime',
  27: 'timeOfDay',
  28: 'dayOfWeek',
  29: 'isHoliday',
  30: 'season',
  31: 'routeType',
};

const GATE_EVENT_COLUMNS: Record<number, string> = {
  0: 'eventId',
  1: 'flightNumber',
  2: 'gate',
  3: 'terminal',
  4: 'eventType',
  5: 'timestamp',
  6: 'staffId',
  7: 'durationMinutes',
  8: 'priority',
  9: 'isEmergency',
  10: 'notes',
  11: 'createdAt',
  12: 'updatedAt',
  13: 'scheduledTime',
};

const BAGGAGE_COLUMNS: Record<number, string> = {
  0: 'bagId',
  1: 'bagTag',
  2: 'flightNumber',
  3: 'passengerId',
  4: 'weightKg',
  5: 'dimensions',
  6: 'status',
  7: 'carousel',
  8: 'checkinTime',
  9: 'lastUpdated',
  10: 'priority',
  11: 'currentStatus',
  12: 'isDangerous',
  13: 'transferCount',
  14: 'location',
  15: 'scanTime',
  16: 'isInternational',
};

const PASSENGER_COLUMNS: Record<number, string> = {
  0: 'pnrCode',
  1: 'passportNumber',
  2: 'maskedPassport',
  3: 'firstName',
  4: 'lastName',
  5: 'nationality',
  6: 'dateOfBirth',
  7: 'gender',
  8: 'seatNumber',
  9: 'ticketClass',
  10: 'flightNumber',
  11: 'checkinTime',
  12: 'boardingTime',
  13: 'gate',
  14: 'baggageCount',
  18: 'email',
  19: 'phone',
  22: 'specialAssistance',
  23: 'loyaltyScore',
  24: 'isVip',
  25: 'originalClass',
  26: 'age',
  27: 'ageGroup',
};

const SECURITY_COLUMNS: Record<number, string> = {
  0: 'screeningId',
  1: 'passengerId',
  2: 'checkpointCode',
  3: 'terminalNumber',
  4: 'screeningTime',
  5: 'checkinTime',
  6: 'boardingTime',
  7: 'result',
  9: 'hasFlag',
  10: 'officerId',
  11: 'scannerId',
  12: 'waitTimeMinutes',
  13: 'secondaryCheck',
  14: 'isPriority',
  15: 'shiftId',
  16: 'queueLength',
  17: 'lanesOpen',
  18: 'maxCapacity',
  19: 'isOvercrowded',
};

const MAINTENANCE_COLUMNS: Record<number, string> = {
  0: 'workOrderId',
  1: 'aircraftId',
  2: 'flightNumber',
  3: 'maintenanceType',
  4: 'technicianId',
  5: 'reportedAt',
  6: 'resolvedAt',
  7: 'priority',
  8: 'estimatedHours',
  9: 'issueDescription',
  10: 'component',
  11: 'severity',
  12: 'assignedTeam',
  13: 'isGrounded',
  14: 'isRecurring',
};

const STAFF_COLUMNS: Record<number, string> = {
  0: 'staffId',
  1: 'staffName',
  2: 'department',
  3: 'role',
  4: 'hireDate',
  5: 'shiftStart',
  6: 'shiftEnd',
  7: 'terminal',
  8: 'assignedGate',
  9: 'teamId',
  10: 'hoursWorked',
  11: 'isOvertime',
  13: 'contractEndDate',
  14: 'language',
};

const RETAIL_COLUMNS: Record<number, string> = {
  0: 'transactionId',
  1: 'storeId',
  2: 'category',
  3: 'department',
  4: 'passengerId',
  5: 'flightNumber',
  6: 'transactionTime',
  7: 'itemName',
  8: 'quantity',
  9: 'amount',
  11: 'paymentMethod',
  12: 'currency',
  14: 'terminal',
  15: 'location',
  16: 'isInternational',
};

// ============================================================
// Generic CSV parser with column mapping
// ============================================================

function parseCSVWithMapping<T>(
  csvContent: string,
  columnMap: Record<number, string>,
  transformer: (row: Record<string, any>, index: number) => T
): T[] {
  // Parse CSV without headers (they're just numbers)
  const result = Papa.parse<string[]>(csvContent, {
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  // Skip the header row (numeric indices)
  const dataRows = result.data.slice(1);

  return dataRows
    .filter(row => row && row.length > 1)
    .map((row, index) => {
      const mapped: Record<string, any> = {};
      
      // Map each column index to its field name
      Object.entries(columnMap).forEach(([colIndex, fieldName]) => {
        const idx = parseInt(colIndex);
        if (idx < row.length) {
          mapped[fieldName] = row[idx];
        }
      });

      return transformer(mapped, index);
    });
}

// ============================================================
// Transformers for each entity type
// ============================================================

function transformFlight(row: Record<string, any>, index: number): Flight {
  return {
    id: `fl-${index + 1}`,
    flightNumber: row.flightNumber || '',
    airline: row.airline || '',
    airlineCode: row.airlineCode || '',
    origin: row.origin || '',
    destination: row.destination || '',
    scheduledDeparture: row.scheduledDeparture || '',
    actualDeparture: row.actualDeparture || '',
    scheduledArrival: row.scheduledArrival || '',
    actualArrival: row.actualArrival || '',
    aircraftType: row.aircraftType || '',
    tailNumber: row.tailNumber || '',
    capacity: parseInt(row.capacity) || 0,
    passengerCount: parseInt(row.passengerCount) || 0,
    status: normalizeFlightStatus(row.status),
    delayMinutes: parseInt(row.delayMinutes) || 0,
    delayReason: row.delayReason || '',
    terminal: normalizeTerminal(row.terminal),
    gate: row.gate || '',
    bridgeConnected: row.bridgeConnected === 'True',
    distanceKm: parseInt(row.distanceKm) || 0,
    fuelCost: parseInt(row.fuelCost) || 0,
    boardingTime: row.boardingTime || '',
    weatherFlag: row.weatherFlag === 'True',
    loadFactor: row.loadFactor || '',
    taxiTime: parseFloat(row.taxiTime) || 0,
    timeOfDay: row.timeOfDay || '',
    dayOfWeek: row.dayOfWeek || '',
    isHoliday: row.isHoliday === 'True',
    season: row.season || '',
    routeType: row.routeType || '',
  };
}

function normalizeFlightStatus(status: string): Flight['status'] {
  const s = (status || '').toLowerCase();
  if (s === 'departed') return 'Departed';
  if (s === 'boarding') return 'Boarding';
  if (s === 'delayed') return 'Delayed';
  if (s === 'cancelled') return 'Cancelled';
  if (s === 'scheduled') return 'Scheduled';
  if (s === 'on time' || s === 'on-time') return 'On Time';
  if (s === 'in-flight' || s === 'in flight') return 'In-Flight';
  if (s === 'landed') return 'Landed';
  if (s === 'maintenance') return 'Maintenance';
  return 'Scheduled';
}

function normalizeTerminal(terminal: string): string {
  if (!terminal) return 'Terminal A';
  const t = terminal.toUpperCase();
  if (t === 'T1' || t === 'T3' && false) return 'Terminal A';
  if (t === 'T2' || t === 'T3') return 'Terminal B';
  if (t === 'T3') return 'Terminal C';
  if (t.includes('A')) return 'Terminal A';
  if (t.includes('B')) return 'Terminal B';
  if (t.includes('C')) return 'Terminal C';
  return 'Terminal A';
}

function transformGateEvent(row: Record<string, any>, index: number): GateEvent {
  const terminal = normalizeTerminal(row.terminal);
  return {
    id: `ge-${index + 1}`,
    eventId: row.eventId || '',
    flightNumber: row.flightNumber || '',
    gate: row.gate || '',
    terminal,
    eventType: row.eventType || '',
    timestamp: row.timestamp || '',
    staffId: row.staffId || '',
    durationMinutes: parseInt(row.durationMinutes) || 0,
    priority: row.priority || 'Routine',
    isEmergency: row.isEmergency === 'True',
    notes: row.notes || '',
    createdAt: row.createdAt || '',
    updatedAt: row.updatedAt || '',
    scheduledTime: row.scheduledTime || '',
    status: 'Occupied',
    bridgeConnected: true,
    powerSupplied: true,
    fuelConnected: false,
  };
}

function transformBaggage(row: Record<string, any>, index: number): BaggageItem {
  return {
    id: `bg-${index + 1}`,
    bagId: row.bagId || '',
    bagTag: row.bagTag || '',
    flightNumber: row.flightNumber || '',
    passengerId: row.passengerId || '',
    weightKg: parseFloat(row.weightKg) || 0,
    dimensions: row.dimensions || '',
    status: row.status || 'Check-in',
    carousel: row.carousel || '',
    checkinTime: row.checkinTime || '',
    lastUpdated: row.lastUpdated || '',
    priority: parseInt(row.priority) || 0,
    currentStatus: row.currentStatus || 'Loaded',
    isDangerous: row.isDangerous === 'True',
    transferCount: parseInt(row.transferCount) || 0,
    location: row.location || '',
    scanTime: row.scanTime || '',
    isInternational: row.isInternational === 'True',
  };
}

function transformPassenger(row: Record<string, any>, index: number): Passenger {
  return {
    id: `ps-${index + 1}`,
    pnrCode: row.pnrCode || '',
    passportNumber: row.passportNumber || '',
    maskedPassport: row.maskedPassport || '',
    firstName: row.firstName || '',
    lastName: row.lastName || '',
    nationality: row.nationality || '',
    dateOfBirth: row.dateOfBirth || '',
    gender: row.gender || '',
    seatNumber: row.seatNumber || '',
    ticketClass: row.ticketClass || 'Economy',
    flightNumber: row.flightNumber || '',
    checkinTime: row.checkinTime || '',
    boardingTime: row.boardingTime || '',
    gate: row.gate || '',
    baggageCount: parseInt(row.baggageCount) || 0,
    email: row.email || '',
    phone: row.phone || '',
    specialAssistance: row.specialAssistance === 'True',
    loyaltyScore: parseFloat(row.loyaltyScore) || 0,
    isVip: row.isVip === 'True',
    originalClass: row.originalClass || 'Economy',
    age: parseInt(row.age) || 0,
    ageGroup: row.ageGroup || '',
    status: 'Checked-In',
  };
}

function transformSecurity(row: Record<string, any>, index: number): SecurityScreening {
  const terminalNum = parseInt(row.terminalNumber) || 1;
  const terminal = terminalNum === 1 ? 'Terminal A' : terminalNum === 2 ? 'Terminal B' : 'Terminal C';
  
  return {
    id: `sc-${index + 1}`,
    screeningId: row.screeningId || '',
    passengerId: row.passengerId || '',
    checkpointCode: row.checkpointCode || '',
    terminalNumber: terminalNum,
    screeningTime: row.screeningTime || '',
    checkinTime: row.checkinTime || '',
    boardingTime: row.boardingTime || '',
    result: row.result || 'Clear',
    hasFlag: row.hasFlag === 'True',
    officerId: row.officerId || '',
    scannerId: row.scannerId || '',
    waitTimeMinutes: parseInt(row.waitTimeMinutes) || 0,
    secondaryCheck: row.secondaryCheck === 'True',
    isPriority: row.isPriority === 'True',
    shiftId: row.shiftId || '',
    queueLength: parseInt(row.queueLength) || 0,
    lanesOpen: parseInt(row.lanesOpen) || 0,
    maxCapacity: parseInt(row.maxCapacity) || 0,
    isOvercrowded: row.isOvercrowded === 'True',
    terminal,
    checkpointId: row.checkpointCode || `CP-${terminalNum}`,
    threatLevel: 'LOW',
    throughputPerMin: Math.max(1, Math.floor((parseInt(row.lanesOpen) || 1) * 10)),
  };
}

function transformMaintenance(row: Record<string, any>, index: number): MaintenanceLog {
  const severityMap: Record<number, MaintenanceLog['severity']> = {
    1: 'Low', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Critical'
  };
  const sev = parseInt(row.severity) || 3;
  
  return {
    id: `mt-${index + 1}`,
    workOrderId: row.workOrderId || '',
    aircraftId: row.aircraftId || '',
    flightNumber: row.flightNumber || '',
    maintenanceType: row.maintenanceType || '',
    technicianId: row.technicianId || '',
    reportedAt: row.reportedAt || '',
    resolvedAt: row.resolvedAt || '',
    priority: parseInt(row.priority) || 3,
    estimatedHours: parseInt(row.estimatedHours) || 0,
    issueDescription: row.issueDescription || '',
    component: row.component || '',
    severity: severityMap[sev] || 'Medium',
    assignedTeam: row.assignedTeam || '',
    isGrounded: row.isGrounded === 'True',
    isRecurring: row.isRecurring === 'True',
    status: row.resolvedAt ? 'Resolved' : 'Pending',
  };
}

function transformStaff(row: Record<string, any>, index: number): StaffShift {
  return {
    id: `st-${index + 1}`,
    staffId: row.staffId || '',
    staffName: row.staffName || '',
    department: row.department || '',
    role: row.role || '',
    hireDate: row.hireDate || '',
    shiftStart: row.shiftStart || '',
    shiftEnd: row.shiftEnd || '',
    terminal: normalizeTerminal(row.terminal),
    assignedGate: row.assignedGate || '',
    teamId: row.teamId || '',
    hoursWorked: parseInt(row.hoursWorked) || 0,
    isOvertime: row.isOvertime === 'True',
    contractEndDate: row.contractEndDate || '',
    language: row.language || 'English',
    status: 'Active',
    contactNumber: `+91-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    location: `${normalizeTerminal(row.terminal)} - Gate ${row.assignedGate || 'TBD'}`,
  };
}

function transformRetail(row: Record<string, any>, index: number): RetailTransaction {
  return {
    id: `rt-${index + 1}`,
    transactionId: row.transactionId || '',
    storeId: row.storeId || '',
    category: row.category || '',
    department: row.department || '',
    passengerId: row.passengerId || '',
    flightNumber: row.flightNumber || '',
    transactionTime: row.transactionTime || '',
    itemName: row.itemName || '',
    quantity: parseInt(row.quantity) || 1,
    amount: parseFloat(row.amount) || 0,
    paymentMethod: row.paymentMethod || 'Card',
    currency: row.currency || 'INR',
    terminal: normalizeTerminal(row.terminal),
    location: row.location || '',
    isInternational: row.isInternational === 'True',
  };
}

// ============================================================
// Main parsing functions
// ============================================================

export function parseFlightsCSV(csv: string): Flight[] {
  return parseCSVWithMapping(csv, FLIGHT_COLUMNS, transformFlight);
}

export function parseGateEventsCSV(csv: string): GateEvent[] {
  return parseCSVWithMapping(csv, GATE_EVENT_COLUMNS, transformGateEvent);
}

export function parseBaggageCSV(csv: string): BaggageItem[] {
  return parseCSVWithMapping(csv, BAGGAGE_COLUMNS, transformBaggage);
}

export function parsePassengersCSV(csv: string): Passenger[] {
  return parseCSVWithMapping(csv, PASSENGER_COLUMNS, transformPassenger);
}

export function parseSecurityCSV(csv: string): SecurityScreening[] {
  return parseCSVWithMapping(csv, SECURITY_COLUMNS, transformSecurity);
}

export function parseMaintenanceCSV(csv: string): MaintenanceLog[] {
  return parseCSVWithMapping(csv, MAINTENANCE_COLUMNS, transformMaintenance);
}

export function parseStaffCSV(csv: string): StaffShift[] {
  return parseCSVWithMapping(csv, STAFF_COLUMNS, transformStaff);
}

export function parseRetailCSV(csv: string): RetailTransaction[] {
  return parseCSVWithMapping(csv, RETAIL_COLUMNS, transformRetail);
}
