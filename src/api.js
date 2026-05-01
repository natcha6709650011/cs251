const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : `http://${window.location.hostname}:4000`;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    throw new Error(data.error || data.message || `API error: ${res.status}`);
  }

  return data;
}

export function apiGetMenus() {
  return apiRequest("/api/menus");
}

export function apiGetTables() {
  return apiRequest("/api/tables");
}

export function apiGetEmployee(employeeId) {
  return apiRequest(`/api/employees/${encodeURIComponent(employeeId)}`);
}

export function apiUpdateTableStatus(tableNumber, status) {
  return apiRequest(`/api/tables/${tableNumber}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function apiCreateGeneralCustomer(customerId) {
  return apiRequest("/api/customers/general", {
    method: "POST",
    body: JSON.stringify({ customerId }),
  });
}

export function apiRegisterMember(data) {
  return apiRequest("/api/members", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiFindMemberByPhone(tel) {
  return apiRequest(`/api/members/by-phone/${encodeURIComponent(tel)}`);
}

export function apiCreateReservation(data) {
  return apiRequest("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiGetReservationsByCustomer(customerId) {
  return apiRequest(`/api/reservations/customer/${encodeURIComponent(customerId)}`);
}

export function apiCancelReservation(reservationId) {
  return apiRequest(`/api/reservations/${reservationId}`, {
    method: "DELETE",
  });
}

export function apiCreateOrder(data) {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiCreatePayment(data) {
  return apiRequest("/api/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiCreateOrderReview(data) {
  return apiRequest("/api/reviews/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiCreateEmployeeReview(data) {
  return apiRequest("/api/reviews/employee", {
    method: "POST",
    body: JSON.stringify(data),
  });
}