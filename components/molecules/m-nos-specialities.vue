<template>
  <div class="nos-specialities">
    <div class="container">
        <div class="d-flex content">
            <div class="banner">
                <h1>Our specialties</h1>
                <p>Since 2014, Capitools has made it possible to simplify all your DIY and gardening desires.</p>
            </div>
            <div class="category-list d-flex align-center wrap">
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/energie-menu-icon.png"
                        class="category-icon"
                        />
                        <p>Generators</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/jardin-menu-icon.png"
                        class="category-icon"
                        />
                        <p>Garden</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/bricolage-menu-icon.png"
                        class="category-icon"
                        />
                        <p>Tools</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/equipement-maison-icon.png"
                        class="category-icon"
                        />
                        <p>House equipment</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/peinture-icon.png"
                        class="category-icon"
                        />
                        <p>Painting</p>
                </a>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';
export default { components: { SfImage } };
</script>