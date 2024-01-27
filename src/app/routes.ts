import { getAuth } from 'firebase/auth'

// import pages from './pages';
import HomePage from '#/pages/HomePage.vue'
import WelcomePage from '#/pages/WelcomePage.vue'
import EmailLoginPage from '#/pages/EmailLoginPage.vue'
import RegisterPage from '#/pages/RegisterPage.vue'
import VerifyEmailPage from '#/pages/VerifyEmailPage.vue'
import NotFoundPage from '#/pages/NotFoundPage.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    beforeEnter: [requireAuth]
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomePage,
    beforeEnter: [redirectIfAuth]
  },
  {
    path: '/email-login',
    name: 'emailLogin',
    component: EmailLoginPage,
    beforeEnter: [redirectIfAuth]
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    beforeEnter: [redirectIfAuth]
  },
  {
    path: '/verfiy-email',
    name: 'verifyEmail',
    component: VerifyEmailPage,
    beforeEnter: [requireAuth]
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]

function isAuthenticated() {
  const auth = getAuth()
  return auth.currentUser !== null
}

function isEmailVerified() {
  const auth = getAuth()
  return auth.currentUser?.emailVerified
}

function requireAuth({ resolve, reject, router }: any) {
  if (!isAuthenticated()) {
    reject()
    if (!isEmailVerified()) router.navigate('/verfiy-email')
    else router.navigate('/')
  } else {
    resolve()
  }
}

function redirectIfAuth({ resolve, reject, router }: any) {
  if (isAuthenticated()) {
    reject()
    router.navigate('/')
  } else {
    resolve()
  }
}
