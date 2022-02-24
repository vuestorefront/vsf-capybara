<template>
  <div class="page-typography">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    >
      <template #link="{breadcrumb}">
        <router-link :to="localizedRoute(breadcrumb.route.link)" class="sf-breadcrumbs__breadcrumb">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <SfContentPages
      :active="currentRoute.title"
      :title="currentRoute.title"
      @click:change="updateRoute"
    >
      <SfContentPage :title="navigation[0].title">
        <SfHeading title="Store Front Heading" subtitle="with default level" />
        <SfHeading :level="1" title="SfHeading H1" subtitle="and subtitle" />
        <p> Default text </p>
        <SfHeading :level="2" title="SfHeading H2" subtitle="and subtitle" />
        <p> Default text </p>
        <SfHeading :level="3" title="SfHeading H3" subtitle="and subtitle" />
        <p> Default text </p>
        <SfHeading :level="4" title="SfHeading H4" subtitle="and subtitle" />
        <p> Default text </p>
        <SfHeading :level="5" title="SfHeading H5" subtitle="and subtitle" />
        <p> Default text </p>
        <SfHeading :level="6" title="SfHeading H6" subtitle="and subtitle" />
        <p> Default text </p>

        <h1>Heading H1</h1>
        <h2>Heading H2</h2>
        <h3>Heading H3</h3>
        <h4>Heading H4</h4>
        <h5>Heading H5</h5>
        <h6>Heading H6</h6>
        <p>Lorem ipsum dolor sit amet, <i>consectetur adipiscing elit.</i> <b>Ut laoreet elementum elit ac mollis.</b> <u>Praesent</u> luctus libero augue. In sit amet vestibulum elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin hendrerit, tellus quis mollis venenatis, tellus mauris imperdiet libero, <a href="/">some link example.</a></p>
        <SfDivider />
        <h4>Icons</h4>
        <div>Small mail icon <SfIcon icon="mail" size="sm" /></div>
        <div>Medium mail icon <SfIcon icon="mail" size="md" /></div>
        <div>Large mail icon <SfIcon icon="mail" size="lg" /></div>
        <SfDivider />
        <h4>Lists</h4>
        <SfList class="-with-markers">
          <SfListItem>Marked list component</SfListItem>
          <SfListItem>Lorem ipsum</SfListItem>
          <SfListItem>Dolor sit amet</SfListItem>
        </SfList>
        <br>
        <ul>
          <li>Marked list</li>
          <li>Lorem ipsum</li>
          <li>Dolor sit amet</li>
        </ul>
        <br>
        <ol>
          <li>Numered list</li>
          <li>Lorem ipsum</li>
          <li>Dolor sit amet</li>
        </ol>
        <SfDivider />
        <h4>Images</h4>
        <SfImage src="/assets/banner/webp/bannerE.webp" height="200" width="150" />
        <SfImage src="/assets/banner/webp/bannerE.webp" height="150" width="150" />
        <SfImage src="/assets/banner/webp/bannerE.webp" height="100" width="150" />
      </SfContentPage>

      <SfContentPage :title="navigation[1].title">
        <h4>Form elements</h4>
        <form>
          <SfInput v-model="email" name="email" type="email" label="Your email" :required="true" :valid="true" />
          <SfInput v-model="firstname" name="firstname" label="Your Firstname" :required="true" :valid="false" error-message="Field is required." />
          <SfInput name="name" label="Disabled Field" :required="true" :valid="true" disabled />
          <br>
          <div class="_typography-form-checkbox-container">
            <SfCheckbox
              v-model="options"
              name="options"
              label="enabled checkbox"
              value="value1"
              required="required"
              :valid="true"
            />
            <SfCheckbox
              v-model="options"
              name="options"
              label="disabled checkbox"
              value="value2"
              required="required"
              disabled
              :valid="true"
            />
          </div>
          <br>
          <SfSelect
            v-model="select"
            label="Select element"
            :size="4"
            :required="true"
            style="max-width: 30rem"
          >
            <SfSelectOption value="amaranth">
              amaranth
            </SfSelectOption>
            <SfSelectOption value="amber">
              amber
            </SfSelectOption>
            <SfSelectOption value="arctic-lime">
              arctic-lime
            </SfSelectOption>
            <SfSelectOption value="bluetiful">
              bluetiful
            </SfSelectOption>
          </SfSelect>
          <div>
            <SfRadio
              label="Radio Label"
              value="radio1"
              v-model="radio"
            >
              <template #description>
                Description
              </template>
            </SfRadio>
            <SfRadio
              label="Radio Label"
              value="radio2"
              v-model="radio"
            >
              <template #description>
                Description
              </template>
            </SfRadio>
          </div>
          <br>
          <div class="_typography-form-dropdown-container">
            <SfButton @click.stop.prevent="isOpen = true">
              Choose your action
            </SfButton>
            <SfDropdown :is-open="isOpen" title="Available Items" @click:close="isOpen = false">
              <SfList>
                <SfListItem>
                  <a>First action</a>
                </SfListItem>
                <SfListItem>
                  <a>Second action</a>
                </SfListItem>
                <SfListItem>
                  <a>Third action</a>
                </SfListItem>
              </SfList>
            </SfDropdown>
          </div>
          <br>
          <br>
          <SfButton class="_typography-form-button color-primary">
            Primary
          </SfButton>
          <SfButton class="_typography-form-button color-secondary">
            Secondary
          </SfButton>
          <SfButton class="_typography-form-button color-success">
            Success
          </SfButton>
          <SfButton class="_typography-form-button color-warning">
            Warning
          </SfButton>
          <SfButton class="_typography-form-button color-info">
            Info
          </SfButton>
          <SfButton class="_typography-form-button color-danger">
            Danger
          </SfButton>
          <SfButton class="_typography-form-button" disabled>
            Disabled
          </SfButton>
        </form>
      </SfContentPage>

      <SfContentPage :title="navigation[2].title">
        <h4>Table</h4>
        <SfTable>
          <SfTableHeading><SfTableHeader>Column</SfTableHeader><SfTableHeader>Column</SfTableHeader><SfTableHeader>Column</SfTableHeader></SfTableHeading>
          <SfTableRow><SfTableData>Cell</SfTableData><SfTableData>Cell</SfTableData><SfTableData>Cell</SfTableData></SfTableRow>
          <SfTableRow><SfTableData>Cell</SfTableData><SfTableData>Cell</SfTableData><SfTableData>Cell</SfTableData></SfTableRow>
        </SfTable>
        <h4>Notifications</h4>
        <SfNotification :visible="true" title="Notification title" message="You are offline. Some features might not be available." type="info" action="Click" />
        <br>
        <SfNotification :visible="true" title="Notification title" message="You are offline. Some features might not be available." type="success" action="Click" />
        <br>
        <SfNotification :visible="true" title="Notification title" message="You are offline. Some features might not be available." type="warning" action="Click" />
        <br>
        <SfNotification :visible="true" title="Notification title" message="You are offline. Some features might not be available." type="danger" action="Click" />
        <h4>Gallery</h4>
        <SfGallery :images="images" />
      </SfContentPage>
    </SfContentPages>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import {
  SfBreadcrumbs,
  SfContentPages,
  SfHeading,
  SfIcon,
  SfDivider,
  SfTable,
  SfNotification,
  SfList,
  SfImage,
  SfGallery,
  SfInput,
  SfButton,
  SfCheckbox,
  SfDropdown,
  SfSelect,
  SfRadio

} from '@storefront-ui/vue';

export default {
  name: 'Typography',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    SfHeading,
    SfIcon,
    SfDivider,
    SfTable,
    SfNotification,
    SfList,
    SfImage,
    SfGallery,
    SfInput,
    SfButton,
    SfCheckbox,
    SfDropdown,
    SfSelect,
    SfRadio
  },
  metaInfo () {
    return {
      title: this.currentRoute.title,
      meta: []
    }
  },
  data () {
    return {
      navigation: [
        { title: i18n.t('Text components'), link: '/typography-text' },
        { title: i18n.t('Form components'), link: '/typography-form' },
        { title: i18n.t('Other components'), link: '/typography-other' }
      ],
      email: '',
      firstname: '',
      options: ['value1'],
      radio: '',
      select: '',
      isOpen: false
    };
  },
  computed: {
    ...mapGetters({
      defaultContent: 'defaultContent/getDefaultContent'
    }),
    images () {
      return [
        {
          alt: 'Product A',
          mobile: { url: '/assets/banner/webp/bannerF.webp' },
          desktop: { url: '/assets/banner/webp/bannerF.webp' },
          zoom: { url: '/assets/banner/webp/bannerF.webp' }
        },
        {
          alt: 'Product B',
          mobile: { url: '/assets/banner/webp/bannerE.webp' },
          desktop: { url: '/assets/banner/webp/bannerE.webp' },
          zoom: { url: '/assets/banner/webp/bannerE.webp' }
        },
        {
          alt: 'Product C',
          mobile: { url: '/assets/banner/webp/bannerC.webp' },
          desktop: { url: '/assets/banner/webp/bannerC.webp' },
          zoom: { url: '/assets/banner/webp/bannerC.webp' }
        },
        {
          alt: 'Product D',
          mobile: { url: '/assets/banner/webp/bannerG.webp' },
          desktop: { url: '/assets/banner/webp/bannerG.webp' },
          zoom: { url: '/assets/banner/webp/bannerG.webp' }
        }
      ]
    },
    breadcrumbs () {
      return [
        { text: i18n.t('Homepage'), route: { link: this.localizedRoute('/') } },
        { text: this.currentRoute.title }
      ];
    },
    currentRoute () {
      return {
        ...this.navigation.find(navigation => this.localizedRoute(navigation.link) === this.$route.path)
      };
    }
  },
  methods: {
    updateRoute (title) {
      /**
       * On mobile view clicking the "back" icon in SfContentPages emits click:change
       * event but without an argument. Unfortunately the same event is also used for
       * "normal" page changes so it has to be checked explicitly if it comes from "back"
       * icon or not. Currently this is the only way to do that.
       */
      if (title === undefined) {
        // "Back" icon was clicked in SfContentPages
        this.$router.back();
      } else {
        // "Normal" navigation to next page - if it exists
        const nextRoute = this.navigation.find(navigation => navigation.title === title);
        if (nextRoute) {
          this.$router.push(nextRoute.link);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.page-typography {
  box-sizing: border-box;

  ._typography-form-button {
    display: inline-block;
    margin-right: 1em;
    margin-top: 0.5em;
  }

  ._typography-form-checkbox-container {
    display: flex;

    .sf-checkbox {
      margin-right: 1em;
    }
  }

  ._typography-form-dropdown-container {
    position: relative;
    display: inline-block;

    .sf-list__item {
      padding: var(--spacer-sm);
    }
  }

  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }

  --content-pages-height: auto;

  ::v-deep {
    .sf-content-pages__content,
    .sf-content-pages__sidebar {
      height: min-content;
    }
  }
}

.breadcrumbs {
    margin: var(--spacer-base) auto var(--spacer-lg);
  }
</style>
