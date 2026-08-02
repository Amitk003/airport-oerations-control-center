import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Building2, 
  Clock
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const StaffDispatch: React.FC = () => {
  const { staff, selectedTerminal, updateStaffStatus } = useOperational();
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staff.filter((s) => {
    const matchesTerminal = selectedTerminal === 'ALL' || s.terminal === selectedTerminal;
    const matchesDepartment = departmentFilter === 'ALL' || s.department === departmentFilter;
    const matchesSearch = 
      searchTerm === '' ||
      s.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedGate.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTerminal && matchesDepartment && matchesSearch;
  });

  // Get unique departments
  const departments = Array.from(new Set(staff.map(s => s.department)));

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Staff</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{staff.length}</div>
          <div className="text-[10px] text-[#555555] mt-1">In Roster</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Departments</div>
          <div className="text-2xl font-bold text-blue-800 mt-1">{departments.length}</div>
          <div className="text-[10px] text-blue-900 mt-1">Active</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Overtime Staff</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">
            {staff.filter(s => s.isOvertime).length}
          </div>
          <div className="text-[10px] text-amber-900 mt-1">Extended Shift</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Avg Hours</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {staff.length > 0 ? Math.round(staff.reduce((acc, s) => acc + s.hoursWorked, 0) / staff.length) : 0}h
          </div>
          <div className="text-[10px] text-emerald-900 mt-1">Per Shift</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
          {['ALL', ...departments].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition border ${
                departmentFilter === dept
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Name, ID, Gate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none font-mono w-56"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A] sticky top-0">
              <tr>
                <th className="p-3">Staff Name</th>
                <th className="p-3">ID / Department</th>
                <th className="p-3">Role</th>
                <th className="p-3">Terminal / Gate</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Language</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-[#F9F8F6] transition">
                  <td className="p-3 font-bold text-[#1A1A1A] text-sm">{member.staffName}</td>

                  <td className="p-3">
                    <div className="font-bold text-[#1A1A1A]">{member.staffId}</div>
                    <div className="text-[10px] text-[#555555]">{member.department}</div>
                  </td>

                  <td className="p-3 font-bold text-[#1A1A1A]">{member.role}</td>

                  <td className="p-3 text-[#333333]">
                    <span className="font-bold text-[#1A1A1A]">{member.terminal}</span>
                    <span className="ml-1 text-[#555555]">— {member.assignedGate}</span>
                  </td>

                  <td className="p-3 text-[#555555]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{member.shiftStart} - {member.shiftEnd}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className={`font-bold ${member.isOvertime ? 'text-amber-700' : 'text-[#1A1A1A]'}`}>
                      {member.hoursWorked}h
                    </span>
                    {member.isOvertime && (
                      <span className="ml-1 text-[9px] text-amber-700 font-bold">OT</span>
                    )}
                  </td>

                  <td className="p-3 text-[#555555]">{member.language}</td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A] ${
                      member.status === 'Active' ? 'bg-emerald-100 text-emerald-950' :
                      member.status === 'On-Break' ? 'bg-amber-100 text-amber-950' :
                      'bg-[#F2F1EF] text-[#1A1A1A]'
                    }`}>
                      {member.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <select
                      value={member.status}
                      onChange={(e) => updateStaffStatus(member.id, e.target.value as any)}
                      className="bg-white border border-[#1A1A1A] text-[#1A1A1A] p-1 text-[11px] font-mono font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="On-Break">On-Break</option>
                      <option value="Off-Duty">Off-Duty</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
