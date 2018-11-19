<template>
  <div class="newtab">
    <div class="date-time">
      <div class="date-time__time">{{currentTime}}</div>
      <div class="date-time__date">{{currentDate}}</div>
    </div>
    <div class="google-search">
      <form id=search action="https://www.google.com.tw/search" method="get" target="_blank">
        <input class="google-search__input" type="search" name="q" placeholder="Search on Google"/>
        <button class="google-search__btn">G</button>
      </form>
    </div>
    <div class="steps">
      <Card class="steps__card">
        <div slot="header">Steps</div>
        <div slot="main">
          <div class="steps__main">
            <div class="steps__ul">
              <div
                class="steps__li"
                v-for="(todo, todoIdx) in curDateTodos.steps"
                :key="todo.descr + todoIdx">
                <div class="todos__li--group">
                  <div class="steps__li--left">
                    <input
                      type="checkbox"
                      class="steps__hidden-ckb"
                      :id="`hidden-ckb${todoIdx}`"
                      :checked="todo.status">
                    <label
                      :for="`hidden-ckb${todoIdx}`"
                      class="steps__ckb"
                      @click="updateTodoStatus(todoIdx)">
                    </label>
                    <div
                      v-if="todoIdx !== curTodoIdx"
                      class="steps__descr"
                      :class="{ 'steps__descr--complete' : todo.status }"
                      @click="openUpdateInput(todoIdx)">
                      {{todo.descr}}
                    </div>
                    <input
                      v-show="todoIdx === curTodoIdx"
                      :ref="`updateInput${todoIdx}`"
                      type="text"
                      class="steps__input"
                      :value="todo.descr"
                      @input="changeUpdateInput"
                      @keypress.enter="updateTodo(todoIdx, todo.descr)"
                      @keypress.esc="curTodoIdx = -1"
                      @blur="curTodoIdx = -1"/>
                  </div>
                  <div class="steps__li--right"></div>
                </div>
              </div>
            </div>
            <div class="steps__add">
              <div
                v-if="!showNewInput"
                class="steps__add--descr"
                @click="openNewInput">
                按下 alt + n 以新增
              </div>
              <div v-if="!showNewInput" class="steps__add--btn" @click="openNewInput">⨁</div>
              <input
                v-show="showNewInput"
                ref="newInput"
                v-model="newInput"
                type="text"
                class="steps__input"
                placeholder="新建事項..."
                @keypress.enter="addNewTodo"
                @blur="showNewInput = false" />
            </div>
          </div>
        </div>
        <div slot="footer">
          <div class="steps__chart" v-if="userId">
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
            <Bar :height="55" :width="300" :chart-data="barData"/>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import RadialProgressBar from 'vue-radial-progress';
import * as authService from '../services/auth';
import { db } from '../services/firebase';

import Card from './components/Card';
import Bar from './components/Bar';

export default {
  components: { Card, RadialProgressBar, Bar },
  data() {
    return {
      userId: null,
      currentTime: dayjs().format('h:mm A'),
      currentDate: dayjs().format('dddd, MMMM D'),
      today: dayjs().format('YYYY-MM-DD'),
      curDateTodos: {
        date: dayjs(this.today).unix(),
        steps: [],
      },
      cur7DaysTodos: {},
      showNewInput: false,
      newInput: '',
      curTodoIdx: -1,
      updateInput: '',
      firebaseUnsubscribe: null,
      barData: null,
    };
  },
  mounted() {
    window.addEventListener('keyup', (e) => {
      if (e.altKey && e.keyCode === 78) {
        this.openNewInput();
      }
    });
    setInterval(() => {
      this.currentTime = dayjs().format('h:mm A');
    }, 1000);
    authService.checkAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.get7DaysTodos();
      } else {
        this.curDateTodos.steps.push(
          {
            id: '',
            descr: '安裝Steps chrome extension',
            status: true,
            subDescr: '',
          },
          {
            id: '',
            descr: '註冊並登入Steps!',
            status: false,
            subDescr: '點擊瀏覽器右上角的Steps logo就可以開始註冊登入',
          },
          {
            id: '',
            descr: '開始使用',
            status: false,
            subDescr: '',
          },
        );
      }
    });
  },
  computed: {
    completedSteps() {
      return this.curDateTodos.steps.filter(step => step.status).length;
    },
    totalSteps() {
      return this.curDateTodos.steps.length || 1;
    },
  },
  methods: {
    get7DaysTodos() {
      if (this.userId) {
        const today = dayjs(this.today).unix();
        const last7Days = dayjs(dayjs(this.today).subtract(6, 'days').format('YYYY-MM-DD')).unix();

        if (this.firebaseUnsubscribe) {
          console.log('unsubscribe first');
          this.firebaseUnsubscribe();
        }

        this.firebaseUnsubscribe = db.collection(this.userId)
          .where('date', '>=', last7Days).where('date', '<=', today)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              // console.log(doc.id, doc.data());
              this.cur7DaysTodos[doc.id] = doc.data();
            });
            if ({}.hasOwnProperty.call(this.cur7DaysTodos, this.today)) {
              this.curDateTodos = this.cur7DaysTodos[this.today];
            }
            this.checkBar();
          }, (err) => {
            console.log('query error: ', err);
          });
      }
    },
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
      // this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
      this.$el.querySelector('.steps__ul').scrollTop = this.$el.querySelector('.steps__ul').scrollHeight;
    },
    updateTodoStatus(idx) {
      this.curDateTodos.steps[idx].status = !this.curDateTodos.steps[idx].status;
      // this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
    },
    changeUpdateInput(e) {
      this.updateInput = e.target.value;
    },
    updateTodo(idx, descr) {
      if (this.updateInput === '') this.updateInput = descr;
      this.curDateTodos.steps[idx].descr = this.updateInput;
      this.curTodoIdx = -1;
      // this.checkCircleProgress();
      this.updateCurDateTodosInFirebase();
    },
    updateCurDateTodosInFirebase() {
      db.collection(this.userId).doc(this.today).set(this.curDateTodos);
    },
    checkBar() {
      const result = {};
      result.labels = [];
      result.datasets = [];
      const dateset = {
        backgroundColor: [],
        data: [],
      };
      for (let i = 6; i >= 0; i -= 1) {
        const date = dayjs(this.today).subtract(i, 'day').format('YYYY-MM-DD');
        let todosLen = 0;
        if ({}.hasOwnProperty.call(this.cur7DaysTodos, date)) {
          todosLen = this.cur7DaysTodos[date].steps.length;
        }
        result.labels.push(date);
        dateset.data.push(todosLen);
      }
      dateset.backgroundColor = [
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#D8D8D8',
        '#878787',
      ];
      result.datasets.push(dateset);
      this.barData = result;
    },
  },
};
</script>


<style lang="scss" scoped>
.newtab {
  padding-top: 10rem;
  text-align: center;
}

.date-time {
  &__time {
    font-size: 6rem;
    font-weight: lighter;
  }

  &__date {
    font-size: 1.5rem;
    margin-top: -1.5rem;
  }
}

.google-search {
  margin: 1.5rem 0;

  &__input{
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    height: 2.2rem;
    width: 35rem;
    // transition: all .2s;
    border-radius: 0;
    border: 1px solid #DFDFDF;
    padding: .5rem;
  }

  &__btn {
    display: inline-block;
    height: 2.2rem;
    width: 2rem;
    margin-top: .3rem;
    margin-left: -2.2rem;
    background-color: #A9A9A9;
  }
}

.steps {
  display: flex;
  justify-content: center;

  &__card {
    width: 30rem;
    height: 35rem;
    text-align: left;
  }

  &__main {
    height: 16rem;
    margin-top: 1.5rem;
  }

  &__ul {
    max-height: 13rem;
    overflow-y: scroll;
  }

  &__li {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;

    &--group {
      display: flex;
      justify-content: space-between;
    }

    &--left {
      width: 100%;
      display: flex;
    }
  }

  &__hidden-ckb {
    display: none;
  }

  &__hidden-ckb:checked + &__ckb {
    background-color: #EAEAEA;
    border: none;
  }

  &__ckb {
    flex: 0 0 1rem;
    display: block;
    // width: 1rem;
    height: 1rem;
    border: 1px solid #979797;
    margin-top: .2rem;
    margin-right: 1rem;
  }

  &__chart {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__descr {
    flex: 1 1 100%;
    // width: 100%;
    // border: 1px solid red;
    &--complete {
      text-decoration: line-through;
      color: #979797;
    }
  }

  &__add {
    display: flex;
    margin-top: 1rem;

    &--descr {
      margin-left: -1rem;
      color: #979797;
      transform: scale(.8);
    }

    &--btn {
      color: #32C373;
      cursor: pointer;
    }
  }

  &__input {
    font-size: inherit;
    font-family: inherit;
    border: none;
    width: 100%;
    border-bottom: 1px solid #e5e9ec;
    transition: 0.5s;
    &:focus {
      outline: none;
      border-color: rgb(45, 179, 116);
    }
  }
}
</style>
