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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cleaning CRM Customers</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <input
            type="text"
            placeholder="Zip"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
          />
          <input
            type="text"
            placeholder="Service Plan"
            value={form.servicePlan}
            onChange={(e) => setForm({ ...form, servicePlan: e.target.value })}
          />
          <input
            type="text"
            placeholder="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full mt-4"
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2">
          {editing ? "Update" : "Add"} Customer
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
            className="ml-4 bg-gray-500 text-white px-4 py-2"
          >
            Cancel
          </button>
        )}
      </form>
      <ul>
        {customers.map((c) => (
          <li key={c.id} className="border p-2 mb-2">
            <div>
              <strong>{c.fullName}</strong> — {c.servicePlan} — {c.status}
            </div>
            <div>{c.phone} — {c.email}</div>
            <div>{c.address?.street}, {c.address?.city}, {c.address?.state} {c.address?.zip}</div>
            <div>{c.notes}</div>
            <button onClick={() => handleEdit(c)} className="mr-2 bg-yellow-500 text-white px-2 py-1">
              Edit
            </button>
            <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-2 py-1">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
