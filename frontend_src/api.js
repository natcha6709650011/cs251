// src/api.js
const API_BASE_URL = "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return data;
}

export async function apiHealthCheck() {
  return request("/");
}

export async function apiGetMenus() {
  return request("/api/menus");
}

export async function apiGetTables() {
  return request("/api/tables");
}

export async function apiUpdateTableStatus(tableNumber, status) {
  return request(`/api/tables/${tableNumber}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function apiGetEmployee(employeeId) {
  return request(`/api/employees/${employeeId}`);
}

export async function apiCreateGeneralCustomer(customerId) {
  return request("/api/customers/general", {
    method: "POST",
    body: JSON.stringify({ customerId }),
  });
}

export async function apiRegisterMember(data) {
  return request("/api/members", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiFindMemberByPhone(tel) {
  return request(`/api/members/by-phone/${tel}`);
}

export async function apiCreateReservation(data) {
  return request("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetReservationsByCustomer(customerId) {
  return request(`/api/reservations/customer/${customerId}`);
}

export async function apiCancelReservation(reservationId) {
  return request(`/api/reservations/${reservationId}`, {
    method: "DELETE",
  });
}

export async function apiCreateOrder(data) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetOrdersByTable(tableNumber) {
  return request(`/api/orders/table/${tableNumber}`);
}

export async function apiGetOrderDetails(orderId) {
  return request(`/api/orders/${orderId}/details`);
}

export async function apiCreatePayment(data) {
  return request("/api/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiCreateOrderReview(data) {
  return request("/api/reviews/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiCreateEmployeeReview(data) {
  return request("/api/reviews/employee", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
