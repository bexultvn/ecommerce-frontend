import { config } from '../config/config.js';
import { apiGet, apiPost } from './api.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { clearCart } from './cartService.js';

const ORDERS_KEY = 'orders';

export async function createOrder(customerId, cartItems, total, paymentMethod) {
  if (config.MOCK.order) {
    const orders = lsGetAll(ORDERS_KEY);
    const newOrder = {
      id: 'o' + Date.now(),
      userId: String(customerId),
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty
      })),
      total: parseFloat(total.toFixed(2)),
      status: 'Processing',
      paymentMethod: paymentMethod || 'CREDIT_CARD',
      date: new Date().toISOString().slice(0, 10)
    };
    orders.push(newOrder);
    lsSet(ORDERS_KEY, orders);
    clearCart();
    return newOrder;
  }

  const body = {
    reference: 'ORD-' + Date.now(),
    amount: parseFloat(total.toFixed(2)),
    paymentMethod,
    customerId: String(customerId),
    products: cartItems.map(item => ({
      productId: item.productId,
      quantity: item.qty
    }))
  };
  const orderId = await apiPost('/orders', body);
  clearCart();
  return { id: orderId };
}

export async function getOrders(userId) {
  if (config.MOCK.order) {
    const orders = lsGetAll(ORDERS_KEY);
    return orders.filter(o => o.userId === String(userId));
  }
  return apiGet('/orders');
}

export async function getOrderById(id) {
  if (config.MOCK.order) {
    const orders = lsGetAll(ORDERS_KEY);
    return orders.find(o => o.id === String(id)) || null;
  }
  return apiGet(`/orders/${id}`);
}

export async function getOrderLines(orderId) {
  if (config.MOCK.order) {
    return [];
  }
  return apiGet(`/order-lines/order/${orderId}`);
}
