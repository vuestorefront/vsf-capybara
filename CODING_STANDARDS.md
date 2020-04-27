# Coding standards & convention

We have decided to create and follow some guidelines and best practices during development of Capybara theme. There are a few core goals that we stick to because we believe they improve our cooperation and readability of source code we've created.

## Atomic Design rules

[Atomic Design](https://atomicdesign.bradfrost.com/) is a methodology for creating user interfaces in structured and hierarchical manner. It is composed of 5 *elements* (or *stages*): atoms, molecules, organisms, templates and pages. Here in Capybara we have slightly adapted Atomic Design rules to our needs and we are using all of them except templates, because we've not found any use case for them. Each of those elements play a key role in designing our interface. In the `/components` folder we created a dedicated sub-folder for atoms, molecules and organisms. Each `.vue` file inside them has a name prefixed by `a-` for atoms, `m-` for molecules and `o-` for organisms. Similarly, the name for every our component follow the same naming convention: it is prefixed by `A` for atoms, `M` for molecules and `O` for organisms. This approach helps us categorize and figure out very fast what kind of component we see in the markup. Pages on the other hand are located in dedicated `/pages` folder. Because they are located in a separate location and they are not used within templates like ordinary components, they do not need to be prefixed.

Another rule is that we add a CSS class to the top-level element in component's template to be able to quickly investigate DOM structure in developer's inspector in the web browser.

Example: in file `/components/atoms/a-promo-code.vue` there is "Promo Code" atom, which is responsible for showing UI for promotion code in checkout. Its name is `APromoCode` and it has `a-promo-code` class in top-level element in the template.

## Coding convention

There is no dedicated ESLint configuration in Capybara repository, because we inherited coding convention rules from Vue Storefront. Capybara theme can only live inside Vue Storefront as a theme, so the decision to re-use exactly the same rules was a natural choice in order to be consistent with main Vue Storefront project.

## Project structure

Project structure is quite simple and typical for Vue ecosystem.

```
/
├───assets
│   ├───banner
│   │   ├───jpg
│   │   ├───png
│   │   └───webp
│   ├───icons
│   ├───ig
│   │   ├───jpg
│   │   └───webp
│   └───newsletter
│       ├───png
│       └───webp
├───components
│   ├───atoms
│   ├───molecules
│   │   └───modals
│   ├───organisms
│   └───theme
│       └───directives
├───config
├───css
│   ├───base
│   ├───helpers
│   │   ├───functions
│   │   └───mixins
│   ├───variables
│   └───vendor
├───helpers
├───layouts
├───pages
├───resource
│   └───i18n
├───router
├───service-worker
├───store
│   ├───cart
│   │   ├───helpers
│   │   └───types
│   └───ui
└───templates
```

We have `/assets` folder which contains static resources like banners or icons. In addition to standard formats like JPG or PNG, we have also prepared images in WEBP format to speed up loading time in modern browsers even more. The already described `/components` folder contains our components created with Atomic Design rules in mind. The `/config` folder allows us to configure Vue Storefront modules (de)activation - for example the Wishlist module is currently deactivated in Capybara theme. Next, `/css` folder contains some custom and main CSS rules for whole theme. In `/helpers` folder we add general-purpose utility functions to reduce code duplication. In `/layouts` we currently have only one theme layout - the default one. The already described `/pages` folder contain the main building blocks for the whole theme - page implementations. In `/resource` we put translations and other easily customized configurations like links to images from `/assets` folder which are used on Homepage. The `/router` folder contains theme routes and `/store` is our store.  :smirk:

# Component customization

Capybara is an implementation of [Storefront UI](https://www.storefrontui.io/) library, which helped us create a real, unique and beautiful theme. Storefront UI library is an excellent choice for this purpose, because it is focused on code modularity, reusability and usability. It is all about customization-, mobile- and performance-first approaches. [The documentation](https://docs.storefrontui.io/customization.html) describes how Storefront UI components can be customized, based on `props` and `slots` to replace almost any part of default component's code.

:boom:  **The Capybara theme is an example of how easy it is to build brand new theme for Vue Storefront!**  :boom: