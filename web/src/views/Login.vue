<template>
  <div class="login" ref="loginRef">
    <header>
      <div class="login__title">Achieve your goals,</div>
      <div class="login__title">step by step.</div>
    </header>
    <main>
      <form class="login__form" @submit.prevent="signin()">
        <div class="login__input">
          <Input
            v-model="userEmail"
            placeholder="Email Address"
            inputType="email" />
        </div>
        <div class="login__input">
          <Input
            v-model="userPassword"
            placeholder="Passowrd"
            inputType="password" />
        </div>
        <div class="login__cta">
          <button class="login__btn" @click.prevent="signin()">Sign in</button>
          <div class="login__cta--group">
            <label class="login__label--link">or</label>
            <a class="login__link" @click.prevent="signup()">Sign Up</a>
          </div>
        </div>
      </form>
    </main>
    <footer>
      <div class="login__footer">
        <span class="login__label--link">forgot</span>
        <a class="login__link" @click="forgotpassword()">password?</a>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';
import * as authService from '../services/auth';
import Input from '../components/Input.vue';
import Notification from '../components/Notification.vue';

export default {
  name: 'Login',
  components: { Input },
  data() {
    return {
      userEmail: '',
      userPassword: '',
      notificationInstance: null,
    };
  },
  methods: {
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
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  header {
    margin-top: -2rem;
    margin-bottom: 5rem;
    text-align: center;
  }
  &__title {
    font-size: 4.2rem;
    font-weight: lighter;
    margin-bottom: -1.5rem;
  }

  &__form {
    width: 33rem;
    height: 18rem;
    box-shadow: 0px 0px 42px 5px rgba(0,0,0,0.28);
    border-radius: .8rem;
    padding: 3rem;
  }

  &__input {
    padding: .5rem;
    margin-bottom: 1rem;
  }

  &__cta {
    padding-top: 1rem;
    text-align: center;

    &--group {
      padding-top: .5rem;
    }
  }

  &__btn {
    border: none;
    color: white;
    font-weight: lighter;
    padding: .4rem 1.2rem;
    background-color: rgb(45, 179, 116);
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  &__link {
    &,
    &:link,
    &:visited {
      display: inline-block;
      color: rgb(85, 157, 206);
      cursor: pointer;
      transform: scale(.75);
    }

    &:active, &:focus {
      outline: none;
    }
  }

  &__footer {
    padding-top: 1rem;
  }

  &__label {
    &--link {
      display: inline-block;
      transform: scale(.75);
      margin-right: -.3rem;
    }
  }
}
</style>

