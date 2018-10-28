<template>
  <div class="steps-card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot name="main"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>


<style lang="scss" scoped>
.steps-card {
  width: 100%;
  height: 100%;
}
</style>
