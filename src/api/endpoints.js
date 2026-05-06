function toPascalCase(value) {
  return String(value)
    .trim()
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function orderListEndpoint(moduleId) {
  if (moduleId === 'orders') return '/order/Orderlist';
  return `/order/${toPascalCase(moduleId)}list`;
}

export const endpoints = {
  dashboard: orderListEndpoint('dashboard'),
  orders: orderListEndpoint('orders'),
  categories: '/category/categories',
  branches: orderListEndpoint('branches'),
  banner: orderListEndpoint('banner'),
  inventory: orderListEndpoint('inventory'),
  goldRate: orderListEndpoint('gold-rate'),
  makingCharges: orderListEndpoint('making-charges'),
  invoices: orderListEndpoint('invoices'),
  returnsExchange: orderListEndpoint('returns-exchange'),
  coupons: orderListEndpoint('coupons'),
  employees: orderListEndpoint('employees'),
  customers: orderListEndpoint('customers'),
  reviews: orderListEndpoint('reviews'),
  collections: orderListEndpoint('collections'),
  blog: orderListEndpoint('blog'),
  careers: orderListEndpoint('careers'),
  goldPlans: orderListEndpoint('goldplans'),
  reports: orderListEndpoint('reports'),
  userRoles: orderListEndpoint('user-roles'),
};

export { orderListEndpoint };
