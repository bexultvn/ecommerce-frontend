import './style.css';
import { initRouter } from './core/router.js';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { seedStorage, lsSet } from './storage/localStorage.js';
import { mockProducts, mockUsers, mockOrders } from './storage/mockData.js';

lsSet('products', mockProducts);
seedStorage('users', mockUsers);
seedStorage('orders', mockOrders);

renderNavbar();
renderFooter();
initRouter();
