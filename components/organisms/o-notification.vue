<template>
  <div class="o-notification fixed">
    <SfNotification
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
      :visible="true"
      :type="notification.type"
      :message="notification.message"
      :action="prepareActionLabel(notification)"
      @click:action="executeAction(notification)"
      @click:close="removeNotification(notification)"
    />
  </div>
</template>

<script>
import { Notification } from '@vue-storefront/core/modules/notification/components/Notification';
import { SfNotification } from '@storefront-ui/vue';

export default {
  name: 'ONotification',
  mixins: [Notification],
  components: { SfNotification },
  methods: {
    getAction ({ action1, action2 }) {
      // Get first non-standard action or the first one, if there is only one action
      return action1.label !== this.$t('OK')
        ? action1
        : action2 || action1;
    },
    prepareActionLabel (notification) {
      return this.getAction(notification).label;
    },
    executeAction (notification) {
      const action = this.getAction(notification).action;
      if (typeof action === 'function') {
        action();
      }
      this.$store.dispatch('notification/removeNotificationById', notification.id);
    },
    removeNotification ({ id }) {
      this.$store.dispatch('notification/removeNotificationById', id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@import "~theme/css/base/global_vars";
$z-index-notification: map-get($z-index, notification);

@mixin for-mobile {
  @media screen and (max-width: $desktop-min) {
    @content;
  }
}

.o-notification {
  top: 100px;
  right: 5%;
  z-index: $z-index-notification;
  @include for-mobile {
    top: 0;
    left: 0;
    right: 0;
  }
}
.notification {
  &:not(:first-child) {
    margin-top: 1rem;
  }
  ::v-deep .sf-notification__action {
    margin: 0 2.25rem 0 1.25rem;
    cursor: pointer;
  }
}
</style>
