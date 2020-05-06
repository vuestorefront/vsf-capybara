<template>
  <div class="o-notification">
    <SfNotification
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
      :visible="true"
      :type="getType(notification)"
      :message="notification.message | htmlDecode"
    >
      <template #action>
        <SfButton
          v-for="action in getActions(notification)"
          :key="action.label"
          class="sf-button--pure sf-notification__action"
          @click="executeAction(action.action, notification.id)"
        >
          {{ action.label }}
        </SfButton>
      </template>
      <template #close>
        <SfIcon
          class="sf-notification__close"
          icon="cross"
          color="white"
          @click="removeNotification(notification.id)"
        />
      </template>
    </SfNotification>
  </div>
</template>

<script>
import { Notification } from '@vue-storefront/core/modules/notification/components/Notification';
import { SfNotification, SfIcon, SfButton } from '@storefront-ui/vue';

export default {
  name: 'ONotification',
  mixins: [Notification],
  components: { SfNotification, SfIcon, SfButton },
  methods: {
    getType ({ type }) {
      return ['secondary', 'info', 'success', 'warning', 'danger'].includes(type) ? type : 'danger';
    },
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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-notification {
  position: fixed;
  top: 100px;
  right: 5%;
  z-index: 1000;
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
    cursor: pointer;
    margin: 0.3rem 1rem 0 0;
  }
  @include for-desktop {
    max-width: 32rem;
    align-self: end;
    .sf-notification__close {
      position: relative;
      margin-left: var(--spacer-lg);
    }
  }
}
</style>
