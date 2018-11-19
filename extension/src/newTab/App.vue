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
                      class="steps__ckb">
                    </label>
                    <div
                      class="steps__descr"
                      :class="{ 'steps__descr--complete' : todo.status }">
                      {{todo.descr}}
                    </div>
                  </div>
                  <div class="steps__li--right"></div>
                </div>
              </div>
            </div>
            <div class="steps__add">增加</div>
          </div>
        </div>
        <div slot="footer">
          <div class="steps__chart">
            <radial-progress-bar
              startColor="#32C373"
              stopColor="#32C373"
              innerStrokeColor="#D8D8D8"
              :diameter="100"
              :strokeWidth="5"
              :completed-steps="3"
              :total-steps="8"
              :animateSpeed="300">
              <p>{{`${Math.round(3 / 8 * 100)}%`}}</p>
            </radial-progress-bar>
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

export default {
  components: { Card, RadialProgressBar },
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
    };
  },
  mounted() {
    setInterval(() => {
      this.currentTime = dayjs().format('h:mm A');
    }, 1000);
    authService.checkAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.getCurDateTodos();
      }
    });
  },
  methods: {
    getCurDateTodos() {
      if (this.userId) {
        db.collection(this.userId).doc(this.today)
          .onSnapshot((doc) => {
            if (doc.exists) {
              console.log('Document data:', doc.data());
              this.curDateTodos = doc.data();
            }
          }, (err) => {
            console.log(err);
          });
      }
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
    max-height: 15rem;
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
    background-color: black;
  }

  &__ckb {
    flex: 0 0 1rem;
    display: block;
    // width: 1rem;
    height: 1rem;
    border: 1px solid black;
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
    }
  }
}
</style>
