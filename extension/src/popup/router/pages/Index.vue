<template>
  <div class="steps">
    <div class="steps__header">
      <div>
        <span>⊿Steps</span>
      </div>
      <div>
        <a href="https://steps-882cd.firebaseapp.com/" target="_blank">↗︎</a>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.steps {
  padding: 1rem;
  font-size: 1.5rem;
  &__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
