<template>
  <div class="todos">
    <div class="todos__main">
      <div class="todos__ul">
        <div
          class="todos__li"
          v-for="(todo, todoIdx) in curDateTodos.steps"
          :key="todo.descr + todoIdx">
          <div class="todos__li--group">
            <div class="todos__li--left">
              <input
                type="checkbox"
                class="todos__hidden-ckb"
                :id="`hidden-ckb${todoIdx}`"
                :checked="todo.status">
              <label
                class="todos__ckb"
                :for="`hidden-ckb${todoIdx}`"
                @click="updateTodoStatus(todoIdx)">
              </label>
              <div
                class="todos__descr"
                :class="{ 'todos__descr--complete' : todo.status }">
                {{todo.descr}}
              </div>
            </div>
            <div class="todos__li--right">
              <span>⩸</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <button @click="signout">sign out</button> -->
    </div>
    <div class="todos__footer"></div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { auth, db } from '../../../services/firebase';
import * as authService from '../../../services/auth';

export default {
  data() {
    return {
      userId: auth.currentUser.uid || null,
      today: dayjs().format('YYYY-MM-DD'),
      curDateTodos: {
        date: dayjs(this.today).unix(),
        steps: [],
      },
    };
  },
  mounted() {
    this.getCurDateTodos();
  },
  methods: {
    signout() {
      authService.signout()
        .then(() => {
          this.$router.push('/login');
        })
        .catch((err) => {
          console.log('logout fail', err);
        });
    },
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
    updateTodoStatus(idx) {
      this.curDateTodos.steps[idx].status = !this.curDateTodos.steps[idx].status;
      this.updateCurDateTodosInFirebase();
    },
    updateCurDateTodosInFirebase() {
      db.collection(this.userId).doc(this.today).set(this.curDateTodos);
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


<style lang="scss" scoped>
.todos {
  height: 20rem;

  &__main {
    margin-top: 1rem;
    // border: 1px solid red;
    height: calc(100% / 8 * 7);
  }

  &__footer {
    // border: 1px solid red;
    height: calc(100% / 8);
  }

  &__ul {
    height: 100%;
    overflow-y: scroll;
  }

  &__li {
    display: flex;
    flex-direction: column;

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
    margin-top: .6rem;
    margin-right: .5rem;
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
