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

We are currently in the early developer’s preview phase. If you would like to help us improve this beautiful theme we'd be more than happy if you want to contribute! Here you can find all the required information. 
Interested - contact [@psmyrek](https://github.com/psmyrek) on slack

## Installation

-   Install  `lerna`  globally:  `npm install -g lerna`
-   Configure  `vsf-capybara`  repo as a git submodule in theme path of your  `vue-storefront`  workspace and track  `master`  branch:  `git submodule add -b master https://github.com/DivanteLtd/vsf-capybara src/themes/capybara`
-   Fetch all the data:  `git submodule update --init --remote`
-   Update VS configuration by copying  `local.json`  file to root  `config`  directory
-   Update TypeScript compiler option in  `compilerOptions.paths.theme/*`  from default theme  `["src/themes/default/*"]`  to brand new  `capybara`  theme:  `["src/themes/capybara/*"]`
-   Download all dependencies and start dev server:  `lerna bootstrap && yarn dev`

# Coding Standards

## Do

* Follow official style guide https://vuejs.org/v2/style-guide/.
* Use ESLint on before commit hook.
* Use Prettier on before commit hook.
* At least 1 person code review for Pull Requests.
* Always start the implementation of new pages with Storefront UI Pages.
* Use Storefront UI CSS. Do not reinvent the wheel.
* Put components into atoms, molecules, organisms folder based on component ability to compose (check https://bradfrost.com/blog/post/atomic-web-design/).
* Add prefix to component name based on folder name: atoms - `a-`, molecules - `m-`, organisms - `o-`.
* For component root element add class name same as filename, example: `a-some-atom-component.vue` => `class="a-some-atom-component"`

## Do not

* Do not follow Vue Storefront 1 Theme Style Guide. Stick to official Vue.js Style Guide.
* Avoid importing CSS to components.

# Definition of Ready

## User Stories

* User Story format to create Github issues is used - I want to `<goal>` So that `<reason>`. Yes, we skip the persona.
* Milestone / epic is assigned.
* Acceptance criteria are listed.
* User story is small enough to be completed in one sprint.
* Team knows what to do, and do not see any blocking points.

## Bugs

* Current behavior is explained.
* Expected behavior is explained.
* Steps to reproduce are provided.
* Screenshot or gif is provided, if possible.

# Definition of Done

* Branch is merged to master.
* Unit tests are written (if reasonable).
* Passed code review. All suggestions are resolved.
* Code meets our Coding Standards.

# Testing approach

* Unit tests written, if reasonable.
* End-to-end coverage to be discussed at the end of 2019 December.

# Roadmap 2019-12-02

![Roadmap of vsf-capybara](https://github.com/DivanteLtd/vsf-capybara/blob/master/capybara_roadmap_20191202.jpg "Roadmap of vsf-capybara")
