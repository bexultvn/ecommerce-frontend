import './style.css';
import { initRouter } from './core/router.js';
import { renderNavbar } from './components/navbar.js';
import { seedStorage } from './storage/localStorage.js';
import { mockProducts, mockUsers, mockOrders } from './storage/mockData.js';

// Seed mock data on first load
seedStorage('products', mockProducts);
seedStorage('users', mockUsers);
seedStorage('orders', mockOrders);

renderNavbar();
initRouter();
