<template>
  <div class="steps-input">
    <input
      :type="inputType"
      class="steps-input__input"
      v-model="value"
      @blur="emitValue($event.target.value)"
      @change="$emit('change', value)">
    <span
      class="steps-input__placeholder"
      :class="{ 'steps-input__placeholder--up' : value !== '' }">
      {{placeholder}}
    </span>
    <div class="steps-input__bar"></div>
  </div>
</template>

<script>
export default {
  name: 'Input',
  model: {
    prop: 'inputValue',
    event: 'change',
  },
  props: {
    placeholder: String,
    validations: Object,
    inputType: {
      type: String,
      default: 'text',
    },
    inputValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      value: '',
    };
  },
  methods: {
    emitValue(value) {
      this.inputValid = true;
      if (this.validations) {
        let temp;
        if (this.validations.type === 'numeric') {
          temp = value.replace(/\D/g, '');
        }
        if (this.validations.minLen) {
          temp = temp.slice(0, this.validations.minLen);
          if (temp.length < this.validations.minLen) {
            temp = '';
            this.inputValid = false;
          }
        }
        this.$emit('input', temp);
      } else {
        this.$emit('input', value);
        this.$emit('change', this.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.steps-input {
  position: relative;

  &__input {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    height: 2.2rem;
    width: 100%;
    transition: all .2s;
    border: none;
    padding: 6px;

    &:focus {
      outline: none;
    }

    &:focus ~ .steps-input__bar::after {
      transform: scaleX(1);
    }

    &:focus ~ .steps-input__placeholder {
      transform: translateY(-120%);
      color: rgb(45, 179, 116);
    }
  }

  &__bar {
    width: 100%;
    height: 1px;
    border: .5px solid #E5E9EC;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      height: 2px;
      width: calc(100% + 1px);
      transform: scaleX(0);
      border: .5px solid rgb(45, 179, 116);
      transition: all .25s;
    }
  }

  &__placeholder, {
    position: absolute;
    top: 6px;
    left: 6px;
    pointer-events: none;
    font-size: 1.2rem;
    transition: all .2s;
    color: #8c8a83;
  }

  &__placeholder--up {
    transform: translateY(-120%);
    color: rgb(45, 179, 116);
  }


}
</style>
