<template>
    <div class="d-flex align-center">
        <SfImage
        src="/assets/icons/delivery-icon.png"
        class="image_delivery"
        />
        <div class="text-center">
            <h6>Free delivery</h6>
            <p>From 99 euros of purchase</p>
        </div>
    </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';
export default { components: { SfImage } };
</script>