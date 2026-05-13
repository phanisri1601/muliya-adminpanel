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
  Addcategories: '/category/addcategories',
  banner: '/header/getbannerlist',
  inventory: '/product/allProduct?lang=1',
  branches: 'branches/getBranches',
  login: 'user/login',
  branchescreate: 'branches/createBranch',
  blog: '/faq/allfaq',
  coupons: '/coupon/GetCoupon',
  customers: '/user/list',
  goldRate: orderListEndpoint('gold-rate'),
  makingCharges: orderListEndpoint('making-charges'),
  careers: orderListEndpoint('careers'),
  goldPlans: orderListEndpoint('goldplans'),
  reports: orderListEndpoint('reports'),
  userRoles: orderListEndpoint('user-roles'),
};

export { orderListEndpoint };
