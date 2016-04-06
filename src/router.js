import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import App from './App';
import LandingPage from './landing-page/LandingPage';
import LoginPage from './app/Login';
import RegisterPage from './app/Register';
import LessPassIndex from './app/Index';
import UpdateEntry from './app/Entries/UpdateEntry';
import http from './services/http';

const router = new Router({
  history: true,
  hashbang: false,
});

router.map({
  '/': {
    component: LandingPage,
  },
  '/login/': {
    component: LoginPage,
  },
  '/register/': {
    component: RegisterPage,
  },
  '/app/': {
    auth_required: true,
    component: LessPassIndex,
  },
  '/app/entries/:uuid/': {
    auth_required: true,
    component: UpdateEntry,
  },
});

router.redirect({
  '*': '/',
});

router.beforeEach(transition => {
  http.auth.checkAuth()
    .then(() => {
      if (transition.to.path === '/') {
        transition.redirect('/app/');
      } else {
        transition.next();
      }
    })
    .catch(() => {
      if (transition.to.auth_required) {
        transition.redirect('/login/');
      } else {
        transition.next();
      }
    });
});

router.start(App, '#app');
