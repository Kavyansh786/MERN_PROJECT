import React from 'react'

const dummyOrders = [
  {
    id: 101,
    date: '2025-07-10',
    total: 24998,
    status: 'Delivered',
  },
  {
    id: 102,
    date: '2025-07-01',
    total: 14999,
    status: 'Shipped',
  },
]

export default function Orders() {
  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      <div className="space-y-4">
        {dummyOrders.map((order) => (
          <div key={order.id} className="p-4 border rounded shadow">
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> ₹{order.total.toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
