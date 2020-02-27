<template>
  <div class="o-notification">
    <SfNotification
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
      :visible="true"
      :type="notification.type"
      :message="notification.message"
      @click:close="removeNotification(notification.id)"
    >
      <template #action>
        <button
          v-for="action in getActions(notification)"
          :key="action.label"
          class="sf-notification__action"
          @click="executeAction(action.action, notification.id)"
        >
          {{ action.label }}
        </button>
      </template>
    </SfNotification>
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
    getActions ({ action1, action2 }) {
      return [action1, action2].filter(Boolean);
    },
    executeAction (action, id) {
      if (typeof action === 'function') {
        action();
      }
      this.$store.dispatch('notification/removeNotificationById', id);
    },
    removeNotification (id) {
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
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.o-notification {
  position: fixed;
  top: 100px;
  right: 5%;
  z-index: $z-index-notification;
  @include for-mobile {
    top: 0;
    left: 0;
    right: 0;
  }
  @include for-desktop {
    display: flex;
    flex-direction: column;
  }
}
.notification {
  &:not(:first-child) {
    margin-top: 1rem;
  }
  .sf-notification__action {
    margin-left: 1.25rem;
    cursor: pointer;
    &:last-child {
      margin-right: 2.25rem;
    }
  }
}
@include for-desktop {
  .sf-notification {
    max-width: none;
    width: max-content;
    align-self: end;
  }
}
</style>
