<img src="https://blog.vuestorefront.io/wp-content/uploads/2020/02/CAPYBARA.png"></img>

# Capybara - Storefront UI based theme for Vue Storefront

New default template theme for [Vue Storefront](https://github.com/DivanteLtd/vue-storefront), based on [Storefront UI](https://storefrontui.io/). 90% of the Capybara code is closed in the [Storefront UI library](https://github.com/DivanteLtd/storefront-ui). Thanks to it, Capybara can maintain its flexibility, but minimize the risk of errors.

 **🔨  Current status: Developer's preview**

## ✨  Features

Capybara theme provides out of the box ready to use elements, like Cart, Checkout, Modals or Product-related components - to name only a few of them, which all are based on awesome Storefront UI. It provides new look & feel for the Vue Storefront with simpler development experience. You can just grab it and use it, or you can play around to re-design existing components and build something new easily.

If you're new and need some guidance feel free to visit out [forum](https://forum.vuestorefront.io/) or reach anyone from the core team on our slack:
- Tomasz Kikowski - [@qiqqq](https://github.com/qiqqq)
- Tomasz Kostuch - [@gibkigonzo](https://github.com/gibkigonzo)
- Paweł Smyrek - [@psmyrek](https://github.com/psmyrek)
- Rafał Makara - [@rmakara](https://github.com/rmakara)

## 🤝  Contributing

We are currently in the early developer’s preview phase. If you would like to help us improve this beautiful theme we'd be more than happy if you want to contribute! [Here](https://github.com/DivanteLtd/vsf-capybara/blob/master/CONTRIBUTING.md) you can find all the required information how to start.

## Installation
To be able to use new Capybara theme in your Vue Storefront installation, you need to:

1. Install `lerna` globally:
   ```
   npm install -g lerna
   ```
   or
   ```
   yarn global add lerna
   ```
1. Configure `vsf-capybara` repository as a git submodule in theme path of your Vue Storefront workspace, and then track `master` branch:
   ```
   git submodule add -b master https://github.com/DivanteLtd/vsf-capybara src/themes/capybara
   ```
1. Fetch all the data:
   ```
   git submodule update --init --remote
   ```
1. Update Vue Storefront configuration by copying `local.json` file from `vsf-capybara` to root `config` directory.
1. Update TypeScript compiler option in `tsconfig.json` in root directory: change value for `compilerOptions`**.**`paths`**.**`theme/*` from default theme `["src/themes/default/*"]` to brand new Capybara theme: `["src/themes/capybara/*"]`.
1. Download all dependencies and start development server:
   ```
   lerna bootstrap && yarn dev
   ```
1. That’s all! Now after opening your development server (http://localhost:3000 by default) you should see Vue Storefront with Capybara theme!  🎉
