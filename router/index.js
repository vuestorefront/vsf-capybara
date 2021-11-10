const Home = () =>
  import(/* webpackChunkName: "vsf-home" */ 'theme/pages/Home');
const ErrorPage = () =>
  import(/* webpackChunkName: "vsf-error" */ 'theme/pages/Error');
const Product = () =>
  import(/* webpackChunkName: "vsf-product" */ 'theme/pages/Product');
const ForeversProduct = () =>
  import(/* webpackChunkName: "vsf-forevers-product" */ 'theme/pages/ForeversProduct');
const PrintedProduct = () =>
  import(/* webpackChunkName: "vsf-printed-product" */ 'theme/pages/PrintedProduct');
const PillowProduct = () =>
  import(/* webpackChunkName: "vsf-pillow-product" */ 'theme/pages/PillowProduct');
const PhrasePillowProduct = () =>
  import(/* webpackChunkName: "vsf-phrase-pillow-product" */ 'theme/pages/PhrasePillowProduct');
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
const GiftCards = () =>
  import(/* webpackChunkName: "vsf-gift-cards" */ 'theme/pages/GiftCards');

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
  { name: 'forevers-create', path: '/forevers/create', component: ForeversProduct },
  { name: 'printed-product', path: '/printed/p/:parentSku/:slug', component: PrintedProduct },
  { name: 'pillow-product', path: '/pillows/create', component: PillowProduct },
  {
    name: 'photo-pillows-alias-1',
    path: '/photo-pillow/designs/',
    redirect: {
      name: 'category',
      params: {
        slug: 'custom-photo-pillows-80'
      }
    }
  },
  {
    name: 'photo-pillows-alias-2',
    path: '/photo-pillows',
    redirect: {
      name: 'category',
      params: {
        slug: 'custom-photo-pillows-80'
      }
    }
  },
  { name: 'pillowSideDesign-product', path: '/phrase-pillow/p/:parentSku/:slug/', component: PhrasePillowProduct },
  { name: 'gift-cards', path: '/giftcards', component: GiftCards }
];

export default routes;
