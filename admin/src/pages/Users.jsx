import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  Eye,
  Edit,
  UserPlus,
  ShieldOff,
  MoreVertical,
  Download,
} from "lucide-react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
};

const roleBadge = (isAdmin) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAdmin ? "bg-black text-white" : "bg-gray-100 text-gray-700"}`}>{isAdmin ? "Admin" : "Customer"}</span>
);

const statusBadge = (status) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Blocked" ? "bg-red-100 text-red-600" : "bg-black text-white"}`}>{status}</span>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", isAdmin: false });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });
  const [orderCounts, setOrderCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const usersData = res.data.users || res.data || [];
      setUsers(usersData);
      
      // Fetch order counts for each user
      const orderCountsData = {};
      for (const user of usersData) {
        try {
          const orderRes = await api.get(`/orders/my?userId=${user._id}`);
          orderCountsData[user._id] = orderRes.data.orders ? orderRes.data.orders.length : 0;
        } catch (error) {
          orderCountsData[user._id] = 0;
        }
      }
      setOrderCounts(orderCountsData);
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await api.post("/users", form);
    setForm({ name: "", email: "", phone: "", password: "", isAdmin: false });
    setShowAddForm(false);
    fetchUsers();
  };

  // Mock status and order count for now
  const getStatus = (user) => (user.blocked ? "Blocked" : "Active");
  const getOrderCount = (user) => orderCounts[user._id] || 0;

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      !roleFilter || (roleFilter === "Admin" ? user.isAdmin : !user.isAdmin);
    const matchesStatus =
      !statusFilter || getStatus(user) === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Edit User Handlers
  const openEditUser = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
    setDropdownOpen(null);
  };
  const handleEditInput = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await api.patch(`/users/${editUser._id}`, editForm);
    setEditUser(null);
    fetchUsers();
  };

    // Excel Export Handler
  const handleExportToExcel = () => {
    // Prepare data for export
    const exportData = filteredUsers.map((user, index) => ({
      'S.No': index + 1,
      'Name': user.name || 'N/A',
      'Email': user.email || 'N/A',
      'Phone': user.phone || 'N/A',
      'Role': user.isAdmin ? 'Admin' : 'Customer',
      'Status': getStatus(user),
      'Orders': getOrderCount(user)
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 8 },  // S.No
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 12 }, // Role
      { wch: 12 }, // Status
      { wch: 10 }  // Orders
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `users_export_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Users</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportToExcel}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" /> Export Excel
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-800"
          >
            <UserPlus className="w-5 h-5" /> Add User
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow w-full md:w-72"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow w-full md:w-56"
        >
          <option value="">All Roles</option>
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>

      </div>
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="p-4 text-left font-semibold">User</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Orders</th>

              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-lg">
                    {getInitials(user.name)}
                  </span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{roleBadge(user.isAdmin)}</td>
                <td className="p-4">{getOrderCount(user)}</td>

                <td className="p-4 relative">
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    onClick={() => setDropdownOpen(dropdownOpen === user._id ? null : user._id)}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {dropdownOpen === user._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30">
                      <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => openEditUser(user)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit User
                      </button>

                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="isAdmin"
                  value={form.isAdmin}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value={false}>Customer</option>
                  <option value={true}>Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8860B]"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="isAdmin"
                  value={editForm.isAdmin}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value={false}>Customer</option>
                  <option value={true}>Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8860B]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
