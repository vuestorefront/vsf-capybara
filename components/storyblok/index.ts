import { add } from 'src/modules/vsf-storyblok-module/components'

export default function registerComponents () {
  add('heading', () => import('./Heading.vue'))
  add('button_item', () => import('./Button.vue'))
  add('buttons', () => import('./Buttons.vue'))
  add('html', () => import('./Html.vue'))
  add('image', () => import('./Image.vue'))
  add('driver', () => import('./Driver.vue'))
  add('homepage_intro_section', () => import('./HomepageIntroSection.vue'))
  add('slider', () => import('./Slider.vue'))
  add('video', () => import('./Video.vue'))
  add('promotion_image_banner', () => import('./PromoCampaignBanner.vue'))
  add('textarea', () => import('./Textarea.vue'))
  add('website_rating', () => import('./WebsiteRating.vue'))
  add('sharing', () => import('./Sharing.vue'))

  // add('product', () => import('./Product.vue'))
  // add('category', () => import('./Category.vue'))
  // add('ciLink', () => import('./Link.vue'))
  // Overwrite an existing component
  // add('tile', () => import('./Tile.vue'), { force: true })
}
