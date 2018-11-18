<template>
  <div class="login">
    <form class="login__form">
      <div class="login__field">
        <input
          class="login__input"
          type="email"
          v-model="userEmail"
          placeholder="Email Address"/>
      </div>
      <div class="login__field">
        <input
          class="login__input"
          type="password"
          v-model="userPassword"
          placeholder="Passowrd" />
      </div>
      <div class="login__field">
        <button class="login__btn" @click.prevent="signin">Sign in</button>
        <a class="login__tip">can't sign in?</a>
      </div>
    </form>
  </div>
</template>

<script>
import * as authService from '../../../services/auth';

export default {
  name: 'Login',
  data() {
    return {
      userEmail: '',
      userPassword: '',
    };
  },
  methods: {
    signin() {
      authService.signin(this.userEmail, this.userPassword)
        .then((user) => {
          console.log(user);
          this.$router.push('/todos');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  margin-top: 2.5rem;
  padding: .5rem;
  &__field {
    width: 100%;
    text-align: center;
    margin: 1rem 0;
  }
  &__input {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    height: 2.2rem;
    width: 100%;
    transition: all .2s;
    border: none;
    border-bottom: 1px solid #CECECE;
    padding: 6px;
    background-color: #FAFAFA;
    &:focus {
      outline: none;
      border-color: rgb(45, 179, 116);
    }
  }

  &__btn {
    margin-top: 1rem;
    border: none;
    color: white;
    font-weight: lighter;
    font-size: 1.5rem;
    padding: .8rem 2.5rem;
    background-color: rgb(45, 179, 116);
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  &__tip {
    &,
    &:link,
    &:visited {
      display: block;
      // color: rgb(85, 157, 206);
      cursor: pointer;
      transform: scale(.75);
    }

    &:active, &:focus {
      outline: none;
    }
  }
}
</style>
