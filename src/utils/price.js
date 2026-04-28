export function calculateItemPrice(menu, options = {}) {
  let total = Number(menu?.price || 0);
  if (options.size === "พิเศษ") total += 10;
  if (options.topping === "ไข่ดาว") total += 10;
  if (options.topping === "ไข่เจียว") total += 10;
  if (options.topping === "ไข่ข้น") total += 15;
  if (options.topping === "ชีสดิป") total += 10;
  if (options.topping === "วิปครีม") total += 20;
  if (options.topping === "ไข่มุก") total += 10;
  if (options.drinkType === "เย็น") total += 5;
  if (options.drinkType === "ปั่น") total += 10;
  return total;
}

export function calculateCartTotal(cart = []) {
  return cart.reduce((sum, item) => sum + Number(item.finalPrice || 0) * Number(item.quantity || 1), 0);
}

export function calculateBillTotal(orders = []) {
  return orders.reduce((sum, order) => {
    const orderTotal = (order.items || []).reduce((itemSum, item) => itemSum + Number(item.finalPrice || 0) * Number(item.quantity || 1), 0);
    return sum + orderTotal;
  }, 0);
}
