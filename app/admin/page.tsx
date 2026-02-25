"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/* -------------------- HELPERS -------------------- */

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-success";
    case "Pending":
      return "bg-orange-100 text-darkRed";
    case "Assigned":
    case "Accepted":
      return "bg-blue-100 text-lightBlue";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US");

/* -------------------- MOCK DATA -------------------- */

const statistics = {
  totalUsers: 1250,
  totalOrders: 845,
  totalVendors: 96,
  totalRevenue: 154320.75,
};

const recentOrders = [
  {
    _id: "ORD12345678",
    user_name: "Ahmed Khan",
    total_price: 250,
    status: "Completed",
    createdAt: "2025-12-18",
  },
  {
    _id: "ORD87654321",
    user_name: "Sara Ali",
    total_price: 180,
    status: "Pending",
    createdAt: "2025-12-19",
  },
  {
    _id: "ORD44556677",
    user_name: "John Smith",
    total_price: 420,
    status: "Assigned",
    createdAt: "2025-12-20",
  },
];

/* -------------------- COMPONENT -------------------- */

export default function AdminDashboard() {
  const router = useRouter();

  const cardStats = [
    {
      label: "Total Users",
      color: "#041F54",
      value: statistics.totalUsers,
    },
    {
      label: "Total Orders",
      color: "#239800",
      value: statistics.totalOrders,
    },
    {
      label: "Total Vendors",
      color: "#9000FF",
      value: statistics.totalVendors,
    },
    {
      label: "Total Revenue",
      color: "#FF5D00",
      value: `AED ${statistics.totalRevenue.toFixed(2)}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardStats.map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p
                className="text-sm font-medium"
                style={{ color: item.color }}
              >
                {item.label}
              </p>
              <Image
                src="/svgs/user.svg"
                alt="icon"
                width={24}
                height={24}
              />
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-10 bg-white rounded-lg shadow-sm">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <button
            onClick={() => {
              toast.success("View all clicked (frontend only)");
              router.push("/admin/orders");
            }}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-gray-500 text-sm">
                <th className="px-6 py-4 text-left">User Name</th>
                <th className="px-6 py-4 text-center">Order ID</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b last:border-none">
                  <td className="px-6 py-4 capitalize">
                    {order.user_name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    AED {order.total_price}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
