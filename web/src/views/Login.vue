<template>
  <div class="login">
    <header>
      <div class="login__title">Acheve your goals.</div>
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
        <a class="login__link">password?</a>
      </div>
    </footer>
  </div>
</template>

<script>
import * as firebaseService from '../services/firebase';
import Input from '../components/Input.vue';

export default {
  components: { Input },
  data() {
    return {
      userEmail: '',
      userPassword: '',
    };
  },
  methods: {
    signin() {
      console.log(this.userEmail, this.userPassword);
      firebaseService.signin(this.userEmail, this.userPassword)
        .then((user) => {
          console.log(user);
          this.$router.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    signup() {
      firebaseService.signup(this.userEmail, this.userPassword)
        .catch((err) => {
          console.log(err);
        });
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

