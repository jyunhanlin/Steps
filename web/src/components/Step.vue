<template>
  <div class="step">
    <div class="step__group--left">
      <span class="steps__move" v-if="enableGrab">
        <img src="../assets/menu.png" alt="">
      </span>
      <input
        type="checkbox"
        class="step__hidden-ckb"
        :id="`hidden-ckb`"
        :checked="step.status"/>
      <label
        :for="`hidden-ckb`"
        class="step__ckb"
        @click="updateStepStatus">
      </label>
      <div class="step__group">
        <div
          v-if="!showInput"
          class="step__descr"
          :class="{ 'step__descr--complete' : step.status }"
          @click="openUpdateInput">
          {{step.descr}}
        </div>
        <input
          v-show="showInput"
          :ref="updateInput"
          type="text"
          class="input"
          :value="step.descr"
          @input="changeUpdateInput"
          @keypress.enter="updateStep"
          @keypress.esc="showInput = false"
          @blur="showInput = false" />
        <div
          v-if="step.subDescr !== ''"
          class="step__sub-descr"
          :class="{ 'step__sub-descr--complete' : step.status }">
          {{step.subDescr}}
        </div>
        <input
          v-show="showSubInput"
          :ref="subDescrInput"
          type="text"
          class="input"
          :value="step.subDescr"
          @input="changeSubInput"
          @keypress.enter="updateSubStep"
          @keypress.esc="showSubInput = false"
          @blur="showSubInput = false" />
      </div>
    </div>
    <div class="step__group--left">
      <button
        class="btn step__del-btn"
        @click="removeStep">
        刪除
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
    },
  },
  data() {
    return {
      showInput: false,
      showSubInput: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.steps {
  grid-column: 4 / 7;
  grid-row: 2 / 8;
  margin: 0 4rem;

  &__card {
    height: calc(100vh / 9 * 6);
    margin-bottom: 2rem;
  }

  &__todos {
    height: calc(100vh / 9 * 3.6);
  }

  &__ul {
    max-height: calc(100vh / 9 * 3);
    position: relative;
    margin-top: 1.5rem;
    overflow-y: scroll;
  }

  &__sep-line {
    height: 100%;
    width: 0.1rem;
    border: 0.5px solid rgb(196, 196, 196);
    position: absolute;
    left: 2rem;
    top: 0;
  }

  &__li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.1rem 0;
    & * {
      flex: 0 0 auto;
    }
    &--group {
      display: flex;
      width: 80%;
      & * {
        flex: 0 0 auto;
      }
      input{
        font-size: 1.5rem;
        margin-top:1px;
        margin-bottom:1px;
        width: 100%;
      }
    }
  }

  &__li:hover &__del-btn {
    opacity: 1;
  }

  &__ckb--input:checked + &__ckb::after {
    opacity: 1;
  }

  &__ckb {
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    border: 1px solid rgba(0,0,0,0.4);
    transform:translateY(8px);
    position: relative;
    margin-right: 0.75rem;
    cursor:pointer;
    &::after {
      content: '✓';
      position: absolute;
      top: -6px;
      left: 0;
      font-size: 1rem;
      opacity: 0;
    }

    &--input {
      display: none;
    }
  }

  &__descr {
    font-size:1.5rem;
    color:rgba(0,0,0,1);
    &--complete {
      text-decoration: line-through;
      color:rgba(0,0,0,0.4);
    }
  }

  &__del-btn {
    opacity: 0;
  }

  &__add-step {
    padding-top:5px;
    display: flex;
    margin-bottom:50px;
    input{
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }

  &__add-btn {
    margin-left: -0.2rem;
    margin-right: 1.5rem;
    font-size: 2rem;
    cursor: pointer;
    display:none;
  }

  &__add-descr {
    width: 100%;
    line-height: 3rem;
    cursor: pointer;
    color:rgba(0,0,0,0.4);
    letter-spacing:1px;
    font-size:1.25rem;
  }

  &__charts {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
  }
}
</style>

