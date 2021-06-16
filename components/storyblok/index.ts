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

  add('hero', () => import('./Hero.vue'))
  // add('product', () => import('./Product.vue'))
  // add('category', () => import('./Category.vue'))
  add('textarea', () => import('./Textarea.vue'))
  // add('ciLink', () => import('./Link.vue'))
  // Overwrite an existing component
  // add('tile', () => import('./Tile.vue'), { force: true })
}
