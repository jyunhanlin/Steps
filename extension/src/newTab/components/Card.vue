<template>
  <div class="card">
    <header class="card__header">
      <slot name="header"></slot>
    </header>
    <!-- <div class="card__hr" v-if="$slots.header"></div> -->
    <main class="card__main">
      <slot name="main"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Card',
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.1);
  border-radius: .8rem .8rem 0 0;
  padding: 2rem 3rem;

  &__header {
    font-size: 1.8rem;
  }

  &__hr {
    display: block;
    border: .5px solid rgb(196, 196, 196);
    margin-top: .5rem;
    margin-bottom: 1rem;
  }
}
</style>
