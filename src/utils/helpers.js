export function generateId(prefix = "ID") {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${Date.now().toString().slice(-6)}${random}`;
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(timeString) {
  if (!timeString) return "-";
  return timeString;
}

export function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  return today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
}

export function isFutureDate(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date > today;
}

export function getCartCount(cart = []) {
  return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}
