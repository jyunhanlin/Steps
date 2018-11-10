<template>
  <div class="todo">
    <div class="moutain">
      <Card>
        <div slot="header">Moutains</div>
        <div slot="main">many things</div>
      </Card>
    </div>
    <!-- <div class="tips">
      <Card>
        <div slot="main">many things</div>
      </Card>
    </div> -->
    <div class="current-date">
      <span>◀︎</span>
      <span>{{currentDate}}</span>
      <span>▶︎</span>
    </div>
    <div class="steps">
      <Card class="container steps__card">
        <div slot="header">Steps</div>
        <div slot="main">
          <div class="steps__ul">
            <div
              class="steps__li"
              v-for="(todo, todoIdx) in curDateTodos.steps"
              :key="todo.descr + todoIdx">
              <div class="steps__li--group">
                <input
                  type="checkbox"
                  class="steps__ckb--input"
                  :id="`ckb-input${todoIdx}`"
                  :checked="todo.status"/>
                <label
                  :for="`ckb-input${todoIdx}`"
                  class="steps__ckb"
                  @click="updateTodoStatus(todoIdx)">
                </label>
                <span
                  v-if="todoIdx !== curTodoIdx"
                  class="steps__descr"
                  :class="{ 'steps__descr--complete' : todo.status }"
                  @click="openUpdateInput(todoIdx)">
                  {{todo.descr}}
                </span>
                <input
                  v-show="todoIdx === curTodoIdx"
                  :ref="`updateInput${todoIdx}`"
                  type="text"
                  class="input"
                  :value="todo.descr"
                  @input="changeUpdateInput"
                  @keyup.enter="updateTodo(todoIdx, todo.descr)"
                  @keyup.esc="curTodoIdx = -1"
                  @blur="curTodoIdx = -1"
                  />
              </div>
              <button
                class="btn steps__del-btn"
                @click="removeTodo(todoIdx)">
                刪除
              </button>
            </div>
            <div class="steps__add-step">
              <div class="steps__add-btn" @click="openNewInput">⨁</div>
              <div
                v-if="!showNewInput"
                class="steps__add-descr"
                @click="openNewInput">
                按下 alt + n 以新增
              </div>
              <input
                v-show="showNewInput"
                ref="newInput"
                v-model="newInput"
                type="text"
                class="input"
                @keyup.enter="addNewTodo"
                @blur="showNewInput = false" />
            </div>
            <div class="steps__sep-line"></div>
          </div>
        </div>
        <div slot="footer">
          <div class="steps__charts">
            <Doughnut :height="100" :width="100"/>
            <Bar :height="75" :width="300"/>
          </div>
        </div>
      </Card>
    </div>
    <div class="calendar">
      <Card class="container">
        <div slot="main">
          <v-calendar
            :attributes="calendarAttrs"
            :theme-styles="calendarStyle"/>
        </div>
      </Card>
    </div>
    <!-- <div class="user">
      <Card>
        <div slot="main">user</div>
      </Card>
    </div> -->
    <div class="logout">
      <button class="btn logout__btn" @click="logout()">logout</button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { auth, db } from '../services/firebase';
import * as authService from '../services/auth';
import Card from '../components/Card.vue';
import Doughnut from '../components/Doughnut';
import Bar from '../components/Bar';

export default {
  name: 'Todo',
  components: { Bar, Card, Doughnut },
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
      curDateTodos: [
        {
          descr: 'my first todo',
          subDescr: '',
          status: 1,
        },
      ],
      showNewInput: false,
      newInput: '',
      curTodoIdx: -1,
      updateInput: '',
      userId: auth.currentUser.uid || 'null',
      mountains: [],
    };
  },
  firestore() {
    return {
      curDateTodos: db.collection(this.userId).doc(dayjs().format('YYYY-MM-DD')),
    };
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.keyCode === 78) {
        this.openNewInput();
      }
    });
  },
  methods: {
    openNewInput() {
      this.showNewInput = true;
      this.$nextTick(() => {
        this.$refs.newInput.focus();
      });
    },
    openUpdateInput(idx) {
      this.curTodoIdx = idx;
      this.$nextTick(() => {
        this.$refs[`updateInput${idx}`][0].focus();
      });
    },
    addNewTodo() {
      const allTodos = this.curDateTodos.steps.slice();
      const newTodo = {
        id: '',
        descr: this.newInput,
        subDescr: '',
        status: false,
      };
      allTodos.push(newTodo);
      db.collection(this.userId).doc(dayjs().format('YYYY-MM-DD')).set({
        date: new Date(),
        steps: allTodos,
      });
      this.showNewInput = false;
      this.newInput = '';
    },
    updateTodoStatus(idx) {
      const allTodos = this.curDateTodos.steps.slice();
      allTodos[idx].status = !allTodos[idx].status;
      db.collection(this.userId).doc(dayjs().format('YYYY-MM-DD')).set({
        date: new Date(),
        steps: allTodos,
      });
    },
    changeUpdateInput(e) {
      this.updateInput = e.target.value;
    },
    updateTodo(idx, descr) {
      if (this.updateInput === '') this.updateInput = descr;
      const allTodos = this.curDateTodos.steps.slice();
      allTodos[idx].descr = this.updateInput;
      db.collection(this.userId).doc(dayjs().format('YYYY-MM-DD')).set({
        date: new Date(),
        steps: allTodos,
      });
      this.curTodoIdx = -1;
    },
    removeTodo(idx) {
      // TODO
      // eslint-disable-next-line
      const sure = window.confirm('確定刪除?');
      if (sure) {
        const allTodos = this.curDateTodos.steps.slice();
        allTodos.splice(idx, 1);
        db.collection(this.userId).doc(dayjs().format('YYYY-MM-DD')).set({
          date: new Date(),
          steps: allTodos,
        });
      }
    },
    logout() {
      authService.signout()
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

<style lang='scss' scoped>
.todo {
  display: grid;
  grid-template-columns: 1fr repeat(7, minmax(min-content, 12rem)) 1fr;
  grid-template-rows: repeat(9, calc(100vh / 9));
}

.moutain {
  grid-column: 2 / 4;
  grid-row: 3 / 8;
}

.tips {
  grid-column: 2 / 4;
  grid-row: 8 / 9;
  margin-top: 2rem;
}

.steps {
  grid-column: 4 / 7;
  grid-row: 3 / 9;
  margin: 0 3rem;

  &__card {
    min-height: calc(100vh / 9 * 6);
    margin-bottom: 2rem;
  }

  &__ul {
    min-height: calc(100vh / 9 * 2.5);
    position: relative;
    margin-top: 1.5rem;
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
    padding: 0.5rem 0;
    & * {
      flex: 0 0 auto;
    }
    &--group {
      display: flex;
      & * {
        flex: 0 0 auto;
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

    &--input {
      display: none;
    }
  }

  &__descr {
    &--complete {
      text-decoration: line-through;
      font-style: italic;
    }
  }

  &__del-btn {
    opacity: 0;
  }

  &__add-step {
    display: flex;
  }

  &__add-btn {
    margin-left: -0.2rem;
    margin-right: 1.5rem;
    font-size: 2rem;
    cursor: pointer;
  }

  &__add-descr {
    width: 100%;
    line-height: 3rem;
    cursor: pointer;
  }
}

.calendar {
  grid-column: 7 / 9;
  grid-row: 3 / 6;
}

.current-date {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user {
  margin: 2rem 0;
  grid-column: 7 / 9;
  grid-row: 6 / 8;
}

.logout {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1.5rem 2.5rem;

  &__btn {
    font-size: 1.5rem;
  }
}

.container {
  height: auto;
}

.btn {
  cursor: pointer;
  border: none;
  &:focus {
    outline: none;
  }
}

.input {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  width: 100%;
  border: none;
  border-bottom: 1px solid #e5e9ec;
  transition: 0.5s;

  &:focus {
    outline: none;
    border-color: rgb(45, 179, 116);
  }
}
</style>

