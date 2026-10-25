// Total price of an order, in rupees.
export function orderTotal(items, discount = 0) {
 const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
 return subtotal - discount;
}