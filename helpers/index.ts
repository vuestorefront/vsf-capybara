import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { productThumbnailPath, getThumbnailPath, isServer } from '@vue-storefront/core/helpers'
import { htmlDecode } from '@vue-storefront/core/filters'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { getProductPrice } from './price'

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
  // In SSR it is not easily known whether webp image is supported by web browser or not.
  // Empty string also cannot be used here, because empty string evaluates to url('')
  // and it is resolved as the base URL (the same as our Homepage), so as a consequence
  // Homepage was requested again.
  // To fix that case, dummy empty data URI is provided just to prevent any unnecessary
  // requests.
  // --- see https://github.com/DivanteLtd/vsf-capybara/issues/168
  const theSmallestDummyImage = 'data:,'
  return bannersToTransform.map(banner => Object.assign(
    {},
    banner,
    { image: isServer ? theSmallestDummyImage : isWebpSupported ? banner.image.webp : banner.image.fallback }
  ))
}

export function getTopLevelCategories (categoryList) {
  // Display only the root level (level = 1 => Default Category), categoriesDynamicPrefetchLevel = 2 by default
  const categoryLevel = config.entities.category.categoriesDynamicPrefetchLevel >= 0
    ? config.entities.category.categoriesDynamicPrefetchLevel
    : 2

  return categoryList.filter(
    category => category.level === categoryLevel && category.is_active && category.children_count > 0
  )
}

export function prepareCategoryProduct (product) {
  return {
    id: product.id,
    title: htmlDecode(product.name),
    image: getThumbnailPath(
      productThumbnailPath(product),
      config.products.thumbnails.width,
      config.products.thumbnails.height
    ),
    link: formatProductLink(product, currentStoreView().storeCode),
    price: getProductPrice(product),
    rating: {
      max: 5,
      score: 5
    }
  }
}

export function prepareCategoryMenuItem (category) {
  if (!category) return;

  return {
    id: category.id,
    name: category.name,
    link: formatCategoryLink(category),
    count: category.product_count || '',
    position: category.position,
    path: category.path
  };
}

const formatChildrenData = children_data => {
  let tempArray = [];
  children_data.map(value => {
    tempArray.push({ id: value.id });
    if (value.children_data) {
      value.children_data.map(subChildren => {
        tempArray.push({ id: subChildren.id });
      })
    }
  })
  tempArray = tempArray.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
  return tempArray;
}

export const formatFiltersOptions = (categories, products) => {
  if (!categories || !products) return;
  const resp = products.map(value => value.category_ids).flat();
  const firstBase = categories.filter(category => resp.some(o2 => category.id === o2)).map(value => {
    return {
      ...prepareCategoryMenuItem(value),
      parent_id: value.parent_id
    }
  })
  const secondBase = categories.filter(category => firstBase.some(o2 => category.id === o2.parent_id)).map(value => {
    const subCategory = firstBase.filter(sb => sb.parent_id === value.id);
    return {
      ...prepareCategoryMenuItem(value),
      items: subCategory,
      parent_id: value.parent_id,
      children_data: !!value.children_data && value.children_data
    }
  })
  const thirdBase = categories.filter(category => secondBase.some(o2 => category.id === o2.parent_id)).map(value => {
    const subCategory = secondBase.filter(sb => sb.parent_id === value.id);
    return {
      ...prepareCategoryMenuItem(value),
      items: subCategory,
      children_data: !!value.children_data && formatChildrenData(value.children_data)
    }
  })
  return thirdBase;
}
