<template>
  <div class="container" ref="loginRef">
    <div class="signup">
      <div class="signup--left">
        <header>
          <span v-if="!signInMode">Sign Up</span>
          <span v-else>Sign In</span>
        </header>
        <main>
          <form @submit.prevent="sumbit()">
            <div class="signup__field">
              <Input
                v-model="userEmail"
                placeholder="Email Address"
                inputType="email" />
            </div>
            <div class="signup__field">
              <Input
                v-model="userPassword"
                placeholder="Passowrd"
                inputType="password" />
            </div>
            <div class="signup__field">
              <button class="signup__btn" @click.prevent="sumbit()">
                <span v-if="!signInMode">Sign up →</span>
                <span v-else>Sign in →</span>
              </button>
            </div>
          </form>
        </main>
        <footer>
          <div>
            <span v-if="!signInMode">
              Already have an account?
              <a class="signup__link" @click="signInMode = true">Sign in</a>
            </span>
            <span v-else>
              <a class="signup__link" @click="forgotpassword">forget password?</a>
            </span>
          </div>
        </footer>
      </div>
      <div class="signup--right">
        <div class="signup__headline">
          Achieve your goals,
        </div>
        <div class="signup__headline">
          step by step.
        </div>
        <div>
          your powerful goal management tools
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import * as authService from '../services/auth';
import Input from '../components/Input.vue';
import Notification from '../components/Notification.vue';

export default {
  components: {
    Input,
  },
  data() {
    return {
      userEmail: '',
      userPassword: '',
      signInMode: false,
      notificationInstance: null,
    };
  },
  methods: {
    sumbit() {
      if (this.signInMode) this.signin();
      else this.signup();
    },
    signin() {
      if (this.userEmail === '' || this.userPassword === '') {
        this.showNotification('輸入資訊不完整', 1000, false);
      } else {
        // console.log(this.userEmail, this.userPassword);
        this.showNotification('登入中...', 1000, true);
        authService.signin(this.userEmail, this.userPassword)
          .then((user) => {
            console.log(user);
            this.showNotification('登入成功', 1000, true);
            this.$router.push('/');
          })
          .catch((err) => {
            switch (err.code) {
              case 'auth/invalid-email':
                this.showNotification('無效的email格式', 1000, false);
                break;
              case 'auth/wrong-password':
                this.showNotification('錯誤的密碼', 1000, false);
                break;
              case 'auth/user-not-found':
                this.showNotification('查無此帳號', 1000, false);
                break;
              default:
                console.log(err);
                this.showNotification('未知的錯誤訊息', 1000, false);
                break;
            }
          });
      }
    },
    signup() {
      authService.signup(this.userEmail, this.userPassword)
        .then(() => {
          this.showNotification('註冊成功', 1000, true);
        })
        .catch((err) => {
          switch (err.code) {
            case 'auth/email-already-in-use':
              this.showNotification('email已被註冊', 1000, false);
              break;
            case 'auth/invalid-email':
              this.showNotification('無效的email格式', 1000, false);
              break;
            case 'auth/weak-password':
              this.showNotification('密碼至少需要6碼', 1000, false);
              break;
            default:
              console.log(err);
              this.showNotification('未知的錯誤訊息', 1000, false);
              break;
          }
        });
    },
    forgotpassword() {
      authService.forgotPassword(this.userEmail)
        .then(() => {
          this.showNotification('重設密碼連結已寄到您的信箱', 1000, true);
        })
        .catch((err) => {
          console.log(err);
          this.showNotification('未知的錯誤訊息', 1000, false);
        });
    },
    showNotification(message, duration = 0, status) {
      const NotificationCmp = Vue.extend(Notification);
      if (this.notificationInstance) {
        this.notificationInstance.$el.remove();
        this.notificationInstance = null;
      }
      this.notificationInstance = new NotificationCmp({
        propsData: {
          message,
          duration,
          success: status,
          error: !status,
        },
      });
      this.notificationInstance.$mount();
      this.$refs.loginRef.appendChild(this.notificationInstance.$el);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.signup {
  display: flex;
  width: 60rem;
  height: 40rem;
  box-shadow: 0 0 42px 5px rgba(0,0,0,0.28);
  border-radius: 1rem;
  overflow: hidden;

  &--left,
  &--right {
    width: 50%;
    height: 100%;
  }

  &--left {
    position: relative;
    padding: 5rem 4rem;

    header {
      font-size: 3.5rem;
      font-weight: bold;
      border-bottom: 2px solid black;
    }

    // main{
    //   padding: 2rem 0;
    // }

    footer {
      position: absolute;
      bottom: 5rem;
    }
  }

  &--right {
    background-image:
      linear-gradient( rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5)100%),
      url('../assets/signup.jpg');
    background-size: cover;
    background-position: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
  }

  &__field {
    padding-top: 1.5rem;
  }

  &__btn {
    border: none;
    color: white;
    font-weight: lighter;
    padding: .7rem 1.2rem;
    background-color: rgb(45, 179, 116);
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  &__headline {
    font-size: 2.5rem;
    font-weight: bold;
  }

  &__link {
    &,
    &:link,
    &:visited {
      display: inline-block;
      color: rgb(85, 157, 206);
      cursor: pointer;
    }

    &:active, &:focus {
      outline: none;
    }
  }
}
</style>
