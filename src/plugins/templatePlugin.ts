import { f7 } from 'framework7-vue';
import { isNative } from '@/global/utils/deviceInfo';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from './templatePlugin/firebase/firebaseConfig.js';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import rtDatabase from './templatePlugin/firebase/rtDatabase';

import nativeAppBoot from './templatePlugin/nativeAppBoot';

let isMounted = false;

export default {
  install: async (app: any) => {
    const firebaseApp = initializeApp(await firebaseConfig());
    const analytics = getAnalytics(firebaseApp);
    //rtDatabase.initDatabse(firebaseApp);
  },
  async initialize(callback: Function) {
    // if native set capacitor settings
    if (await isNative()) nativeAppBoot();
    // Set up firebase and auth listener
    await FirebaseAuthentication.addListener('authStateChange', (authStateChange: any) => {
      if (!isMounted) {
        callback();
        isMounted = true;
      }
      const router = f7.views.main.router;
      console.log(authStateChange);
      const user = authStateChange.user;
      if (user != undefined) {
        // User exists in firebase
        // If user has unverified email redirect to verifyEmail
        if (!user.emailVerified) {
          router.navigate({ name: 'verifyEmail' });
        } else {
          try {
            // if redirect exists redirect to redirect path
            if (router.currentRoute.query.redirectTo)
              router.navigate({ path: router.currentRoute.query.redirectTo as string });
            // if user is loged in and on login or register or initializeUser page redirect to budgets
            else {
              const RN = router.currentRoute.name;
              if (
                RN === 'welcome' ||
                RN === 'emailLogin' ||
                RN === 'register' ||
                RN === 'resetPassword' ||
                RN === 'verifyEmail'
              )
                setTimeout(() => {
                  router.navigate({ name: 'home' });
                }, 1000);
            }
          } catch (err) {
            console.log('🔥', 'firebase user not found');
          }
        }
      } else {
        //userStore.$reset()
        const RN = router.currentRoute.name;
        if (
          RN !== 'welcome' &&
          RN !== 'emailLogin' &&
          RN !== 'register' &&
          RN !== 'resetPassword' &&
          RN !== 'verifyEmail'
        )
          router.navigate({ name: 'welcome' }, { reloadAll: true });
      }
    });
  }
};
