<template>
  <div>
    <div class="modal">
      <slot></slot>
      <footer class="about__footer">
        <button class="about__btn" @click="$emit('close')">關閉</button>
      </footer>
    </div>
    <div class="backdrop backdrop--gray" @click="$emit('close')"></div>
  </div>
</template>

<style lang="scss">
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 100;
  border-radius: 1rem;
  padding: 1rem 2rem;
}
</style>
