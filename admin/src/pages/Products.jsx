import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
    isRakhi: false,
    rakhiType: "traditional",
    isFeatured: false,
    isNewArrival: false
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const formRef = useRef(null);

  // Scroll to form when showForm changes to true
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showForm]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get("/products");
    setProducts(res.data.products || res.data || []);
    setLoading(false);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, category: value === "__other__" ? "" : value });
    setCustomCategory("");
    if (value === "__other__") setCustomCategory("");
  };

  // Remove handleImageChange and imagePreview logic

  const handleAdd = async (e) => {
    e.preventDefault();
    const submitForm = { ...form };
    if (customCategory) submitForm.category = customCategory;
    await api.post("/products", submitForm);
    setForm({ name: "", price: "", category: "", imageUrl: "", description: "", isRakhi: false, rakhiType: "traditional", isFeatured: false, isNewArrival: false });
    setShowForm(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      isRakhi: product.isRakhi,
      rakhiType: product.rakhiType || "traditional",
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false
    });
    setShowForm(true);
    setCustomCategory("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const submitForm = { ...form };
    if (customCategory) submitForm.category = customCategory;
    await api.patch(`/products/${editId}`, submitForm);
    setEditId(null);
    setForm({ name: "", price: "", category: "", imageUrl: "", description: "", isRakhi: false, rakhiType: "traditional", isFeatured: false, isNewArrival: false });
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  // Get unique categories for filter and dropdown
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Filtered products
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter ? p.category === categoryFilter : true)
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Products</h1>
        <button
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-800"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ name: "", price: "", category: "", imageUrl: "", description: "", isRakhi: false, rakhiType: "traditional", isFeatured: false, isNewArrival: false });
            setCustomCategory("");
          }}
        >
          <span className="text-xl font-bold">+</span> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow w-full md:w-72"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow w-full md:w-56"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow w-full md:w-40"
          disabled
        >
          <option>Active</option>
        </select>
      </div>

      {/* Product Form */}
      {showForm && (
        <form
          ref={formRef}
          onSubmit={editId ? handleUpdate : handleAdd}
          className="bg-white p-6 rounded-xl shadow mb-6 max-w-xl"
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
            <label className="block mb-1 font-semibold">Price (₹)</label>
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
            <label className="block mb-1 font-semibold">Category</label>
            <select
              name="category"
              value={form.category || (customCategory ? "__other__" : "")}
              onChange={handleCategoryChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__other__">Other</option>
            </select>
            {form.category === "" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-2"
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleInput}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isRakhi"
                checked={form.isRakhi}
                onChange={handleInput}
              />
              Is Rakhi?
            </label>
            <select
              name="rakhiType"
              value={form.rakhiType}
              onChange={handleInput}
              className="border rounded px-2 py-1"
              disabled={!form.isRakhi}
            >
              <option value="traditional">Traditional</option>
              <option value="designer">Designer</option>
              <option value="premium">Premium</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleInput}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={form.isNewArrival}
                onChange={handleInput}
              />
              New Arrival
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded font-bold"
            >
              {editId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded font-bold"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm({ name: "", price: "", category: "", imageUrl: "", description: "", isRakhi: false, rakhiType: "traditional", isFeatured: false, isNewArrival: false });
                setCustomCategory("");
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
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="p-4 text-left font-semibold">Product</th>
                <th className="p-4 text-left font-semibold">Price</th>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Image</th>
                <th className="p-4 text-left font-semibold">Featured</th>
                <th className="p-4 text-left font-semibold">New Arrival</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{p.name}</td>
                  <td className="p-4 font-semibold text-gray-900">₹{p.price}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
                    )}
                  </td>
                  <td className="p-4 text-center">{p.isFeatured ? '✔️' : ''}</td>
                  <td className="p-4 text-center">{p.isNewArrival ? '✔️' : ''}</td>
                  <td className="p-4">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-semibold">Active</span>
                  </td>
                  <td className="p-4">
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
        </div>
      )}
    </div>
  );
} 