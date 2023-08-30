// import pages from './pages';
import HomePage from '#/pages/HomePage.vue'
import NotFoundPage from '#/pages/NotFoundPage.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]
