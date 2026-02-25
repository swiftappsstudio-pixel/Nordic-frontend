"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  customerName :string;
  serviceName: string;
  price: number;
  address: string;
  date: string;
  time: string;
  userName: string;
  phoneNumber: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("http://localhost:3100/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl text-black font-bold mb-6">Orders</h1>

      <table className="w-full text-black border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">User</th>
            <th className="p-3 border">Service</th>
                        <th className="p-3 border">Address</th>
            <th className="p-3 border">Number </th>

            <th className="p-3 border">Price</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="p-3 border">{order.customerName}</td>
              <td className="p-3 border">{order.serviceName}</td>
              <td className="p-3 border">{order.address}</td>
              <td className="p-3 border">{order.phoneNumber}</td>
              <td className="p-3 border">AED {order.price}</td>
              <td className="p-3 border">{order.date}</td>
              <td className="p-3 border">{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
