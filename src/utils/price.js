export function calculateItemPrice(menu, options = {}) {
  let total = Number(menu?.price || menu?.basePrice || 0);

  if (options.size === "พิเศษ") {
    total += 10;
  }

  const toppings = Array.isArray(options.toppings)
    ? options.toppings
    : options.topping
    ? [options.topping]
    : [];

  toppings.forEach((topping) => {
    if (topping.includes("ไข่ดาว")) total += 10;
    if (topping.includes("ไข่เจียว")) total += 10;
    if (topping.includes("ไข่ข้น")) total += 15;
    if (topping.includes("ชีสดิป")) total += 10;
    if (topping.includes("วิปครีม")) total += 20;
    if (topping.includes("ไข่มุก")) total += 10;
  });

  if (options.drinkType?.includes("เย็น")) {
    total += 5;
  }

  if (options.drinkType?.includes("ปั่น")) {
    total += 10;
  }

  return total;
}

export function calculateCartTotal(cart = []) {
  return cart.reduce((sum, item) => {
    const unitPrice = Number(item.finalPrice || item.price || item.basePrice || 0);
    const quantity = Number(item.quantity || 1);
    return sum + unitPrice * quantity;
  }, 0);
}

export function calculateBillTotal(orders = []) {
  return orders.reduce((sum, order) => {
    const orderTotal = (order.items || []).reduce((itemSum, item) => {
      const unitPrice = Number(item.finalPrice || item.price || item.basePrice || 0);
      const quantity = Number(item.quantity || 1);
      return itemSum + unitPrice * quantity;
    }, 0);

    return sum + orderTotal;
  }, 0);
}
