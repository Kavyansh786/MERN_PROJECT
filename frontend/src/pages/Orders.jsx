import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/my')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#3e2d26] p-6 text-[#fff6ee]">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-[#f7c59f] font-serif tracking-wide drop-shadow-gold royal-heading animate-slide-fade-in">Your Orders</h1>

      {error && (
        <div className="text-[#f39c6b] text-center mb-4 bg-[#4a3b35] px-4 py-2 rounded shadow animate-fade-in font-semibold">{error}</div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-[#fff6ee]/60 animate-fade-in">No orders found.</p>
      ) : (
        <div className="space-y-8 max-w-3xl mx-auto">
          {orders.map((order, idx) => (
            <div key={order._id} className={`p-6 border-2 border-[#f7c59f] rounded-2xl shadow-xl bg-[#4a3b35] text-[#fff6ee] transition-all duration-300 group animate-slide-fade-in delay-${idx * 100} hover:-translate-y-2 hover:shadow-2xl hover:border-[#f39c6b] hover:ring-2 hover:ring-[#f7c59f]/40`}>
              <p className="mb-1 text-lg"><strong className="text-[#f7c59f]">Order ID:</strong> <span className="tracking-wider">#{order._id}</span></p>
              <p className="mb-1 text-lg"><strong className="text-[#f7c59f]">Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mb-1 text-lg"><strong className="text-[#f7c59f]">Total:</strong> <span className="font-bold">₹{order.totalPrice?.toLocaleString() || '—'}</span></p>
              <p className="text-lg"><strong className="text-[#f7c59f]">Status:</strong> <span className="group-hover:text-[#f7c59f] transition">{order.orderStatus}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
