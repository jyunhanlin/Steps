<template>
  <div>
    <transition
      name="fade"
      appear
      appear-class="fade"
      @after-leave="afterLeave">
      <div
        v-if="show"
        class="notification"
        :class="{ 'notification--success': success, 'notification--error': error}"
        @click="close">
        {{message}}
      </div>
    </transition>
    <div v-if="show" class="backdrop" @click="close"></div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      default: '通知一下',
    },
    duration: {
      type: Number,
      default: 0,
    },
    success: {
      type: Boolean,
      default: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => this.close(), this.duration);
    }
  },
  destroyed() {
    this.$el.remove();
  },
  methods: {
    close() {
      clearTimeout(this.timer);
      this.show = false;
    },
    afterLeave() {
      this.$destroy();
    },
  },
};
</script>


<style lang="scss" scoped>
.notification {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 50px -5px rgba(115,115,115,1);
  padding: .5rem;
  width: 12rem;
  min-height: 3rem;
  z-index: 100;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  &--success {
    background-color: #00b6a6;
  }

  &--error {
    background-color: #fd8f8e;
  }
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 90;
}
</style>

