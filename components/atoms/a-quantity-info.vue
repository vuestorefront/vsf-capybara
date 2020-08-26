<template>
    <div class="quantity-info">
        <div class="d-flex align-center"> 
             <SfImage
                src="/assets/icons/3x-icon.png"
                :alt="$t(defaultTitle)"
                class="icon"
                />
             <p>Paiement en 3x par CB Details</p>
        </div>
        <div class="d-flex align-center"> 
             <SfImage
                src="/assets/icons/livraisonGratuite-Icon.png"
                :alt="$t(defaultTitle)"
                class="icon"
                />
             <p>Livraison gratuite</p>
        </div>
        <div class="d-flex align-center"> 
             <SfImage
                src="/assets/icons/calendar-icon.png"
                :alt="$t(defaultTitle)"
                class="icon"
                />
             <p>Livraison sous 10 jours</p>
        </div>
    </div>
</template>

<script>
    import { SfImage } from '@storefront-ui/vue';
    export default {
        name: 'AQuantityInfo',
        components: { SfImage },
    };
</script>

<style lang="scss" scoped>
    .quantity-info{
        padding-bottom: 7px;
        margin: 7px 0;
        border-bottom: 1px solid var(--c-light);
        .d-flex{
            margin-bottom: 7px; 
        }
        .sf-image{
            width: 21px;
            height: 21px;
            object-fit:contain;
            margin-right: 10px;
        }
        p{
            font-size: 12px;
            margin: 0;
        }
    }
</style>