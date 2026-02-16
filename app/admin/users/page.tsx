"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

/* =======================
   Types
======================= */

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}

/* =======================
   Dummy Data
======================= */

const MOCK_USERS: User[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "+971 55 123 4567",
    isActive: true,
    createdAt: "2024-10-01T10:00:00Z",
  },
  {
    _id: "2",
    name: "Sarah Khan",
    email: "sarah@example.com",
    phoneNumber: "+971 55 987 6543",
    isActive: false,
    createdAt: "2024-09-15T12:00:00Z",
  },
];

/* =======================
   Page
======================= */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* =======================
     Load Data
  ======================= */

  useEffect(() => {
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 400);
  }, []);

  /* =======================
     Helpers
  ======================= */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

  const toggleStatus = (id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user._id === id
          ? { ...user, isActive: !user.isActive }
          : user
      )
    );

    toast.success("User status updated");
    setOpenMenuId(null);
  };

  /* =======================
     Render
  ======================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-foreground">
        Users
      </h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Joining Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full"
                        alt={user.name}
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4">
                    {user.phoneNumber}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-danger/10 text-danger">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === user._id ? null : user._id
                        )
                      }
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {openMenuId === user._id && (
                      <div className="absolute right-6 mt-2 bg-white shadow-lg rounded-lg z-10">
                        <button
                          onClick={() => toggleStatus(user._id)}
                          className={`block w-full px-4 py-2 text-sm text-left ${
                            user.isActive
                              ? "text-danger hover:bg-danger/10"
                              : "text-primary hover:bg-primary/10"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
