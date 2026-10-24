// Total price of an order, in rupees.
export function orderTotal(items) {
 const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
 return subtotal;
}
// touched
