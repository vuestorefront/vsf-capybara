const Home = () =>
  import(/* webpackChunkName: "vsf-home" */ 'theme/pages/Home');
const ErrorPage = () =>
  import(/* webpackChunkName: "vsf-error" */ 'theme/pages/Error');
const Product = () =>
  import(/* webpackChunkName: "vsf-product" */ 'theme/pages/Product');
const Category = () =>
  import(/* webpackChunkName: "vsf-category" */ 'theme/pages/Category');
const Checkout = () =>
  import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Checkout');
const MyAccount = () =>
  import(/* webpackChunkName: "vsf-my-account" */ 'theme/pages/MyAccount');
const Static = () =>
  import(/* webpackChunkName: "vsf-static" */ 'theme/pages/Static');

let routes = [
  { name: 'home', path: '/', component: Home, alias: '/pwa.html' },
  { name: 'checkout', path: '/checkout', component: Checkout },
  { name: 'legal', path: '/legal', component: Static },
  { name: 'privacy', path: '/privacy', component: Static },
  { name: 'my-account', path: '/my-account', component: MyAccount },
  { name: 'about-us', path: '/about-us', component: Static },
  { name: 'customer-service', path: '/customer-service', component: Static },
  { name: 'store-locator', path: '/store-locator', component: Static },
  { name: 'size-guide', path: '/size-guide', component: Static },
  { name: 'delivery', path: '/delivery', component: Static },
  { name: 'returns', path: '/returns', component: Static },
  { name: 'contact', path: '/contact', component: Static },
  { name: 'page-not-found', path: '*', component: ErrorPage },
  { name: 'error', path: '/error', component: ErrorPage, meta: { layout: 'minimal' } },
  { name: 'virtual-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'bundle-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'simple-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'downloadable-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'grouped-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'configurable-product', path: '/p/:parentSku/:slug/:childSku', component: Product },
  { name: 'product', path: '/p/:parentSku/:slug/:childSku', component: Product },
  { name: 'category', path: '/c/:slug', component: Category },
  { name: 'cms-page', path: '/i/:slug', component: Static }
];

export default routes;
