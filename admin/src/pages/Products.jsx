import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", imageUrl: "" });
  const [editId, setEditId] = useState(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get("/products");
    setProducts(res.data.products || []);
    setLoading(false);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm({ name: "", price: "", imageUrl: "" });
    setShowForm(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({ name: product.name, price: product.price, imageUrl: product.imageUrl });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/products/${editId}`, form);
    setEditId(null);
    setForm({ name: "", price: "", imageUrl: "" });
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#D4AF37]">Manage Products</h1>
        <button
          className="bg-[#D4AF37] text-white px-4 py-2 rounded font-bold"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ name: "", price: "", imageUrl: "" });
          }}
        >
          Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={editId ? handleUpdate : handleAdd}
          className="bg-white p-6 rounded shadow mb-6 max-w-md"
        >
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleInput}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleInput}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#D4AF37] text-white px-4 py-2 rounded font-bold"
            >
              {editId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded font-bold"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm({ name: "", price: "", imageUrl: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-[#f7e1c7] text-[#3e2d26]">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  )}
                </td>
                <td className="p-3">
                  <button
                    className="text-blue-600 font-bold mr-2"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 font-bold"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 