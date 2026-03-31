import './style.css';
import { initRouter } from './core/router.js';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { seedStorage, lsSet } from './storage/localStorage.js';
import { mockProducts, mockUsers, mockOrders } from './storage/mockData.js';
import { config } from './config/config.js';

lsSet('products', mockProducts);
seedStorage('orders', mockOrders);
if (config.USE_MOCK) {
  seedStorage('users', mockUsers);
}

renderNavbar();
renderFooter();
initRouter();
