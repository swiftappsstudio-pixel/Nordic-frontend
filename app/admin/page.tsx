"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_common/auth-context";
import { getAdminDashboardStats } from "@/app/_common/api";
import { DashboardStats } from "@/app/_common/interfaces";
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
import {
  Users,
  CalendarCheck,
  DollarSign,
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  ServerIcon,
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toLocaleDateString("en-US") : "—";

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

export default function AdminDashboard() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setError("You must be logged in as an admin to view the dashboard.");
      setLoading(false);
      return;
    }

    getAdminDashboardStats(token)
      .then((data) => setStats(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load stats"),
      )
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#593e30] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cardStats = [
    { label: "Total Revenue", value: formatAED(stats.totalRevenue), icon: DollarSign, color: "#FF5D00", bg: "bg-orange-50", iconBg: "bg-orange-100" },
    { label: "Total Bookings", value: stats.totalBookings.toLocaleString(), icon: CalendarCheck, color: "#239800", bg: "bg-green-50", iconBg: "bg-green-100" },
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "#041F54", bg: "bg-blue-50", iconBg: "bg-blue-100" },
    { label: "Pending Payments", value: stats.pendingPayments.toLocaleString(), icon: Clock, color: "#9000FF", bg: "bg-purple-50", iconBg: "bg-purple-100" },
    { label: "Today's Revenue", value: formatAED(stats.todayRevenue), icon: TrendingUp, color: "#f97316", bg: "bg-orange-50", iconBg: "bg-orange-100" },
    { label: "Today's Bookings", value: stats.todayBookings.toLocaleString(), icon: Activity, color: "#3b82f6", bg: "bg-blue-50", iconBg: "bg-blue-100" },
    { label: "This Month Revenue", value: formatAED(stats.thisMonthRevenue), icon: CreditCard, color: "#22c55e", bg: "bg-green-50", iconBg: "bg-green-100" },
    { label: "Avg Booking Value", value: formatAED(Math.round(stats.avgBookingValue)), icon: ShoppingBag, color: "#a855f7", bg: "bg-purple-50", iconBg: "bg-purple-100" },
  ];

  const bookingStatusPie = stats.bookingsByStatus.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time business analytics and performance metrics</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          Live data
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cardStats.map((item) => (
          <div key={item.label} className={`${item.bg} p-4 md:p-5 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <div className={`${item.iconBg} p-2 rounded-lg`}>
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
            </div>
            <p className="mt-3 text-xl md:text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats.confirmedBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats.completedBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats.cancelledBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <ServerIcon className="w-4 h-4 text-purple-500" />
            <p className="text-sm text-gray-600">Active Services</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats.activeServices}</p>
        </div>
      </div>

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

      {/* Top Services & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Services */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
          <div className="space-y-3">
            {stats.topServices.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#593e30] text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                  </div>
                </div>
                <p className="font-semibold text-[#593e30] text-sm">{formatAED(service.revenue)}</p>
              </div>
            ))}
            {stats.topServices.length === 0 && (
              <p className="text-gray-400 text-center py-4">No service data yet</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button
              onClick={() => router.push("/admin/orders")}
              className="bg-[#593e30] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3225] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Service</th>
                  <th className="px-5 py-3 text-center font-medium">Amount</th>
                  <th className="px-5 py-3 text-center font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {stats.recentBookings.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 capitalize text-sm text-gray-900">
                      {b.guestInfo?.fullName || "Registered user"}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      <span className="text-gray-900">{b.serviceSnapshot?.title || "—"}</span>
                      {b.subServiceSnapshot?.name && (
                        <span className="block text-xs text-gray-400">
                          {b.subServiceSnapshot.name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center text-sm font-medium text-gray-900">
                      AED {b.totalAmount}
                    </td>
                    <td className="px-5 py-3 text-center text-sm text-gray-600">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}