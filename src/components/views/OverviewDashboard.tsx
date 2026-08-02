import React from 'react';
import { 
  Plane, 
  DoorOpen, 
  ShieldAlert, 
  Wrench, 
  Users, 
  Luggage, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio,
  ShieldCheck
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const OverviewDashboard: React.FC = () => {
  const { 
    flights, 
    gateEvents, 
    security, 
    baggage, 
    alerts, 
    passengers,
    retail,
    selectedTerminal,
    openFlightDetail, 
    openGateDetail, 
    openAlertDetail,
    eventFeed
  } = useOperational();

  // Filter by terminal
  const filteredFlights = selectedTerminal === 'ALL' ? flights : flights.filter((f) => f.terminal === selectedTerminal);
  const filteredSecurity = selectedTerminal === 'ALL' ? security : security.filter((s) => s.terminal === selectedTerminal);

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  // Flight Status Distribution
  const statusCounts = filteredFlights.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const COLORS = ['#1A1A1A', '#0f766e', '#b45309', '#b91c1c', '#6b21a8', '#475569', '#0369a1'];

  // Security Wait Times
  const securityChartData = filteredSecurity.slice(0, 8).map((sc) => ({
    checkpoint: sc.checkpointId,
    wait: sc.waitTimeMinutes,
    queue: sc.queueLength,
  }));

  // Airline Distribution
  const airlineData: Record<string, number> = filteredFlights.reduce((acc, f) => {
    acc[f.airline] = (acc[f.airline] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const airlinePieData = Object.entries(airlineData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Live Event Feed Section */}
      <div className="bg-white border border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1A1A1A]">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-[#1A1A1A]" />
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">LIVE EVENT FEED</h2>
          </div>
          <span className="text-[10px] text-[#555555] font-bold">{eventFeed.length} events</span>
        </div>
        <div className="flex overflow-x-auto space-x-3 pb-2">
          {eventFeed.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className={`flex-shrink-0 w-64 p-3 border border-[#1A1A1A] ${
                event.severity === 'critical' ? 'bg-rose-50' :
                event.severity === 'warning' ? 'bg-amber-50' :
                'bg-[#F9F8F6]'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-2 h-2 ${
                  event.severity === 'critical' ? 'bg-rose-600' :
                  event.severity === 'warning' ? 'bg-amber-600' :
                  'bg-emerald-600'
                }`}></div>
                <span className="text-[10px] font-bold uppercase">{event.type}</span>
              </div>
              <div className="font-bold text-[#1A1A1A] text-xs truncate">{event.title}</div>
              <div className="text-[9px] text-[#555555] mt-0.5 truncate">{event.description}</div>
            </div>
          ))}
          {eventFeed.length === 0 && (
            <div className="text-[#666666] italic text-xs">No events yet. Simulation will generate events.</div>
          )}
        </div>
      </div>

      {/* Operational Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#1A1A1A] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <h3 className="font-bold text-[#1A1A1A] uppercase flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>ACTIVE ALERTS ({unresolvedAlerts.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {unresolvedAlerts.length > 0 ? (
                unresolvedAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => openAlertDetail(alt.id)}
                    className={`p-3 border border-[#1A1A1A] cursor-pointer transition-all hover:bg-[#F2F1EF] ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-rose-50 border-rose-800 text-rose-950'
                        : alt.severity === 'WARNING'
                        ? 'bg-amber-50 border-amber-800 text-amber-950'
                        : 'bg-blue-50 border-blue-800 text-blue-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold border border-[#1A1A1A] ${
                        alt.severity === 'CRITICAL' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-[10px] text-[#555555] font-bold">{alt.category}</span>
                    </div>
                    <div className="font-bold text-xs mt-1.5 text-[#1A1A1A]">{alt.title}</div>
                    <div className="text-[11px] text-[#333333] mt-1 line-clamp-2">{alt.description}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#666666] font-mono italic">
                  All systems nominal. Zero active incidents.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Flight Status Pie */}
            <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
              <h3 className="font-bold text-[#1A1A1A] uppercase text-xs">FLIGHT STATUS DISTRIBUTION</h3>
              <div className="h-48">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={65}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1A1A1A', borderRadius: '0px', color: '#1A1A1A' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#666666]">Loading...</div>
                )}
              </div>
            </div>

            {/* Security Wait Bar */}
            <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
              <h3 className="font-bold text-[#1A1A1A] uppercase text-xs">SECURITY WAIT TIMES (MIN)</h3>
              <div className="h-48">
                {securityChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={securityChartData}>
                      <XAxis dataKey="checkpoint" stroke="#1A1A1A" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#1A1A1A" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1A1A1A', borderRadius: '0px', color: '#1A1A1A' }} />
                      <Bar dataKey="wait" fill="#1A1A1A" radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#666666]">Loading...</div>
                )}
              </div>
            </div>
          </div>

          {/* Airline Distribution */}
          <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
            <h3 className="font-bold text-[#1A1A1A] uppercase text-xs">AIRLINES IN DATASET (Delhi Airport)</h3>
            <div className="flex flex-wrap gap-2">
              {airlinePieData.map((airline, idx) => (
                <div key={airline.name} className="flex items-center space-x-1.5 bg-[#F9F8F6] px-2.5 py-1 border border-[#1A1A1A]">
                  <div className="w-2 h-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold">{airline.name}</span>
                  <span className="text-[10px] text-[#555555]">({airline.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#1A1A1A] p-4">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Passengers</div>
              <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{passengers.length.toLocaleString()}</div>
              <div className="text-[10px] text-[#555555] mt-1">In Dataset</div>
            </div>
            <div className="bg-white border border-[#1A1A1A] p-4">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Baggage</div>
              <div className="text-2xl font-bold text-amber-800 mt-1">{baggage.length.toLocaleString()}</div>
              <div className="text-[10px] text-amber-900 mt-1">Tracked Items</div>
            </div>
            <div className="bg-white border border-[#1A1A1A] p-4">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Gate Events</div>
              <div className="text-2xl font-bold text-blue-800 mt-1">{gateEvents.length}</div>
              <div className="text-[10px] text-blue-900 mt-1">Activity Records</div>
            </div>
            <div className="bg-white border border-[#1A1A1A] p-4">
              <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Retail Revenue</div>
              <div className="text-2xl font-bold text-emerald-800 mt-1">₹{retail.reduce((a, r) => a + r.amount, 0).toLocaleString()}</div>
              <div className="text-[10px] text-emerald-900 mt-1">Total POS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
