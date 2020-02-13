import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

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
