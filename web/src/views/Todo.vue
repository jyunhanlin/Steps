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
      <Card class="todo__container">
        <div slot="header">Steps</div>
        <div slot="main">
          <div class="todo__steps-ul">
            <div class="todo__steps-li">
              <div
                class="todo__steps-group"
                v-for="(todo, todoIdx) in curDateTodos"
                :key="todo.descr + todoIdx">
                <div class="todo__steps-ckb-group">
                  <input
                    type="checkbox"
                    class="todo__steps-ckb-input"
                    :id="`ckb-input${todoIdx}`"
                    :checked="todo.status"/>
                  <label
                    :for="`ckb-input${todoIdx}`"
                    class="todo__steps-ckb"
                    @click="completeTodo(todoIdx)">
                  </label>
                  <span
                    class="todo__steps-descr"
                    :class="{ 'todo__steps-descr--complete' : todo.status }">
                    {{todo.descr}}
                  </span>
                  <!-- <input
                    type="text"
                    :value="todo.descr"
                    @keyup.enter="updateTodo(todoIdx)"
                    class="todo__steps-add-input" /> -->
                </div>
                <button
                  class="todo__btn todo__steps-del-btn"
                  @click="removeTodo(todoIdx)">
                  刪除
                </button>
              </div>
            </div>
            <div class="todo__steps-sep-line"></div>
          </div>
          <div class="todo__steps-add-step">
            <div class="todo__steps-add-btn" @click="openInput">⨁</div>
            <div class="todo__steps-add-descr" v-if="!showInput">按下 alt + n 以新增</div>
            <input
              v-else
              ref="addInput"
              v-model="todoInput"
              type="text"
              class="todo__steps-add-input"
              @keyup.enter="addTodo"
              @blur="showInput = false" />
          </div>
        </div>
        <div slot="footer">this is footer</div>
      </Card>
    </div>
    <div class="todo__calendar">
      <Card class="todo__container">
        <div slot="main">
          <v-calendar
            :attributes='calendarAttrs'
            :theme-styles='calendarStyle'/>
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
      calendarAttrs: [
        {
          key: 'today',
          highlight: {
            borderColor: 'black',
            borderWidth: '1px',
            borderRadius: '0',
            height: '1.5rem',
            // Other properties are available too, like `height` & `borderRadius`
          },
          dates: dayjs().format('YYYY-MM-DD'),
        },
        {
          dot: {
            backgroundColor: '#794dff',
          },
          dates: [
            dayjs('2018-11-01').format('YYYY-MM-DD'),
            dayjs('2018-11-03').format('YYYY-MM-DD'),
            dayjs('2018-11-05').format('YYYY-MM-DD'),
            dayjs('2018-11-09').format('YYYY-MM-DD'),
            dayjs('2018-11-15').format('YYYY-MM-DD'),
          ],
        },
      ],
      calendarStyle: {
        wrapper: {
          border: '0',
          height: '100%',
        },
      },
      showInput: false,
      curDateTodos: [
        {
          descr: 'my first todo',
          subDescr: '',
          status: 1,
        },
      ],
      todoInput: '',
    };
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.keyCode === 78) {
        this.openInput();
      }
    });
  },
  methods: {
    openInput() {
      this.showInput = true;
      this.$nextTick(() => {
        this.$refs.addInput.focus();
      });
    },
    addTodo() {
      const newTodo = {
        descr: this.todoInput,
        subDescr: '',
        status: 0,
      };
      this.curDateTodos.push(newTodo);
      this.showInput = false;
      this.todoInput = '';
    },
    completeTodo(idx) {
      const todo = this.curDateTodos[idx];
      const updateTodo = {
        ...todo,
        status: !todo.status,
      };
      this.curDateTodos.splice(idx, 1, updateTodo);
    },
    removeTodo(idx) {
      this.curDateTodos.splice(idx, 1);
    },
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

  &__calendar {
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

  &__container {
    height: auto;
  }

  &__steps-ul {
    min-height: calc(100vh / 9 * 2);
    position: relative;
    margin-top: 1.5rem;
  }

  &__steps-sep-line {
    height: 100%;
    width: .1rem;
    border: .5px solid rgb(196, 196, 196);
    position: absolute;
    left: 2rem;
    top: 0;
  }

  &__steps-group {
    display: flex;
    justify-content: space-between;
  }

  &__steps-group:hover &__steps-del-btn {
    opacity: 1;
  }

  &__steps-ckb-input {
    display: none;
  }

  &__steps-ckb-input:checked + &__steps-ckb::after{
    opacity: 1;
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
      opacity: 0;
    }
  }

  &__steps-descr {

    &--complete {
      text-decoration: line-through;
      font-style: italic;
    }
  }

  &__steps-del-btn {
    opacity: 0;
  }

  &__btn {
    cursor: pointer;
    border: none;
    &:focus {
      outline: none;
    }
  }

  &__steps-add-btn {
    margin-right: 2.5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }

  &__steps-add-step {
    display: flex;
  }

  &__steps-add-descr {
    // display: flex;
    // align-items: center;
    width: 100%;
  }

  &__steps-add-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #E5E9EC;
    transition: .5s;

    &:focus {
      outline: none;
      border-color: rgb(45, 179, 116);
    }
  }
}
</style>

