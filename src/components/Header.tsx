import React from 'react';
import { 
  Play, 
  Pause, 
  Search, 
  AlertTriangle, 
  Radio, 
  Building2, 
  Clock, 
  ShieldAlert,
  Plane,
  Luggage,
  Users,
  Loader2
} from 'lucide-react';
import { useOperational } from '../context/OperationalContext';

export const Header: React.FC = () => {
  const { 
    currentTime, 
    isPlaying, 
    speedMultiplier, 
    metrics, 
    selectedTerminal, 
    searchTerm,
    isLoaded,
    loadError,
    toggleSimulation, 
    setSpeedMultiplier, 
    setSelectedTerminal, 
    setSearchTerm,
    resetDataToDefault,
    openAlertDetail,
    alerts
  } = useOperational();

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const criticalAlert = unresolvedAlerts.find(a => a.severity === 'CRITICAL');

  // Format time as HH:MM:SS UTC
  const timeString = currentTime.toISOString().substr(11, 8);
  const dateString = currentTime.toISOString().substr(0, 10);

  if (!isLoaded) {
    return (
      <header className="bg-white border-b border-[#1A1A1A] sticky top-0 z-40 text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#1A1A1A]" />
          <span className="font-mono text-sm">Loading operational data from CSV files...</span>
        </div>
      </header>
    );
  }

  if (loadError) {
    return (
      <header className="bg-white border-b border-[#1A1A1A] sticky top-0 z-40 text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 bg-rose-50 border border-rose-800">
          <div className="flex items-center space-x-2 text-rose-950">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-mono text-sm font-bold">Error loading data: {loadError}</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-[#1A1A1A] sticky top-0 z-40 text-[#1A1A1A]">
      {/* Top Banner Alert Ticker */}
      {criticalAlert && (
        <div className="bg-[#1A1A1A] text-white border-b border-[#1A1A1A] px-4 py-1.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 overflow-hidden">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold uppercase tracking-widest text-rose-400 shrink-0">CRITICAL INCIDENT:</span>
            <span className="truncate">{criticalAlert.title} - {criticalAlert.description}</span>
          </div>
          <button 
            onClick={() => openAlertDetail(criticalAlert.id)}
            className="px-2.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shrink-0 uppercase tracking-wider border border-white/20 transition"
          >
            Investigate
          </button>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Mission Status */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-[#1A1A1A] text-white flex items-center justify-center font-bold border border-[#1A1A1A]">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-serif font-bold tracking-tight text-[#1A1A1A]">AOCC CONTROL CENTER</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1A1A1A] text-white border border-[#1A1A1A] uppercase tracking-wider">
                DEL AIRPORT
              </span>
            </div>
            <p className="text-[11px] text-[#555555] flex items-center space-x-2 font-mono uppercase tracking-wider">
              <span>INDIRA GANDHI INTERNATIONAL</span>
              <span>-</span>
              <span className="text-[#1A1A1A] font-bold">REAL-TIME OPERATIONS</span>
            </p>
          </div>
        </div>

        {/* Real-time Clock & Simulation Controls */}
        <div className="flex items-center space-x-3 bg-[#F9F8F6] p-1.5 border border-[#1A1A1A]">
          <div className="flex items-center space-x-2 px-2.5 py-1 bg-white border border-[#1A1A1A]">
            <Clock className="w-4 h-4 text-[#1A1A1A]" />
            <div>
              <div className="text-xs font-mono font-bold text-[#1A1A1A]">{timeString} UTC</div>
              <div className="text-[9px] font-mono text-[#666666]">{dateString}</div>
            </div>
          </div>

          {/* Simulation Speed Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleSimulation}
              className={`p-1.5 font-mono text-xs font-bold border border-[#1A1A1A] transition ${
                isPlaying 
                  ? 'bg-amber-100 text-amber-900 border-amber-800 hover:bg-amber-200'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-800 hover:bg-emerald-200'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {[1, 5, 10, 30].map((speed) => (
              <button
                key={speed}
                onClick={() => setSpeedMultiplier(speed)}
                className={`px-2 py-1 text-xs font-mono font-bold transition border border-[#1A1A1A] ${
                  speedMultiplier === speed
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#F2F1EF]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Global Terminal & Search Controls */}
        <div className="flex items-center space-x-2">
          {/* Terminal Switcher */}
          <div className="flex items-center bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            <Building2 className="w-3.5 h-3.5 text-[#555555] ml-1 mr-1" />
            {['ALL', 'Terminal A', 'Terminal B', 'Terminal C'].map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerminal(term)}
                className={`px-2 py-0.5 text-xs font-mono uppercase tracking-wider font-bold transition border ${
                  selectedTerminal === term
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                {term === 'ALL' ? 'ALL' : term.replace('Terminal ', 'T-')}
              </button>
            ))}
          </div>

          {/* Global Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search Flight, Gate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-[#1A1A1A] text-xs text-[#1A1A1A] placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] w-36 sm:w-48 font-mono"
            />
          </div>

          {/* Reset Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset all operational data to CSV defaults?')) {
                resetDataToDefault();
              }
            }}
            title="Reset Data to Initial State"
            className="px-2.5 py-1 bg-white hover:bg-[#F2F1EF] text-[#1A1A1A] border border-[#1A1A1A] transition text-xs font-mono font-bold"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Operational KPI Strip */}
      <div className="bg-[#F9F8F6] border-t border-[#1A1A1A] py-2 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <div className="bg-white border border-[#1A1A1A] p-2 flex items-center space-x-2">
            <Plane className="w-4 h-4 text-[#1A1A1A]" />
            <div>
              <div className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">Active Flights</div>
              <div className="font-bold text-[#1A1A1A] text-sm">{metrics.activeFlights}</div>
            </div>
          </div>

          <div className="bg-white border border-[#1A1A1A] p-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#1A1A1A]" />
            <div>
              <div className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">On-Time Rate</div>
              <div className="font-bold text-emerald-700 text-sm">{metrics.onTimePercentage}%</div>
            </div>
          </div>

          <div className="bg-white border border-[#1A1A1A] p-2 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-[#1A1A1A]" />
            <div>
              <div className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">Gate Util.</div>
              <div className="font-bold text-blue-800 text-sm">{metrics.gateUtilization}%</div>
            </div>
          </div>

          <div className="bg-white border border-[#1A1A1A] p-2 flex items-center space-x-2">
            <Luggage className="w-4 h-4 text-[#1A1A1A]" />
            <div>
              <div className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">Baggage SLA</div>
              <div className="font-bold text-amber-800 text-sm">{metrics.bagSlaPercentage}%</div>
            </div>
          </div>

          <div className="bg-white border border-[#1A1A1A] p-2 flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#1A1A1A]" />
            <div>
              <div className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">Security Wait</div>
              <div className="font-bold text-purple-900 text-sm">{metrics.avgSecurityWait} min</div>
            </div>
          </div>

          <div className="bg-white border border-[#1A1A1A] p-2 flex items-center space-x-2">
            <AlertTriangle className={`w-4 h-4 ${metrics.activeAlertsCount > 0 ? 'text-rose-600' : 'text-[#666666]'}`} />
            <div>
              <div className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">Active Alerts</div>
              <div className={`font-bold text-sm ${metrics.activeAlertsCount > 0 ? 'text-rose-600 font-black' : 'text-[#1A1A1A]'}`}>
                {metrics.activeAlertsCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
