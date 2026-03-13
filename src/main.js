import './style.css';
import { initRouter } from './core/router.js';
import { renderNavbar } from './components/navbar.js';
import { seedStorage, lsSet } from './storage/localStorage.js';
import { mockProducts, mockUsers, mockOrders } from './storage/mockData.js';

// Always refresh products to pick up model changes; seed others only once
lsSet('products', mockProducts);
seedStorage('users', mockUsers);
seedStorage('orders', mockOrders);

renderNavbar();
initRouter();
