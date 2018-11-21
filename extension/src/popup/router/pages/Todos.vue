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
    <div class="todos__footer" v-if="curDateTodos.steps.length > 0">
      <div class="todos__cur-status">
        {{`${Math.round(completedSteps / totalSteps * 100)}%`}}
      </div>
      <progress class="todos__progress" :value="completedSteps" :max="totalSteps" />
    </div>
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
  computed: {
    totalSteps() {
      return this.curDateTodos.steps.length || 1;
    },
    completedSteps() {
      return this.curDateTodos.steps.filter(step => step.status).length;
    },
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
    background-color: #EAEAEA;
    border: none;
  }

  &__ckb {
    flex: 0 0 1rem;
    display: block;
    // width: 1rem;
    height: 1rem;
    border: 1px solid #979797;
    margin-top: .6rem;
    margin-right: .5rem;
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

  &__cur-status {
    text-align: right;
    color: #979797;
    font-size: 2rem;
  }

  &__progress {
    -webkit-appearance: none;
    // margin-top: 0.75rem;
    border-radius: 0;
    height: 0.5rem;
    display: block;
    overflow: hidden;
    padding: 0;
    width: 100%;

    &::-webkit-progress-bar {
      // background: rgb(229, 233, 236);
      background-color: rgb(229, 233, 236);
    }

    &::-webkit-progress-value {
      background-color: #20B573;
      transition: width .2s linear;
    }
  }
}
</style>
