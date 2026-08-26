"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardStats } from "@/app/_common/interfaces";

const PIE_COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#a855f7"];
const CHART_PRIMARY = "#593e30";
const CHART_ACCENT = "#f97316";
const CHART_GREEN = "#22c55e";
const CHART_BLUE = "#3b82f6";

const formatAED = (val: number) => `AED ${val.toLocaleString()}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.name.includes("Revenue") || entry.name.includes("revenue")
              ? formatAED(entry.value)
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface DashboardChartsProps {
  stats: DashboardStats;
}

export default function DashboardCharts({ stats }: DashboardChartsProps) {
  const bookingStatusPie = stats.bookingsByStatus.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
  }));

  return (
    <>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Bookings Trend */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_ACCENT} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_ACCENT} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_BLUE} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke={CHART_ACCENT} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (AED)" />
              <Area yAxisId="right" type="monotone" dataKey="bookings" stroke={CHART_BLUE} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {bookingStatusPie.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Category */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bookingsByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#666" }} />
              <YAxis tick={{ fontSize: 12, fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="bookings" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} name="Bookings" />
              <Bar dataKey="revenue" fill={CHART_ACCENT} radius={[4, 4, 0, 0]} name="Revenue (AED)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.userGrowthChartData}>
              <defs>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_GREEN} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis tick={{ fontSize: 12, fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="newUsers" stroke={CHART_GREEN} fillOpacity={1} fill="url(#colorNewUsers)" name="New Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
