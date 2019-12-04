<template>
  <div>
    <div v-if="!itemsPerPage || itemsPerPage.length === 0" class="mt50 h5">
      {{
        $t(
          "No reviews have been posted yet. Please don't hesitate to share Your opinion and write the first review!"
        )
      }}
    </div>
    <div
      v-for="(item, index) in itemsPerPage"
      :key="index"
      class="mt50"
      itemprop="review"
      itemscope
      itemtype="http://schema.org/Review"
    >
      <meta itemprop="itemReviewed" :content="productName | htmlDecode" />
      <h4 class="weight-400 m0" itemprop="reviewAspect" :content="item.title">
        {{ item.title }}
      </h4>
      <p class="cl-tertiary mt10 mb20 fs-medium-small">
        {{ item.nickname }}, {{ item.created_at | date }}
      </p>
      <p class="cl-gray lh25" itemprop="reviewBody" :content="item.detail">
        {{ item.detail }}
      </p>
    </div>
    <div v-if="pageCount > 1" class="row middle-xs center-xs mt50">
      <a
        href="#"
        class="mr10 no-underline"
        :class="{ inactive: currentPage === 1 }"
        @click.prevent="prevPage"
      >
        <i class="material-icons">chevron_left</i>
      </a>
      <span
        v-for="pageNumber in pageList"
        :key="pageNumber"
        class="mx10 pagination-page"
      >
        <span
          v-if="pageNumber === currentPage"
          class="fs-medium block py15 px20 bg-cl-mine-shaft cl-white"
        >
          {{ pageNumber }}
        </span>
        <a
          v-else
          href="#"
          class="fs-medium block py15 px20 bg-cl-secondary pointer"
          @click.prevent="changePage(pageNumber)"
        >
          {{ pageNumber }}
        </a>
      </span>
      <a
        href="#"
        class="ml10 no-underline"
        :class="{ inactive: currentPage === pageCount }"
        @click.prevent="nextPage"
      >
        <i class="material-icons">chevron_right</i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    perPage: {
      type: Number,
      required: false,
      default: 4
    },
    items: {
      type: Array,
      default: () => []
    },
    productName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    itemsPerPage() {
      let start = (this.currentPage - 1) * this.perPage;
      let end = start + this.perPage;
      return this.items
        .slice(start, end)
        .filter(review => !!review.review_status);
    },
    pageCount() {
      return (
        Math.floor(this.items.length / this.perPage) +
        Math.min(1, this.items.length % this.perPage)
      );
    },
    pageList() {
      if (
        this.pageCount <= 5 ||
        this.currentPage === 1 ||
        this.currentPage === 2
      ) {
        const pages = [];
        for (let i = 1; i <= Math.min(this.pageCount, 5); i += 1) {
          pages.push(i);
        }
        return pages;
      } else if (
        this.currentPage === this.pageCount ||
        this.currentPage === this.pageCount - 1
      ) {
        const pages = [];
        for (
          let i = this.pageCount;
          i >= 1 && i >= this.pageCount - 4;
          i -= 1
        ) {
          pages.unshift(i);
        }
        return pages;
      } else {
        return [
          this.currentPage - 2,
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          this.currentPage + 2
        ];
      }
    }
  },
  methods: {
    prevPage() {
      this.currentPage = Math.max(1, this.currentPage - 1);
    },
    nextPage() {
      this.currentPage = Math.min(this.pageCount, this.currentPage + 1);
    },
    changePage(pageNumber) {
      this.currentPage = Math.max(1, Math.min(this.pageCount, pageNumber));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$mine-shaft: color(mine-shaft);
$white: color(white);

.inactive {
  opacity: 0.5;
  pointer-events: none;
}
.material-icons {
  font-size: 30px;
  line-height: 30px;
}
.pagination-page {
  a {
    &:hover {
      background-color: $mine-shaft;
      color: $white;
    }
  }
  @media (max-width: 767px) {
    margin: 0;
  }
  a,
  span {
    @media (max-width: 767px) {
      padding: 10px 12px;
      font-size: 16px;
    }
  }
}
</style>
