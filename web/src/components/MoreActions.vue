<template>
  <div class="more-action">
    <ul class="more-action__ul" v-if="openContent">
      <li
        v-if="actions.includes('moveToNextDay')"
        class="more-action__li"
        @click="moveToNextDay">
        移至下一天
      </li>
      <li
        v-if="actions.includes('moveToDay')"
        class="more-action__li"
        @click="openCalendar">
        移至...
      </li>
      <li
        v-if="actions.includes('moveToBacklog')"
        class="more-action__li"
        @click="moveToBacklog">
        移至Backlog
      </li>
      <li
        v-if="actions.includes('moveToTodayStep')"
        class="more-action__li"
        @click="moveToTodayStep">
        移至今日Steps
      </li>
      <li
        v-if="actions.includes('moveToStep')"
        class="more-action__li"
        @click="openCalendar">
        移至...Steps
      </li>
      <li
        v-if="actions.includes('remove')"
        class="more-action__li"
        @click="remove">
        刪除
      </li>
    </ul>
    <Modal v-if="showCalendar" @close="close()">
      <v-calendar
        :attributes="calendarAttrs"
        :theme-styles="calendarStyle"
        @dayclick='dayClicked'/>
    </Modal>
    <div class="backdrop" v-if="openContent" @click="close()"></div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Modal from './Modal.vue';

export default {
  name: 'MoreActions',
  components: {
    Modal,
  },
  props: {
    actions: {
      type: Array,
      default() {
        return ['remove'];
      },
    },
  },
  data() {
    return {
      openContent: true,
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
        dayContent: {
          cursor: 'pointer',
        },
      },
    };
  },
  methods: {
    moveToTodayStep() {
      this.$emit('moveToTodayStep');
      this.close();
    },
    moveToNextDay() {
      this.$emit('moveToNextDay');
      this.close();
    },
    moveToBacklog() {
      this.$emit('moveToBacklog');
      this.close();
    },
    remove() {
      this.$emit('remove');
      this.close();
    },
    openCalendar() {
      this.openContent = false;
      this.showCalendar = true;
    },
    dayClicked(day) {
      this.$emit('moveTo', day.date);
      this.close();
    },
    close() {
      this.$emit('close');
      this.openContent = true;
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
    transform: translate(-70%, -20%);
    display: block;
    width: 9rem;
  }

  &__li {
    cursor: pointer;
    text-align: center;
    padding: .5rem 1rem;
    background-color: #fff;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
    margin-bottom: .2rem;
    transition:0.15s;
    &:hover{
      background: rgba(240 ,240 ,240 , 1);
    }
  }
}
</style>
