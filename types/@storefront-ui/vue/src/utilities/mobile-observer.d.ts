declare module '@storefront-ui/vue/src/utilities/mobile-observer' {
  export const mapMobileObserver: () => {
    isMobile: () => boolean,
    mobileObserverClients: () => number,
    mobileObserverIsInitialized: () => boolean
  };

  export const unMapMobileObserver: () => void;
}
