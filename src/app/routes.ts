import { getAuth } from 'firebase/auth';

// import pages from './pages';
import HomePage from '#/pages/HomePage.vue';
import WelcomePage from '#/pages/WelcomePage.vue';
import EmailLoginPage from '#/pages/EmailLoginPage.vue';
import RegisterPage from '#/pages/RegisterPage.vue';
import VerifyEmailPage from '#/pages/VerifyEmailPage.vue';
import NotFoundPage from '#/pages/NotFoundPage.vue';
import ResetPasswordPage from './pages/ResetPasswordPage.vue';

import ResourceTypesPageVue from './pages/ResourceTypesPage.vue';
import ResourcesPageVue from './pages/ResourcesPage.vue';
import ResourcePageVue from './pages/ResourcePage.vue';
import ResourceTypeSettingsPageVue from './pages/ResourceTypeSettingsPage.vue';
export default [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    beforeEnter: [requireAuth]
  },
  {
    path: '/Companies/:companyId/resourceTypes',
    name: 'resourceTypes',
    component: ResourceTypesPageVue,
    beforeEnter: [requireAuth]
  },
  {
    path: '/Companies/:companyId/resourceTypes/:resourceTypeId/resources',
    name: 'resources',
    component: ResourcesPageVue,
    beforeEnter: [requireAuth]
  },
  {
    path: '/Companies/:companyId/resourceTypes/:resourceTypeId/settings',
    name: 'resourceSettings',
    component: ResourceTypeSettingsPageVue,
    beforeEnter: [requireAuth]
  },
  {
    path: '/Companies/:companyId/resourceTypes/:resourceTypeId/resources/:resourceId',
    name: 'resource',
    component: ResourcePageVue,
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
    path: '/verify-email',
    name: 'verifyEmail',
    component: VerifyEmailPage,
    beforeEnter: [requireAuth]
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: ResetPasswordPage,
    beforeEnter: [redirectIfAuth]
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
];

function isAuthenticated() {
  const auth = getAuth();
  return auth.currentUser !== null;
}

function isEmailVerified() {
  const auth = getAuth();
  return auth.currentUser?.emailVerified;
}

function requireAuth({ resolve, reject, router, to }: any) {
  if (!isAuthenticated()) {
    reject();
  } else {
    if (!isEmailVerified() && to.name !== 'verifyEmail') {
      reject();
      router.navigate('/verify-email');
    } else {
      resolve();
    }
  }
}

function redirectIfAuth({ resolve, reject, router }: any) {
  if (isAuthenticated()) {
    reject();
    router.navigate('/');
  } else {
    resolve();
  }
}
