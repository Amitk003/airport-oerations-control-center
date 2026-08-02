import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Store, 
  CreditCard 
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const RetailAnalytics: React.FC = () => {
  const { retail, selectedTerminal } = useOperational();

  const filteredRetail = selectedTerminal === 'ALL' 
    ? retail 
    : retail.filter((r) => r.terminal === selectedTerminal);

  const totalRevenue = filteredRetail.reduce((acc, r) => acc + r.amount, 0);
  const avgTransaction = filteredRetail.length > 0 ? (totalRevenue / filteredRetail.length).toFixed(2) : '0.00';

  // Category breakdown for chart
  const categoryData = filteredRetail.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + r.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryData).map((cat) => ({
    name: cat,
    value: Math.round(categoryData[cat]),
  }));

  const COLORS = ['#1A1A1A', '#555555', '#047857', '#1D4ED8', '#B45309', '#7C3AED', '#DC2626'];

  // Store breakdown
  const storeData: Record<string, { transactions: number; revenue: number; category: string }> = filteredRetail.reduce((acc: Record<string, { transactions: number; revenue: number; category: string }>, r) => {
    if (!acc[r.storeId]) {
      acc[r.storeId] = { transactions: 0, revenue: 0, category: r.category };
    }
    acc[r.storeId].transactions++;
    acc[r.storeId].revenue += r.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">₹{totalRevenue.toFixed(0)}</div>
          <div className="text-[10px] text-emerald-900 mt-1">INR Transactions</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Total Transactions</div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">{filteredRetail.length}</div>
          <div className="text-[10px] text-[#555555] mt-1">POS Records</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Avg Basket Size</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">₹{avgTransaction}</div>
          <div className="text-[10px] text-amber-900 mt-1">Per Transaction</div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4">
          <div className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">Active Stores</div>
          <div className="text-2xl font-bold text-blue-800 mt-1">{Object.keys(storeData).length}</div>
          <div className="text-[10px] text-blue-900 mt-1">Retail Outlets</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
          <h3 className="font-bold text-[#1A1A1A] uppercase text-xs tracking-wider border-b border-[#1A1A1A] pb-2">REVENUE BY CATEGORY (₹)</h3>
          <div className="h-56">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ₹${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[#666666]">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
          <h3 className="font-bold text-[#1A1A1A] uppercase text-xs tracking-wider border-b border-[#1A1A1A] pb-2">TOP STORES BY REVENUE</h3>
          <div className="overflow-y-auto max-h-56 space-y-2 pr-1">
            {Object.entries(storeData)
              .sort(([, a], [, b]) => b.revenue - a.revenue)
              .slice(0, 10)
              .map(([storeId, data]) => (
                <div key={storeId} className="bg-[#F9F8F6] p-2.5 border border-[#1A1A1A] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1A1A1A] text-xs">{storeId}</div>
                    <div className="text-[10px] text-[#555555]">{data.category} • {data.transactions} txns</div>
                  </div>
                  <div className="font-bold text-emerald-800 text-sm">₹{data.revenue.toFixed(0)}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
        <h3 className="font-bold text-[#1A1A1A] uppercase text-xs tracking-wider border-b border-[#1A1A1A] pb-2">
          RECENT TRANSACTIONS (Last 20)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A]">
              <tr>
                <th className="p-2">Transaction ID</th>
                <th className="p-2">Store</th>
                <th className="p-2">Category</th>
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
              {filteredRetail.slice(0, 20).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F9F8F6]">
                  <td className="p-2 text-[10px] text-[#555555]">{tx.transactionId}</td>
                  <td className="p-2 font-bold text-[#1A1A1A]">{tx.storeId}</td>
                  <td className="p-2 text-[#333333]">{tx.category}</td>
                  <td className="p-2 text-[#333333]">{tx.itemName}</td>
                  <td className="p-2 text-[#333333]">{tx.quantity}</td>
                  <td className="p-2 font-bold text-emerald-800">₹{tx.amount.toFixed(0)}</td>
                  <td className="p-2 text-[#555555]">{tx.paymentMethod}</td>
                  <td className="p-2 font-bold text-[#1A1A1A]">{tx.terminal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
