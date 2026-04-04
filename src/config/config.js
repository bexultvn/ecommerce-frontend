export const config = {
  BASE_URL: 'http://localhost:8000/api/v1',
  APP_NAME: 'Shopify',

  // Toggle mock per service: true = localStorage, false = real API
  MOCK: {
    auth:     true,
    user:     true,
    product:  true,
    cart:     true,
    order:    true,
    customer: true,
  }
};
