<template>
  <div class="todo">
    <div class="current-date">
      <span class="current-date__left-arrow" @click="changeDate(-1)">◀︎</span>
      <span class="current-date__date">{{currentDate | dateFormat}}</span>
      <span class="current-date__right-arrow" @click="changeDate(1)">▶︎</span>
    </div>
    <div class="steps">
      <Card class="container steps__card">
        <div slot="header" class="steps__header">
          <div><img src="../assets/stairs.png" alt=""> Steps</div>
          <button class="btn steps__icon" @click="enableGrab = !enableGrab">
            <img
              src="../assets/shuffle_dark.png"
              class="steps__img"
              :class="{'steps__img--dragging': enableGrab}">
          </button>
        </div>
        <div slot="main" class="steps__todos">
          <div class="steps__ul" :class="{'steps__ul--dragging': enableGrab}">
            <draggable
              v-model="curDateTodos.steps"
              :options="{ handle:'.steps__move' }"
              @change="updateCurDateTodosInFirebase">
              <div
                class="steps__li"
                v-for="(todo, todoIdx) in curDateTodos.steps"
                :key="todo.descr + todoIdx">
                <div class="steps__li--group">
                  <span class="steps__move" v-if="enableGrab">
                    <img src="../assets/menu.png" alt="">
                  </span>
                  <input
                    type="checkbox"
                    class="steps__ckb--input"
                    :id="`ckb-input${todoIdx}`"
                    :checked="todo.status"/>
                  <label
                    v-if="!enableGrab"
                    :for="`ckb-input${todoIdx}`"
                    class="steps__ckb"
                    :class="{
                      'steps__ckb--complete': todo.status,
                      'steps__ckb--disable':
                        ({}.hasOwnProperty.call(todo, 'changeable')) && !todo.changeable
                    }"
                    @click="updateTodoStatus(todoIdx)">
                  </label>
                  <div
                    v-if="todoIdx !== curTodoIdx"
                    class="steps__descr"
                    :class="{
                      'steps__descr--complete': todo.status,
                      'steps__descr--disable':
                        ({}.hasOwnProperty.call(todo, 'changeable')) && !todo.changeable,
                    }"
                    @click="openUpdateInput(todoIdx)">
                    {{todo.descr}}
                  </div>
                  <input
                    v-show="todoIdx === curTodoIdx"
                    :ref="`updateInput${todoIdx}`"
                    type="text"
                    class="input"
                    :value="todo.descr"
                    @input="changeUpdateInput"
                    @keypress.enter="updateTodo(todoIdx, todo.descr)"
                    @keypress.esc="curTodoIdx = -1"
                    @blur="curTodoIdx = -1" />
                </div>
                <div>
                  <div v-if="({}.hasOwnProperty.call(todo, 'moveToDay'))"
                  class="steps__movedToHint">
                    {{`🠖 ${todo.moveToDay}`}}
                  </div>
                  <button
                    v-if="!({}.hasOwnProperty.call(todo, 'moveToDay')) && !enableGrab"
                    class="btn steps__del-btn"
                    @click="curMoreActionIdx = todoIdx">
                    ...
                  </button>
                  <MoreActions
                    v-if="todoIdx === curMoreActionIdx"
                    class="steps__more-actions"
                    @moveToNextDay="moveToDay(todoIdx)"
                    @moveTo="(day) => moveToDay(todoIdx, day)"
                    @remove="removeTodo(todoIdx)"
                    @close="curMoreActionIdx = -1"/>
                </div>
              </div>
            </draggable>
            <!-- <div class="steps__sep-line"></div> -->
          </div>
          <div class="steps__add-step">
            <div class="steps__add-btn" @click="openNewInput">⨁</div>
            <div
              v-if="!showNewInput"
              class="steps__add-descr"
              @click="openNewInput">
              按下 alt + n 以新增
              <img
                src="../assets/plus.svg"
                style="height:1.25rem; transform:translateY(4px); opacity:0.8;">
            </div>
            <input
              v-show="showNewInput"
              ref="newInput"
              v-model="newInput"
              placeholder="新增事項..."
              type="text"
              class="input"
              @keypress.enter="addNewTodo"
              @blur="showNewInput = false" />
          </div>
          <p class="steps__hint" :class="{'steps__hint--dragging':enableGrab}">點擊右上角圖標以切換回一般模式</p>
        </div>
        <div slot="footer" class="steps__charts" :class="{'steps__charts--dragging':enableGrab}">
          <radial-progress-bar
            startColor="#32C373"
            stopColor="#32C373"
            innerStrokeColor="#DfDfDf"
            :diameter="90"
            :strokeWidth="6"
            :completed-steps="completedSteps"
            :total-steps="totalSteps"
            :animateSpeed="400"
            :timingFunc="timingFunc">
            <p
              class="steps__complete-percnetage">
              {{`${Math.round(completedSteps / totalSteps * 100)}%`}}
            </p>
          </radial-progress-bar>
          <Bar :height="75" :width="300" :chart-data="barData"/>
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
    <About v-if="showAbout" @close="showAbout = false"/>
    <div class="logout">
      <button class="btn logout__btn" @click="showAbout = true">about</button>
      <a
        class="btn logout__btn logout__link"
        href="https://docs.google.com/forms/d/e/1FAIpQLSdRKZooibBpjZ3cMmVZy7p9YVDUDKLYW-nSKapSnGH4JJPhRw/viewform?usp=sf_link"
        target="_blank">
        feedback
      </a>
      <button class="btn logout__btn" @click="logout()">logout</button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import RadialProgressBar from 'vue-radial-progress';
import draggable from 'vuedraggable';
import { auth, db } from '../services/firebase';
import * as authService from '../services/auth';
import * as dbService from '../services/db';
import Card from '../components/Card.vue';
import Doughnut from '../components/Doughnut';
import Bar from '../components/Bar';
import About from '../components/About.vue';
import MoreActions from '../components/MoreActions.vue';


export default {
  name: 'Todo',
  components: {
    Bar, Card, Doughnut, RadialProgressBar, About, draggable, MoreActions,
  },
  data() {
    return {
      timingFunc: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
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
        dayContent: {
          cursor: 'pointer',
        },
        dots: {
          marginLeft: '2rem',
          marginBottom: '.2rem',
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
      showAbout: false,
      enableGrab: false,
      curMoreActionIdx: -1,
    };
  },
  computed: {
    completedSteps() {
      return this.curDateTodos.steps.filter(step => step.status).length;
    },
    totalSteps() {
      return this.curDateTodos.steps.length || 1;
    },
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
        changeable: true,
      };
      this.curDateTodos.steps.push(newTodo);
      this.showNewInput = false;
      this.$toasted.show(
        `「${this.newInput}」已新增`,
        {
          position: 'bottom-right',
          duration: 2500,
          theme: 'outline',
          className: 'vueToasted--stepsAdded',
        },
      );
      this.newInput = '';
      this.updateCurDateTodosInFirebase();
    },
    updateTodoStatus(idx) {
      this.curDateTodos.steps[idx].status = !this.curDateTodos.steps[idx].status;
      this.updateCurDateTodosInFirebase();
    },
    changeUpdateInput(e) {
      this.updateInput = e.target.value;
    },
    updateTodo(idx, descr) {
      if (this.updateInput === '') this.updateInput = descr;
      this.curDateTodos.steps[idx].descr = this.updateInput;
      this.curTodoIdx = -1;
      this.updateCurDateTodosInFirebase();
    },
    removeTodo(idx) {
      // TODO
      // eslint-disable-next-line
      const sure = window.confirm('確定刪除?');
      if (sure) {
        this.curDateTodos.steps.splice(idx, 1);
      }
      this.updateCurDateTodosInFirebase();
      this.$toasted.show(
        '刪除成功',
        {
          position: 'bottom-right',
          duration: 2500,
          theme: 'outline',
          className: 'vueToasted--stepsDeleted',
        },
      );
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
      if (this.userId) {
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
            this.checkCalendar();
            this.checkBar();
          }, (err) => {
            console.log('query error: ', err);
          });
      }
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
      const diffDays = dayjs().diff(dayjs(this.currentDate), 'day');
      if (diffDays >= 0 && diffDays < 7) {
        this.barData = {};
        this.barData.labels = [];
        this.barData.datasets = [];
        const barDataSet = {
          backgroundColor: [],
          data: [],
        };
        for (let i = 6; i >= 0; i -= 1) {
          const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
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
      }
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
    },
    moveToDay(idx, day = null) {
      const cloneStep = { ...this.curDateTodos.steps[idx] };
      let targetDay;
      if (day) targetDay = dayjs(day).format('YYYY-MM-DD');
      else targetDay = dayjs(this.currentDate).add(1, 'day').format('YYYY-MM-DD');
      dbService.getFirestore(this.userId, targetDay)
        .then((doc) => {
          let todos;
          if (doc.exists) {
            todos = doc.data();
          } else {
            todos = {
              date: dayjs(targetDay).unix(),
              steps: [],
            };
          }
          todos.steps.push(cloneStep);
          return dbService.setFirestore(this.userId, targetDay, todos);
        }).catch((error) => {
          console.log('Error getting document:', error);
        });
      this.curDateTodos.steps[idx].status = true;
      this.curDateTodos.steps[idx].changeable = false;
      this.curDateTodos.steps[idx].moveToDay = dayjs(targetDay).format('MM-DD');
      this.updateCurDateTodosInFirebase();
      this.$toasted.show(
        '移動成功',
        {
          position: 'bottom-right',
          duration: 2500,
          theme: 'outline',
          className: 'vueToasted--stepsAdded',
        },
      );
    },
  },
  filters: {
    dateFormat(date) {
      const dateArray = date.split('-');
      dateArray.shift();
      return dateArray.join('/');
    },
  },
  beforeRouteEnter(to, from, next) {
    authService.checkAuthStateChanged((user) => {
      if (user) {
        next();
      } else {
        next('/login');
      }
    });
  },
};
</script>

<style lang='scss' scoped>
.todo {
  display: grid;
  grid-template-columns: 1fr repeat(7, minmax(min-content, 12rem)) 1fr;
  grid-template-rows: repeat(9, calc(100vh / 9));
  height:100vh;
  overflow: hidden;
  padding-top:40px;
  background:#f4f4f4;
}

.mountain {
  grid-column: 2 / 4;
  grid-row: 2 / 6;
  transform:translateX(2.5rem);

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__btn {
    font-size: 2rem;
  }
}

.tips {
  grid-column: 2 / 4;
  grid-row: 8 / 9;
  margin-top: 2rem;
}

.steps {
  grid-column: 4 / 7;
  grid-row: 2 / 8;
  margin: 0 4rem;
  &__icon {
    background: transparent;
  }

  &__card {
    height: calc(100vh / 9 * 6);
    margin-bottom: 2rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;

    & div img {
      width:18px;
      opacity: 0.2;
      transform: translateY(5px);
    }
  }

  &__img {
    opacity: 0.3;
    width: 1.3rem;
    transform: translateY(2px);
    transition: 0.2s;
    &--dragging{
      opacity: 1;
    }
  }

  &__todos {
    height: calc(100vh / 9 * 3.6);
  }

  &__ul {
    max-height: calc(100vh / 9 * 3);
    position: relative;
    margin-top: 1.5rem;
    overflow-y: auto;
    transition:0.2s;
    &--dragging{
      // transform:translateX(-10px);
      margin-left:-20px;
    }
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
    padding: 0.1rem 0;
    transition:0.2s;
    & * {
      flex: 0 0 auto;
    }
    &--group {
      display: flex;
      width: 70%;
      & * {
        flex: 0 0 auto;
      }
      input{
        font-size: 1.6rem;
        margin-top:0px;
        margin-bottom:1px;
        width: 100%;
        transform:translateY(-1px);
      }
    }
  }

  &__li:hover &__del-btn{
    opacity: 0.8;
  }

  &__move {
    cursor: grab;
    display: inline-block;
    width: 0.75rem;
    margin-right: 0.75rem;
    transform:translateY(.3rem);
    opacity: 0.8;

    height:1rem;
    & img{
      width: 16px;
      transform:translate(-4px,1px);
      opacity:0.6;
    }
  }

  &__ckb {
    display: inline-block;
    width: 0.9rem;
    height: 0.9rem;
    border: 1px solid rgba(0,0,0,0.2);
    transform:translateY(6px);
    position: relative;
    margin-right: 0.75rem;
    cursor:pointer;
    transition:0.2s;
    &--complete{
      background: #888888;
      border: 1px solid rgba(0,0,0,0);
    }

    &--input {
      display: none;
    }

    &--disable {
      pointer-events: none;
    }
  }

  &__descr {
    font-size:1.6rem;
    color:rgba(0,0,0,1);
    &--complete {
      text-decoration: line-through;
      color:rgba(0,0,0,0.4);
    }

    &--disable {
      pointer-events: none;
    }
  }

  &__del-btn {
    opacity: 0;
    background: transparent;
    font-weight: 600;
    font-size: 1.5rem;
    transition: 0.1s;
  }

  &__add-step {
    padding-top:5px;
    display: flex;
    margin-bottom:50px;
    input{
      font-size: 1.6rem;
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
    font-weight: 500;
  }

  &__charts {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;

    opacity:1;
    transition:0.2s;
    &--dragging{
      opacity:0;
    }
  }


  &__hint{
    text-align: center;
    opacity: 0;
    transition: 0.2s;
    font-weight: 500;

    &--dragging{
      opacity:0.3;
    }
  }

  &__complete-percnetage {
    font-size: 3rem;
    font-weight:200;
    color:#c4c4c4;
    user-select: none;
  }

  &__movedToHint {
    font-size: 12px;
    font-weight: 600;
    color:rgba(0,0,0,0.2);
    transition:0.2s;
    user-select: none;
    &:hover{
      color:rgba(0,0,0,0.5);
    }
  }
}

.calendar {
  grid-column: 7 / 9;
  grid-row: 2 / 5;
  transform:translateX(-2.5rem);

}

.current-date {
  user-select: none;
  grid-column: 5 / 6;
  grid-row: 1 / 2;
  display: flex;
  justify-content: center;
  align-items: center;

  &__date {
    font-size: 5rem;
    font-weight:200;
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
  // position: absolute;
  // bottom: 3.5rem;
  // right: 3rem;
  // padding: 1.5rem 2.5rem;
  // grid-column: 8 / 9;
  // grid-row: 8 / 9;
  // transform:translateX(2.5rem);
  grid-column: 7 / 9;
  grid-row: 7/ 8;
  transform:translateX(-2.5rem);
  display: flex;
  justify-content: flex-end;

  &__btn {
    height:2rem;
    font-size: 1.5rem;
    color:#d0d0d0;
    letter-spacing:1px;
    border:1px solid rgba(0,0,0,0)!important;
    border-radius:20px;
    padding:0px 10px;
    transition:0.2s;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color:#666666;
    }
  }

  &__link {
    &:link,
    &:visited {
      text-decoration: none;
      // line-height: 3rem;
    }
  }
}

.container {
  height: auto;
}

.vueToasted {
  &--stepsAdded{
    opacity:0.8;
  }
  &--stepsDeleted{
    opacity:0.8;
  }
}
</style>
