# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 04.01.2020

### Added

### Changed / Improved
- Improved spacing around product carousal on home page(#471)
- Improved navbar layout (#467)
- Improved heading in search panel (#478)
- Fixed broken tiles of mega menu on mobile (#465)
- Improved: Consistency of profile icon (#553)
- Improved: Z-index for dropdowns(#536)
- Improved Error page spacings (#537)
- Improved styling around notification (#540)
- Added active state for the profile in bottom navigation (#541)
- Z-index for sidebar (#501)
- Added safe are in bottom elements (#499)
- Added safe are in bottom elements (#499)
- Used spacer variable for footer icons (#484)
- Improved spacing of elements of product page (#481)
- Removed: Overridden logo height (#490)
- Fixed: duplicate image issue in offine mode (#498)
- Fixed: Blank prices field on checkout in offline mode (#513)

## [1.0.3] - 20.09.2020

### Added

- Preconnect with cdn.jsdelivr.net & fonts.googleapis.com - @Fifciu

### Changed / Improved

- Adjusted the error page (#398)
- Use short description in PDP top section (#393)
- Fixed `isAddToCartDisabled` computed property (#377)
- Update filters bar on category page (#381)
- Use i18n wrapper for the login title (#438)
- Corrected displayed the selected size option on product page (#436)
- Styling around color selector on filters in category page (#443)
- Styling around color filters (#442)
- Carousel time in product carousel (#444)
- Position of logout (#448)
- Fixed Dropdown in adding shipping address (#441)
- Added attribute tab on product page (#386)
- Used sku instead of product_id while preparing order line items product (#415)
- Replaced deprecated action product/list call with findProducts (#417)
- Fix hydration errors with fresh installation (#462)
- Fixed console warning related to  value of key 'Sort by' is not a string (#476)
- Update pwacompat to avoid loading multiple favicons (https://github.com/DivanteLtd/vue-storefront/issues/4559)
- Fixed changing and deleting shipping details on MyAccount (#4499)
- Corrected displayed price when choosing configurable product second time (#493)

## [1.0.2] - 03.07.2020

### Added
### Changed / Improved

- Update sfui version to 0.7.11
- Changed the banner links to correct path (#379)
- Improved the background of MegaMenu (#401)
- fix problem with changing product color - should be changed product image
  fix close sidebar when push esc button
  add cacheTags to pages
  remove Home page mixin - (#410)

## [1.0.1] - 2020.06.02

### Added
### Changed / Improved

- Support theme configuration via CLI (#369)
- Update types for `getBundleOptionsValues` (#371)

## [1.0.0-rc.2] - 2020-05-13

### Added

- Support for Storefront UI v0.7.10 (#360)

### Changed / Improved

- No option to add a new review (#330)
- Size guide is not visible when user switches to PDP from related list (#329)
- Can't install dependencies - yarn error (#351)
- Problem with displaying dropdown list (#328)
- SSR mismatch in bottom navigation (#354)
- Show login modal for my account link in footer (#325)
- Tabs on the product page are not reset properly (#228)
- Add changelog (#345)
- Support discount coupons in mobile view (#361)

## [1.0.0-rc.1] - 2020-04-27

### Added

- Support for Storefront UI v0.7.x (#303)

### Changed / Improved

- Minimal layout for Error page
- Add possibility to disable quicklink (#301)
- Adapting Checkout to Storefront UI v0.7.x (#303)
- Adapting notifications to Storefront UI v0.7.x (#303)
- Adapting modals to Storefront UI v0.7.x (#303)
- Adapting PDP to Storefront UI v0.7.x (#303)
- Adapting search to Storefront UI v0.7.x (#303)
- Adapting cart to Storefront UI v0.7.x (#303)
- Adapting My Account to Storefront UI v0.7.x (#303)
- Adapting static pages to Storefront UI v0.7.x (#303)
- Adapting filters to Storefront UI v0.7.x (303)
- Unnecessary 'more actions' icon in cart in mobile view (#337)
- Focus on the specific step of the checkout (#336)
- 'Empty cart' icon is not displayed (#335)
- Inform about registering for Push Notification (#332)
- Fixed layout for buttons in checkout (#331)
- Disable quicklink by default (#343)
