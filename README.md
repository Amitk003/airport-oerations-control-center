# Airport Operations Control Center (AOCC)

A real-time, data-driven Airport Operations Control Center built for the Frontend Wars 2026 Grand Finale. This system unifies 8 distinct operational streams from Indira Gandhi International Airport (DEL) into a single high-density command terminal.

[Live Application Demo](https://airport-operations-control-center-theta.vercel.app)

---

## Why AOCC?

Modern airport operations depend on real-time awareness across ground, gate, flight, passenger, and security domains. Standard tools separate these workflows into isolated views. AOCC connects these datasets in a single interface, giving operators complete control over airport throughput, delay prevention, and emergency response.

- **Unified Intelligence**: Correlates 8 live CSV datasets covering 100+ flights, gate ground power, baggage scans, passenger manifests, security queues, maintenance logs, staff shifts, and terminal retail revenue.
- **Real-Time Simulation Engine**: Simulates live airport events with controllable playback speeds (1x to 30x), automated anomaly detection, and instant incident injection.
- **Actionable Control**: Allows operators to update flight schedules, toggle gate equipment, reassign staff, manage security lanes, log maintenance orders, and resolve critical incidents directly from the dashboard.
- **Tactical Information Density**: Designed with a high-contrast tactical interface optimized for control room displays and fast decision-making under operational pressure.

---

## Operational Modules

### 1. Overview Dashboard
- High-level KPI indicators for active flights, on-time rates, gate occupancy, baggage SLA compliance, and security wait times.
- Terminal Radar map visualizing live status across Terminals A, B, and C.
- Security checkpoint queue trends and flight status distribution charts.
- Live event stream capturing operational occurrences in real time.

### 2. Flight Operations
- Complete schedule management for over 100 flights across major international and domestic carriers.
- Quick filtering by flight status, airline, and terminal.
- Flight creation, delay logging with reason codes, and column-level sorting across all fields.

### 3. Gate Management
- Terminal gate grid with real-time status tracking (Boarding, Deboarding, Maintenance, Available).
- Direct control toggles for Jet Bridge attachments and Ground Power Units (GPU).
- Turnaround timer countdowns and priority equipment alerts.

### 4. Baggage Tracking
- End-to-end RFID baggage movement tracking across scan points.
- Instant flags for dangerous goods, overweight luggage, and international routing.
- Real-time conveyor belt assignment monitoring.

### 5. Passenger Operations
- Passenger manifest matching with PNR lookup and flight linkage.
- Cabin class distribution metrics (First, Business, Economy).
- Quick identification of VIP passengers and passengers requiring special assistance.

### 6. Security Screening
- Real-time queue length tracking and estimated wait time calculations.
- Active threat level monitoring (Low, Elevated, High).
- Dynamic lane opening and closing controls to prevent checkpoint bottlenecks.

### 7. Maintenance & Fleet
- Technical work order management with clear severity grading (Critical, High, Medium, Low).
- Grounding status monitoring for aircraft safety compliance.
- Direct technician assignment and completion tracking.

### 8. Staff Dispatch
- Personnel monitoring across Operations, Security, Maintenance, and Ground Handling.
- Real-time shift status toggles (Active, On Break, Off Duty).
- Overtime tracking and multi-language capability indexing.

### 9. Terminal Retail Analytics
- Store-by-store POS revenue tracking in INR.
- Category revenue distribution charts and store performance rankings.
- Transaction logs linked to terminal foot traffic.

### 10. Incident Command
- Live alert resolution workflow for system anomalies.
- Scenario simulation injector allowing operators to trigger weather delays, security surges, or emergency landings.
- Cross-table impact tracking linking alerts directly to affected flights and gates.

### 11. Dataset Inspector
- Full raw data viewer for all 8 underlying airport tables.
- Data schema dictionary explaining operational field definitions.
- Built-in CSV import and export capabilities.

---

## Data Integration & Cross-Table Mapping

The application maintains strict relational integrity across independent operational tables:

- **Flight to Gate**: Gate assignments automatically sync with ground power and bridge status.
- **Flight to Passenger & Baggage**: Flight updates cascade to passenger manifests and baggage RFID checkpoints.
- **Flight to Maintenance**: Aircraft maintenance flags automatically update flight availability.
- **Gate to Staff**: Personnel dispatches map directly to active terminal gate stations.

---

## Technical Stack

| Category | Technology |
| --- | --- |
| Core Framework | React 19, TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Visualization | Recharts |
| Icons | Lucide React |
| Data Processing | PapaParse |

---

## Quick Start

### Prerequisites
- Node.js 18 or higher (Node.js 20 recommended)
- npm or yarn

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Amitk003/airport-oerations-control-center.git
cd airport-oerations-control-center

# Install dependencies
npm install

# Run development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build Commands

```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run TypeScript type check
```

---

## License

Built for the **Frontend Wars 2026 Grand Finale** hackathon.
