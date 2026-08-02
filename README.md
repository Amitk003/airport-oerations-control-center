# 🛫 Airport Operations Control Center (AOCC)

A production-quality, real-time Airport Operations Control Center built for the **Frontend Wars 2026 Grand Finale** hackathon. This application transforms the provided multi-table airport dataset from **Indira Gandhi International Airport (DEL)** into a unified, interactive operational interface.

![AOCC Dashboard](https://via.placeholder.com/1200x400/1A1A1A/FFFFFF?text=AOCC+CONTROL+CENTER)

## 🎯 Live Demo

[View Live Application](https://your-deployed-url.vercel.app)

## 📊 Dataset

This application loads **real operational data** from Delhi Airport (DEL) including:
- **100+ flight records** from airlines: Vistara, British Airways, KLM, SpiceJet, Air France, Emirates, IndiGo, Qatar Airways, Singapore Airlines, Lufthansa
- **Gate events** with jet bridge, GPU, and fueling telemetry
- **Baggage tracking** with RFID scan points and conveyor status
- **Passenger manifests** with check-in, security, and boarding status
- **Security screening** with queue lengths, wait times, and threat levels
- **Maintenance logs** with severity levels and technician assignments
- **Staff shifts** with department assignments and contact info
- **Retail transactions** with POS data across terminal outlets

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Amitk003/airport-oerations-control-center.git
cd airport-oerations-control-center

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Gemini API Key for AI features
GEMINI_API_KEY=your_api_key_here
```

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite 6** | Build Tool & Dev Server |
| **Tailwind CSS 4** | Styling |
| **Recharts** | Data Visualization |
| **Lucide React** | Icons |
| **PapaParse** | CSV Parsing |

## 📁 Project Structure

```
airport-operations-control-center/
├── public/data/              # CSV dataset files (loaded at runtime)
│   ├── flights.csv
│   ├── gate_events.csv
│   ├── baggage.csv
│   ├── passengers.csv
│   ├── security_screening.csv
│   ├── maintenance_logs.csv
│   ├── staff_shifts.csv
│   └── retail_transactions.csv
├── src/
│   ├── components/
│   │   ├── views/           # 11 operational views
│   │   │   ├── OverviewDashboard.tsx
│   │   │   ├── FlightOperations.tsx
│   │   │   ├── GateManagement.tsx
│   │   │   ├── BaggageTracking.tsx
│   │   │   ├── PassengerOperations.tsx
│   │   │   ├── SecurityScreening.tsx
│   │   │   ├── MaintenanceFleet.tsx
│   │   │   ├── StaffDispatch.tsx
│   │   │   ├── RetailAnalytics.tsx
│   │   │   ├── IncidentCommand.tsx
│   │   │   └── DatasetInspector.tsx
│   │   └── modals/          # Detail modals
│   ├── context/
│   │   └── OperationalContext.tsx  # Global state & simulation engine
│   ├── hooks/
│   │   └── useTableSort.ts        # Reusable sorting hook
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils/
│       ├── csvColumnMap.ts       # CSV schema mapping
│       └── csvParser.ts          # CSV import/export
└── package.json
```

## ✨ Features

### 📊 Operational Dashboard
- **Terminal Gate Map Radar** - Visual gate status across Terminals A, B, C
- **Live Event Feed** - Real-time operational events
- **KPI Strip** - Active flights, on-time rate, gate utilization, baggage SLA, security wait, alerts
- **Flight Status Distribution** - Pie chart of all flight statuses
- **Security Wait Times** - Bar chart of checkpoint congestion

### ✈️ Flight Operations
- Complete flight schedule with 100+ real flights
- Filter by status, airline, terminal
- **Column sorting** on all fields
- Dispatch new flights
- Delay tracking with reasons

### 🚪 Gate Management
- Gate card visualization with status indicators
- **Jet Bridge & GPU toggle controls**
- Emergency event detection
- Duration and priority tracking

### 🧳 Baggage Tracking
- RFID bag tag tracking
- Weight, dimensions, and location
- **Dangerous goods flagging**
- International baggage tracking

### 👥 Passenger Operations
- Passenger manifest with PNR codes
- **Class distribution** (First, Business, Economy)
- VIP and special assistance flags
- Flight linking

### 🔒 Security Screening
- Checkpoint monitoring with queue lengths
- **Wait time calculation**
- **Threat level indicators** (LOW, ELEVATED, HIGH)
- **Lane open/close controls**

### 🔧 Maintenance Fleet
- Work order management
- **Severity filtering** (Critical, High, Medium, Low)
- Aircraft grounding status
- Technician assignment

### 👷 Staff Dispatch
- Department filtering (Ops, Security, Maintenance, etc.)
- **Status toggle** (Active, On-Break, Off-Duty)
- Overtime tracking
- Multi-language support

### 🛍️ Retail Analytics
- POS revenue tracking (INR)
- **Category breakdown** with pie chart
- Store performance ranking
- Transaction history

### 🚨 Incident Command
- **Live event feed** with severity indicators
- **Simulation incident injector** (emergency flights, weather, queue surges)
- Alert resolution workflow
- Cross-table alert linking

### 📋 Dataset Inspector
- **Raw data viewer** for all 8 CSV tables
- **Data dictionary** with field definitions
- **CSV import/export** functionality

## 🎮 Real-Time Simulation

The application simulates a live operational environment:

- **Clock advances** at configurable speed (1x, 5x, 10x, 30x)
- **Passenger status progression** (Checked-In → Security-Passed → Boarding → Boarded)
- **Baggage sorting** (Check-in → Sorting → Loaded)
- **Security queue fluctuation** with dynamic wait time calculation
- **Random alert generation** every 20 simulation ticks
- **Flight status updates** (Scheduled → Boarding → Departed)

## 📊 Data Integration

The application demonstrates meaningful cross-table relationships:

- **Flight → Gate** - Gate events linked to assigned flights
- **Flight → Passengers** - Passenger manifest per flight
- **Flight → Baggage** - Baggage tracking per flight
- **Flight → Maintenance** - Work orders linked to aircraft
- **Gate → Staff** - Personnel assigned to gate stations
- **Alerts → Entities** - Alerts linked to specific flights, gates, or checkpoints

## 🎨 Design System

- **Monochrome tactical aesthetic** - Black/white/off-white color scheme
- **JetBrains Mono** - Data and labels
- **Plus Jakarta Sans** - Headings
- **Border-heavy UI** - Sharp corners, high contrast
- **Information-dense** - Compact spacing for control center environment

## 📝 Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Type checking
npm run clean    # Clean build artifacts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Frontend Wars 2026 Grand Finale hackathon.

## 🙏 Acknowledgments

- **Frontend Arena** for organizing the hackathon
- **Delhi Airport (DEL)** for the realistic operational dataset
- **React** and **Vite** communities for excellent tooling
