const Home = () =>
  import(/* webpackChunkName: "vsf-home" */ 'theme/pages/Home');
const ErrorPage = () =>
  import(/* webpackChunkName: "vsf-error" */ 'theme/pages/Error');
const Product = () =>
  import(/* webpackChunkName: "vsf-product" */ 'theme/pages/Product');
const PrintedProduct = () =>
  import(/* webpackChunkName: "vsf-printed-product" */ 'theme/pages/PrintedProduct');
const Typography = () =>
  import(/* webpackChunkName: "vsf-product" */ 'theme/pages/Typography');
const Category = () =>
  import(/* webpackChunkName: "vsf-category" */ 'theme/pages/Category');
const Checkout = () =>
  import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Checkout');
const DetailedCart = () =>
  import(/* webpackChunkName: "vsf-detailed-cart" */ 'theme/pages/DetailedCart');
const MyAccount = () =>
  import(/* webpackChunkName: "vsf-my-account" */ 'theme/pages/MyAccount');
const Static = () =>
  import(/* webpackChunkName: "vsf-static" */ 'theme/pages/Static');

let routes = [
  { name: 'home', path: '/', component: Home, alias: '/pwa.html' },
  { name: 'detailed-cart', path: '/cart', component: DetailedCart },
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
  { name: 'typography-text', path: '/typography-text', component: Typography },
  { name: 'typography-form', path: '/typography-form', component: Typography },
  { name: 'typography-other', path: '/typography-other', component: Typography },
  { name: 'page-not-found', path: '*', component: ErrorPage },
  { name: 'error', path: '/error', component: ErrorPage, meta: { layout: 'minimal' } },
  { name: 'virtual-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'bundle-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'simple-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'downloadable-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'grouped-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'configurable-product', path: '/p/:parentSku/:slug/:childSku', component: Product },
  { name: 'plushToyAccessory-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'petsiesStarProduct-product', path: '/p/:parentSku/:slug', component: Product },
  { name: 'product', path: '/p/:parentSku/:slug/:childSku', component: Product },
  { name: 'category', path: '/c/:slug', component: Category },
  { name: 'cms-page', path: '/i/:slug', component: Static },
  { name: 'printed-product', path: '/printed/p/:parentSku/:slug', component: PrintedProduct }
];

export default routes;
