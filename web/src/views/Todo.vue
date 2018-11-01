<template>
  <div class="todo">
    <div class="todo__moutain">
      <Card>
        <div slot="header">Moutains</div>
        <div slot="main">many things</div>
      </Card>
    </div>
    <!-- <div class="todo__tips">
      <Card>
        <div slot="main">many things</div>
      </Card>
    </div> -->
    <div class="todo__current-date">
      <span>◀︎</span>
      <span>{{currentDate}}</span>
      <span>▶︎</span>
    </div>
    <div class="todo__steps">
      <Card>
        <div slot="header">Steps</div>
        <div slot="main">
          <div class="todo__steps-container">
            <div class="todo__steps-step">
              <div class="todo__steps-group">
                <input type="checkbox" class="todo__steps-ckb-input" id="ckb-input" />
                <label for="ckb-input" class="todo__steps-ckb-group">
                  <span class="todo__steps-ckb"></span>
                  <span class="todo__steps-step-descr">this is description</span>
                </label>
              </div>
              <button class="todo__btn">刪除</button>
            </div>
            <div class="todo__steps-sep-line"></div>
          </div>
          <div class="todo__steps-add-step">
            <span class="todo__steps-add-btn">⨁</span>
            <span class="todo__steps-add-descr">this is description</span>
            <input type="text" class="todo__steps-add-input" />
          </div>
        </div>
        <div slot="footer">this is footer</div>
      </Card>
    </div>
    <div class="todo__datepicker">
      <Card>
        <div slot="main">
          <v-calendar :attributes='attrs'>
          </v-calendar>
        </div>
      </Card>
    </div>
    <!-- <div class="todo__user">
      <Card>
        <div slot="main">user</div>
      </Card>
    </div> -->
    <div class="todo__logout">
      <button class="todo__btn" @click="logout()">logout</button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import * as firebaseService from '../services/firebase';
import Card from '../components/Card.vue';

export default {
  components: { Card },
  data() {
    return {
      currentDate: dayjs().format('M/DD'),
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
            // Other properties are available too, like `height` & `borderRadius`
          },
          dates: new Date(),
        },
      ],
    };
  },
  methods: {
    logout() {
      firebaseService.signout()
        .then(() => {
          this.$router.push('/login');
        })
        .catch((err) => {
          console.log('logout fail', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.todo {
  display: grid;
  grid-template-columns: 1fr repeat(7, minmax(min-content, 12rem)) 1fr;
  grid-template-rows: repeat(9, calc(100vh / 9));

  &__moutain {
    grid-column: 2 / 4;
    grid-row: 3 / 8;
  }

  &__tips {
    grid-column: 2 / 4;
    grid-row: 8 / 9;
    margin-top: 2rem;
  }

  &__steps {
    grid-column: 4 / 7;
    grid-row: 3 / 9;
    margin: 0 3rem;
  }

  &__datepicker {
    grid-column: 7 / 9;
    grid-row: 3 / 6;
  }

  &__current-date {
    grid-column: 5 / 6;
    grid-row: 2 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__user {
    margin: 2rem 0;
    grid-column: 7 / 9;
    grid-row: 6 / 8;
  }

  &__logout {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 1.5rem 2.5rem;

    & button {
      font-size: 1.5rem;
    }
  }

  &__steps-container {
    // border: 1px solid red;
    min-height: calc(100vh / 9 * 3);
    position: relative;
    margin-top: 1.5rem;
  }

  &__steps-sep-line {
    height: calc(100vh / 9 * 3);
    width: .1rem;
    border: .5px solid rgb(196, 196, 196);
    position: absolute;
    left: 2rem;
    top: 0;
  }

  &__steps-step {
    display: flex;
    justify-content: space-between;
  }

  &__steps-ckb-input {
    display: none;
  }

  &__steps-ckb {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 1px solid black;
    position: relative;
    margin-right: 2.5rem;

    &::after {
      content: '✓';
      position: absolute;
      top: -1rem;
      left: 0;
      font-size: 2rem;
    }
  }

  &__btn {
    border: none;
    &:focus {
      outline: none;
    }
  }

  &__steps-add-btn {
    display: inline-block;
    margin-right: 2.5rem;
    font-size: 1.5rem;
  }
}
</style>

