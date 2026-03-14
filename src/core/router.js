import { isLoggedIn } from './auth.js';

const PROTECTED_ROUTES = ['/cart', '/orders', '/profile', '/checkout'];

const routes = {
  '': () => import('../pages-js/home.js'),
  '/': () => import('../pages-js/home.js'),
  '/login': () => import('../pages-js/login.js'),
  '/products': () => import('../pages-js/products.js'),
  '/product': () => import('../pages-js/productDetail.js'),
  '/cart': () => import('../pages-js/cart.js'),
  '/orders': () => import('../pages-js/orders.js'),
  '/profile': () => import('../pages-js/profile.js'),
  '/checkout': () => import('../pages-js/checkout.js'),
};

function parseHash() {
  const hash = window.location.hash.slice(1) || '/';
  const [pathWithQuery, ...rest] = hash.split('?');
  const queryString = rest.join('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return { path: pathWithQuery, params };
}

function matchRoute(path) {
  if (routes[path]) return { loader: routes[path], routeParams: {} };
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'product') {
    return { loader: routes['/product'], routeParams: { id: segments[1] } };
  }
  return { loader: routes['/'], routeParams: {} };
}

async function handleRoute() {
  const app = document.getElementById('app');
  const { path, params } = parseHash();
  const basePath = '/' + (path.split('/').filter(Boolean)[0] || '');
  if (PROTECTED_ROUTES.includes(basePath) && !isLoggedIn()) {
    window.location.hash = '/login';
    return;
  }
  const { loader, routeParams } = matchRoute(path);
  try {
    const module = await loader();
    const { template, init } = module;
    app.innerHTML = template;
    if (typeof init === 'function') await init({ ...routeParams, ...params });
  } catch (err) {
    console.error('Router error:', err);
    app.innerHTML = `<div class="p-8 text-center text-red-600">Page failed to load. <a href="#/" class="underline">Go home</a></div>`;
  }
  window.scrollTo(0, 0);
}

export function navigate(path) {
  window.location.hash = path;
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
