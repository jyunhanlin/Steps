<template>
  <div class="more-action">
    <button
      v-if="!enableGrab"
      class="btn"
      @click="openContent = !openContent">
      ...
    </button>
    <ul class="more-action__ul" v-if="openContent">
      <li class="more-action__li" @click="moveToNextDay">移至下一天</li>
      <li class="more-action__li" @click="openCalendar">移至...</li>
      <li class="more-action__li" @click="remove">刪除</li>
    </ul>
    <Modal v-if="showCalendar" @close="showCalendar = false">
      <v-calendar
        :attributes="calendarAttrs"
        :theme-styles="calendarStyle"
        @dayclick='dayClicked'/>
    </Modal>
    <div class="backdrop" v-if="openContent" @click="openContent = false"></div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  props: {
    enableGrab: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openContent: false,
      showCalendar: false,
      calendarAttrs: [
        {
          key: 'today',
          highlight: {
            borderRadius: '0',
            backgroundColor: '#EEEEEE',
            height: '100%',
            width: '100%',
          },
          dates: dayjs().format('YYYY-MM-DD'),
        },
      ],
      calendarStyle: {
        wrapper: {
          border: '0',
          height: '100%',
        },
        dayCell: {
          border: '.5px solid #E9E9E9',
        },
      },
    };
  },
  methods: {
    moveToNextDay() {
      this.$emit('moveToNextDay');
      this.openContent = false;
    },
    remove() {
      this.$emit('remove');
      this.openContent = false;
    },
    openCalendar() {
      this.showCalendar = true;
      this.openContent = false;
    },
    dayClicked(day) {
      this.$emit('moveTo', day.date);
      this.showCalendar = false;
    },
  },
};
</script>


<style lang="scss">
.more-action {
  position: relative;

  &__ul {
    position: fixed;
    // display: inline-block;
    list-style: none;
    z-index: 100;
  }

  &__li {
    cursor: pointer;
    text-align: center;
    padding: .5rem 1rem;
    transform: translate(-80%, -50%);
    background-color: #fff;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
    margin-bottom: .2rem;
  }
}
</style>
