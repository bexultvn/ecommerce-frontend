import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { clearCart } from './cartService.js';

const ORDERS_KEY = 'orders';

export function getOrders(userId) {
  const orders = lsGetAll(ORDERS_KEY);
  return orders.filter(o => o.userId === String(userId));
}

export function createOrder(userId, cartItems, total) {
  const orders = lsGetAll(ORDERS_KEY);

  const newOrder = {
    id: 'o' + Date.now(),
    userId: String(userId),
    items: cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty
    })),
    total: parseFloat(total.toFixed(2)),
    status: 'Processing',
    date: new Date().toISOString().slice(0, 10)
  };

  orders.push(newOrder);
  lsSet(ORDERS_KEY, orders);
  clearCart();

  return newOrder;
}

export function getOrderById(id) {
  const orders = lsGetAll(ORDERS_KEY);
  return orders.find(o => o.id === String(id)) || null;
}
