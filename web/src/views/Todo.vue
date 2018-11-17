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
      <span class="current-date__left-arrow" @click="changeDate(-1)">◀︎</span>
      <span class="current-date__date">{{currentDate | dateFormat}}</span>
      <span class="current-date__right-arrow" @click="changeDate(1)">▶︎</span>
    </div>
    <div class="steps">
      <Card class="container steps__card">
        <div slot="header">Steps</div>
        <div slot="main">
          <div class="steps__todos">
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
                    @keypress.enter="updateTodo(todoIdx, todo.descr)"
                    @keypress.esc="curTodoIdx = -1"
                    @blur="curTodoIdx = -1"
                    />
                </div>
                <button
                  class="btn steps__del-btn"
                  @click="removeTodo(todoIdx)">
                  刪除
                </button>
              </div>
              <!-- <div class="steps__sep-line"></div> -->
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
                @keypress.enter="addNewTodo"
                @blur="showNewInput = false" />
            </div>
          </div>
        </div>
        <div slot="footer">
          <div class="steps__charts">
            <!-- <Doughnut :height="100" :width="100"/> -->
            <radial-progress-bar
              startColor="#32C373"
              stopColor="#32C373"
              innerStrokeColor="#D8D8D8"
              :diameter="100"
              :strokeWidth="5"
              :completed-steps="completedSteps"
              :total-steps="totalSteps"
              :animateSpeed="300">
              <p>{{`${Math.round(completedSteps / totalSteps * 100)}%`}}</p>
            </radial-progress-bar>
            <Bar :height="75" :width="300" :chart-data="barData"/>
          </div>
        </div>
      </Card>
    </div>
    <div class="calendar">
      <Card class="container">
        <div slot="main">
          <v-calendar
            :attributes="calendarAttrs"
            :theme-styles="calendarStyle"
            @dayclick='dayClicked'/>
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
import RadialProgressBar from 'vue-radial-progress';
import { auth, db } from '../services/firebase';
import * as authService from '../services/auth';
import Card from '../components/Card.vue';
import Doughnut from '../components/Doughnut';
import Bar from '../components/Bar';

export default {
  name: 'Todo',
  components: {
    Bar, Card, Doughnut, RadialProgressBar,
  },
  data() {
    return {
      currentDate: dayjs().format('YYYY-MM-DD'),
      calendarAttrs: [
        {
          key: 'today',
          highlight: {
            // borderColor: 'black',
            // borderWidth: '1px',
            borderRadius: '0',
            // height: '1.5rem',
            // Other properties are available too, like `height` & `borderRadius`
            backgroundColor: '#EEEEEE',
            height: '100%',
            width: '100%',
          },
          // contentStyle: {
          //   border: '1px solid #E9E9E9',
          // },
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
      barData: null,
      showNewInput: false,
      newInput: '',
      curTodoIdx: -1,
      updateInput: '',
      userId: auth.currentUser.uid || 'null',
      mountains: [],
      curMonthTodos: {},
      curDateTodos: {
        date: dayjs(this.currentDate).unix(),
        steps: [],
      },
      firebaseUnsubscribe: null,
      totalSteps: 1,
      completedSteps: 0,
    };
  },
  mounted() {
    this.getMonthTodos();
    window.addEventListener('keyup', (e) => {
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
    changeDate(plusMinus) {
      let needUnsubscribe = false;
      const endOfMonth = dayjs(this.currentDate).endOf('month').format('YYYY-MM-DD');
      const startOfMonth = dayjs(this.currentDate).startOf('month').format('YYYY-MM-DD');

      if (plusMinus === 1) {
        if (this.currentDate === endOfMonth) {
          needUnsubscribe = true;
        }
        this.currentDate = dayjs(this.currentDate).add(1, 'days').format('YYYY-MM-DD');
      } else {
        if (this.currentDate === startOfMonth) {
          needUnsubscribe = true;
        }
        this.currentDate = dayjs(this.currentDate).subtract(1, 'days').format('YYYY-MM-DD');
      }
      this.curDateTodos = {
        date: dayjs(this.currentDate).unix(),
        steps: [],
      };
      if ({}.hasOwnProperty.call(this.curMonthTodos, this.currentDate)) {
        this.curDateTodos = this.curMonthTodos[this.currentDate];
      }
      this.checkCircleProgress();
      if (needUnsubscribe) this.getMonthTodos();
    },
    addNewTodo() {
      if (this.newInput === '') {
        this.showNewInput = false;
        return;
      }
      const newTodo = {
        id: '',
        descr: this.newInput,
        subDescr: '',
        status: false,
      };
      this.curDateTodos.steps.push(newTodo);
      this.showNewInput = false;
      this.newInput = '';
      this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
    },
    updateTodoStatus(idx) {
      this.curDateTodos.steps[idx].status = !this.curDateTodos.steps[idx].status;
      this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
    },
    changeUpdateInput(e) {
      this.updateInput = e.target.value;
    },
    updateTodo(idx, descr) {
      if (this.updateInput === '') this.updateInput = descr;
      this.curDateTodos.steps[idx].descr = this.updateInput;
      this.curTodoIdx = -1;
      this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
    },
    removeTodo(idx) {
      // TODO
      // eslint-disable-next-line
      const sure = window.confirm('確定刪除?');
      if (sure) {
        this.curDateTodos.steps.splice(idx, 1);
      }
      this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
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
    updateCurDateTodosInFirebase() {
      db.collection(this.userId).doc(this.currentDate).set(this.curDateTodos);
    },
    getMonthTodos() {
      const endOfMonth = dayjs(dayjs(this.currentDate).endOf('month').format('YYYY-MM-DD')).unix();
      const startOfMonth = dayjs(dayjs(this.currentDate).startOf('month').format('YYYY-MM-DD')).unix();

      if (this.firebaseUnsubscribe) {
        console.log('unsubscribe first');
        this.firebaseUnsubscribe();
      }

      this.firebaseUnsubscribe = db.collection(this.userId)
        .where('date', '>=', startOfMonth).where('date', '<=', endOfMonth)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, doc.data());
            this.curMonthTodos[doc.id] = doc.data();
          });
          if ({}.hasOwnProperty.call(this.curMonthTodos, this.currentDate)) {
            this.curDateTodos = this.curMonthTodos[this.currentDate];
          }
          this.checkCircleProgress();
          this.checkCalendar();
          this.checkBar();
        }, (err) => {
          console.log('query error: ', err);
        });
    },
    checkCircleProgress() {
      this.totalSteps = this.curDateTodos.steps.length || 1;
      this.completedSteps = this.curDateTodos.steps.filter(step => step.status).length;
    },
    checkCalendar() {
      this.calendarAttrs.splice(1);
      const dotAttrs = {
        dot: {
          backgroundColor: '#D8D8D8',
        },
        dates: [],
      };

      Object.keys(this.curMonthTodos).forEach((date) => {
        if (this.curMonthTodos[date].steps.some(step => !step.status)) {
          dotAttrs.dates.push(date);
        }
      });
      this.calendarAttrs.push(dotAttrs);
    },
    checkBar() {
      this.barData = {};
      this.barData.labels = [];
      this.barData.datasets = [];
      const barDataSet = {
        backgroundColor: [],
        data: [],
      };
      for (let i = 6; i >= 0; i -= 1) {
        const date = dayjs(this.currentDate).subtract(i, 'day').format('YYYY-MM-DD');
        let todosLen = 0;
        if ({}.hasOwnProperty.call(this.curMonthTodos, date)) {
          todosLen = this.curMonthTodos[date].steps.length;
        }

        this.barData.labels.push(date);
        barDataSet.data.push(todosLen);
      }
      barDataSet.backgroundColor = [
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#878787',
      ];
      this.barData.datasets.push(barDataSet);
    },
    dayClicked(day) {
      this.currentDate = dayjs(day.date).format('YYYY-MM-DD');
      this.curDateTodos = {
        date: dayjs(this.currentDate).unix(),
        steps: [],
      };
      if ({}.hasOwnProperty.call(this.curMonthTodos, this.currentDate)) {
        this.curDateTodos = this.curMonthTodos[this.currentDate];
      }
      this.checkCircleProgress();
    },
  },
  filters: {
    dateFormat(date) {
      const dateArray = date.split('-');
      dateArray.shift();
      return dateArray.join('/');
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
    height: calc(100vh / 9 * 6);
    margin-bottom: 2rem;
  }

  &__todos {
    height: calc(100vh / 9 * 3);
  }

  &__ul {
    max-height: calc(100vh / 9 * 2.6);
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

  &__charts {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
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

  &__date {
    font-size: 4rem;
  }
  &__right-arrow, &__left-arrow {
    cursor: pointer;
    font-size: 2rem;
    padding: 0 1rem;
  }
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

