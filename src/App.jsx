import { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "./api/customersApi";

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    servicePlan: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = {
      ...form,
      fullName: `${form.firstName} ${form.lastName}`,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip,
      },
    };
    if (editing) {
      customer.id = editing;
    }
    try {
      if (editing) {
        await updateCustomer(editing, customer);
        setEditing(null);
      } else {
        await createCustomer(customer);
      }
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        servicePlan: "",
        status: "",
        notes: "",
      });
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (customer) => {
    setEditing(customer.id);
    setForm({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      phone: customer.phone || "",
      email: customer.email || "",
      street: customer.address?.street || "",
      city: customer.address?.city || "",
      state: customer.address?.state || "",
      zip: customer.address?.zip || "",
      servicePlan: customer.servicePlan || "",
      status: customer.status || "",
      notes: customer.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Cleaning CRM</h2>
          <nav>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                  Customers
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-grow p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editing ? "Edit Customer" : "Add New Customer"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-blue-500">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-green-500">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-purple-500">
                Address
              </h3>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Phoenix"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    placeholder="AZ"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    placeholder="85001"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Service Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-orange-500">
                Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Plan</label>
                  <select
                    value={form.servicePlan}
                    onChange={(e) => setForm({ ...form, servicePlan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a plan</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                placeholder="Add any special notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
              >
                {editing ? "Update Customer" : "Add Customer"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      firstName: "",
                      lastName: "",
                      phone: "",
                      email: "",
                      street: "",
                      city: "",
                      state: "",
                      zip: "",
                      servicePlan: "",
                      status: "",
                      notes: "",
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Customers List Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers ({customers.length})</h2>
          {customers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No customers yet. Add one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{c.fullName}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                          {c.servicePlan || "N/A"}
                        </span>
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                          c.status === "active"
                            ? "bg-green-100 text-green-800"
                            : c.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {c.status || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Phone:</span> {c.phone || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Email:</span> {c.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Address:</span> {c.address?.street}, {c.address?.city}, {c.address?.state} {c.address?.zip}
                      </p>
                    </div>
                  </div>
                  {c.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border-l-2 border-blue-500">
                      <p className="text-gray-700 text-sm">
                        <span className="font-semibold">Notes:</span> {c.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
