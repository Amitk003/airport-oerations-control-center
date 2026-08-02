import React from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  CloudLightning, 
  Users,
  Clock,
  Radio
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const IncidentCommand: React.FC = () => {
  const { alerts, resolveAlert, openAlertDetail, addFlight, eventFeed } = useOperational();

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Live Event Feed */}
      <div className="bg-white border border-[#1A1A1A] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-[#1A1A1A]" />
            <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider">LIVE EVENT FEED</h2>
          </div>
          <span className="text-[10px] text-[#555555] font-bold">{eventFeed.length} events</span>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {eventFeed.length > 0 ? (
            eventFeed.slice(0, 20).map((event) => (
              <div
                key={event.id}
                className={`p-2.5 border border-[#1A1A1A] flex items-center justify-between ${
                  event.severity === 'critical' ? 'bg-rose-50' :
                  event.severity === 'warning' ? 'bg-amber-50' :
                  'bg-[#F9F8F6]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${
                    event.severity === 'critical' ? 'bg-rose-600' :
                    event.severity === 'warning' ? 'bg-amber-600' :
                    'bg-emerald-600'
                  }`}></div>
                  <div>
                    <div className="font-bold text-[#1A1A1A]">{event.title}</div>
                    <div className="text-[10px] text-[#555555]">{event.description}</div>
                  </div>
                </div>
                <div className="text-[10px] text-[#555555] text-right">
                  {event.terminal && <div className="font-bold">{event.terminal}</div>}
                  <div>{new Date(event.timestamp).toUTCString().slice(17, 22)} UTC</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-[#666666] italic">No events recorded yet.</div>
          )}
        </div>
      </div>

      {/* Simulation Trigger Station */}
      <div className="bg-white border border-[#1A1A1A] p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-[#1A1A1A] pb-2">
          <Zap className="w-5 h-5 text-[#1A1A1A]" />
          <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider">SIMULATION INCIDENT INJECTOR</h2>
        </div>
        <p className="text-[#555555] text-xs">Trigger operational disruption events to test Control Center responsiveness:</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => {
              addFlight({
                flightNumber: `EM-${Math.floor(Math.random() * 800 + 100)}`,
                airline: 'Emergency Medical Transport',
                airlineCode: 'EM',
                origin: 'MIA',
                destination: 'DEL',
                terminal: 'Terminal A',
                gate: 'A01',
                scheduledDeparture: new Date().toISOString(),
                actualDeparture: new Date().toISOString(),
                scheduledArrival: new Date(Date.now() + 4 * 3600000).toISOString(),
                actualArrival: '',
                aircraftType: 'Learjet 45',
                tailNumber: 'N-EM01',
                capacity: 6,
                passengerCount: 2,
                status: 'Delayed',
                delayMinutes: 0,
                delayReason: 'Priority Air Ambulance Landing Override',
                bridgeConnected: false,
                distanceKm: 0,
                fuelCost: 0,
                boardingTime: '',
                weatherFlag: false,
                loadFactor: 'Low',
                taxiTime: 0,
                timeOfDay: 'Morning',
                dayOfWeek: 'Sat',
                isHoliday: false,
                season: 'Summer',
                routeType: 'Emergency',
              });
            }}
            className="p-3 bg-rose-50 border border-[#1A1A1A] text-rose-950 hover:bg-rose-100 text-left transition flex items-start space-x-2"
          >
            <ShieldAlert className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-950 uppercase tracking-wider text-xs">Inject Emergency Flight</div>
              <div className="text-[10px] text-rose-900 mt-0.5">Dispatches medical transport flight.</div>
            </div>
          </button>

          <button
            onClick={() => {
              alert('Simulated thunderstorm alert dispatched across all terminals!');
            }}
            className="p-3 bg-amber-50 border border-[#1A1A1A] text-amber-950 hover:bg-amber-100 text-left transition flex items-start space-x-2"
          >
            <CloudLightning className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-950 uppercase tracking-wider text-xs">Simulate Thunderstorm Hold</div>
              <div className="text-[10px] text-amber-900 mt-0.5">Flags ground ramp hold due to lightning.</div>
            </div>
          </button>

          <button
            onClick={() => {
              alert('Simulated security queue surge triggered!');
            }}
            className="p-3 bg-purple-50 border border-[#1A1A1A] text-purple-950 hover:bg-purple-100 text-left transition flex items-start space-x-2"
          >
            <Users className="w-5 h-5 text-purple-800 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-purple-950 uppercase tracking-wider text-xs">Simulate Queue Surge</div>
              <div className="text-[10px] text-purple-900 mt-0.5">Spikes security line wait times above SLA.</div>
            </div>
          </button>
        </div>
      </div>

      {/* Active Incidents Stream */}
      <div className="bg-white border border-[#1A1A1A] p-5 space-y-4">
        <h3 className="font-bold text-[#1A1A1A] uppercase text-sm border-b border-[#1A1A1A] pb-2 flex items-center justify-between tracking-wider">
          <span>Active Unresolved Incidents ({activeAlerts.length})</span>
          <span className="text-[10px] text-rose-800 font-bold uppercase">Require Immediate Action</span>
        </h3>

        <div className="space-y-3">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((a) => (
              <div
                key={a.id}
                className="bg-[#F9F8F6] p-4 border border-[#1A1A1A] flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 border border-[#1A1A1A] font-bold uppercase text-[10px] ${
                      a.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-950' :
                      a.severity === 'WARNING' ? 'bg-amber-100 text-amber-950' :
                      'bg-blue-100 text-blue-950'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-[#555555] text-[10px] font-bold">{a.category} • {new Date(a.timestamp).toUTCString().slice(17, 22)} UTC</span>
                  </div>
                  <div className="font-bold text-[#1A1A1A] text-sm">{a.title}</div>
                  <div className="text-[#333333] text-xs">{a.description}</div>
                  {a.resolutionAction && (
                    <div className="text-[#1A1A1A] text-[11px] font-bold mt-1">
                      Protocol: {a.resolutionAction}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAlertDetail(a.id)}
                    className="px-3 py-1.5 bg-white hover:bg-[#F2F1EF] text-[#1A1A1A] border border-[#1A1A1A] font-bold text-xs uppercase tracking-wider"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => resolveAlert(a.id, 'Resolved via Incident Command Center')}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center space-x-1 border border-[#1A1A1A] text-xs uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#666666] italic">
              Zero active operational incidents. All systems running nominally.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
