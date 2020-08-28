<template>
  <div class="nos-specialities">
    <div class="container">
        <div class="d-flex content">
            <div class="banner">
                <h1>Nos spécialités</h1>
                <p>Depuis 2014, Capitools permet de simplifier toutes vos envies de bricolage et jardinage.</p>
            </div>
            <div class="category-list d-flex align-center wrap">
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/energie-menu-icon.png"
                        class="category-icon"
                        />
                        <p>Groupes électrogènes</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/jardin-menu-icon.png"
                        class="category-icon"
                        />
                        <p>Jardin</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/bricolage-menu-icon.png"
                        class="category-icon"
                        />
                        <p>Outillage</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/equipement-maison-icon.png"
                        class="category-icon"
                        />
                        <p>Équipement de la maison</p>
                </a>
                 <a class="d-flex align-center category-item">
                      <SfImage
                        src="/assets/icons/peinture-icon.png"
                        class="category-icon"
                        />
                        <p>Peinture</p>
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