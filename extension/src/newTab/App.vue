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
          <div v-for="(todo, todoIdx) in curDateTodos.steps" :key="todo.descr + todoIdx">
            <div>
              {{todo.descr}}
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { auth, db } from '../services/firebase';

import Card from './components/Card';

export default {
  components: { Card },
  data() {
    return {
      userId: auth.currentUser.uid || null,
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
    this.getCurDateTodos();
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
}
</style>
