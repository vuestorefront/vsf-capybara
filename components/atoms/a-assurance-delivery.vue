<template>
    <div class="d-flex align-center">
        <SfImage
        src="/assets/icons/delivery-icon.png"
        class="image_delivery"
        />
        <div class="text-center">
            <h6>Livraison gratuite</h6>
            <p>À partir de 99 euros d’achat</p>
        </div>
    </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';
export default { components: { SfImage } };
</script>