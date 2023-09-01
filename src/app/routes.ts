// import pages from './pages';
import HomePage from '#/pages/HomePage.vue'
import LoginPage from '#/pages/LoginPage.vue'
import NotFoundPage from '#/pages/NotFoundPage.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]
