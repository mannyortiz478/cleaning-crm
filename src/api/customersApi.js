// src/api/customersApi.js

export const getCustomers = async () => {
  const res = await fetch("/api/customers");
  const text = await res.text();
  console.log('Response status:', res.status, 'Body:', text);
  if (!res.ok) throw new Error("Failed to fetch customers: " + text);
  if (!text) throw new Error("Empty response from server");
  return JSON.parse(text);
};

export const getCustomer = async (id) => {
  const res = await fetch(`/api/customer/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return await res.json();
};

export const createCustomer = async (customer) => {
  const res = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return await res.json();
};

export const updateCustomer = async (id, customer) => {
  const res = await fetch(`/api/customer/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return await res.json();
};

export const deleteCustomer = async (id) => {
  const res = await fetch(`/api/customer/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
};
