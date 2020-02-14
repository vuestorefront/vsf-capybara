import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { isServer } from '@vue-storefront/core/helpers';

export * from './price'

export function getPathForStaticPage (path: string) {
  const { storeCode } = currentStoreView()
  const isStoreCodeEquals = storeCode === config.defaultStoreCode

  return isStoreCodeEquals ? `/i${path}` : path
}

export function createSmoothscroll (from = 0, to = 0, speed = 15) {
  let currentDelta = from > to ? from - to : to - from
  let smoothscroll = () => {
    if (Math.abs(currentDelta) < speed) return
    currentDelta = currentDelta - currentDelta / speed
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, from > to ? to + currentDelta : to - currentDelta);
  }
  return smoothscroll()
}

export function checkWebpSupport (bannersToTransform, isWebpSupported) {
  return bannersToTransform.map(banner => {
    if (isServer || isWebpSupported === null) return banner
    return Object.assign({}, banner, { image: isWebpSupported ? banner.image.webp : banner.image.fallback })
  })
}