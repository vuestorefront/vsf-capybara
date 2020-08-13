<template>
  <SfSearchBar
    :class="customClass"
    :placeholder="placeholder"
    aria-label="Search"
    v-model="value"
  />
</template>
<script>
import { SfSearchBar } from "@storefront-ui/vue";
export default {
  components: {
    SfSearchBar,
  },
  data() {
    return {
      value: "",
      placeholder: "Search for items",
      class: "header-search",
    };
  },
};
</script>

<style  lang="scss" scoped>
   .sf-search-bar {
        --search-bar-width: 44rem;
        margin: 0 var(--spacer-xl);
        border: 2px solid var(--_c-gray-accent);
        height: 50px;
        .sf-search-bar__icon{
           
        }
    }  
     .sf-icon{
        --icon-size: 1.5rem;
      }
    .sf-search-bar__input{
      border-radius: 3px;      
      border-width: var(--search-bar-border-width, 2px 2px 2px 2px);
      text-indent: 15px;
    }

</style>