import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { FirebaseAuthentication, type SignInResult } from '@capacitor-firebase/authentication';
import { f7 } from 'framework7-vue';

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
  t: any
): Promise<SignInResult | void> {
  try {
    f7.dialog.preloader(t('alerts.signing-in'));
    const auth: any = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    const result = await FirebaseAuthentication.signInWithEmailAndPassword({
      email,
      password
    });
    f7.dialog.close();
    return result;
  } catch (err: any) {
    f7.dialog.close();
    if (err.message.includes('auth/wrong-password'))
      f7.dialog.alert(t('alerts.wrong-password'), t('alerts.login-failed'));
    if (err.message.includes('auth/invalid-login-credentials'))
      f7.dialog.alert(t('alerts.wrong-password'), t('alerts.login-failed'));
    if (err.message.includes('auth/too-many-requests'))
      f7.dialog.alert(t('alerts.too-many-requests'), t('alerts.login-failed'));
  }
}

export async function signUpWithEmailAndPassword(email: string, password: string, t: any) {
  try {
    f7.dialog.preloader(t('alerts.signing-up'));
    const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email: email,
      password: password
    });
    await FirebaseAuthentication.sendEmailVerification();
    f7.dialog.close();
    return result;
  } catch (err: any) {
    f7.dialog.close();
    console.log(err.message);
    if (err.message.includes('auth/email-already-in-use'))
      f7.dialog.alert(t('alerts.email-in-use'), t('alerts.signup-failed'));
    else if (err.message.includes('auth/too-many-requests'))
      f7.dialog.alert(t('alerts.too-many-requests'), t('alerts.signup-failed'));
  }
}

export async function sendPasswordResetEmailToUser(email: string, t: any): Promise<void> {
  f7.dialog.preloader(t('alerts.sending-reset-link'));
  try {
    await FirebaseAuthentication.sendPasswordResetEmail({
      email: email
    });
    f7.dialog.close();
    f7.dialog.alert(t('alerts.reset-link-sent-to-your-email'), t('alerts.email-sent'), () => {
      const router = f7.view.main.router;
      if (router.previousRoute.name === 'emailLogin') {
        router.back();
      } else {
        router.navigate({ name: 'emailLogin' });
      }
    });
  } catch (e) {
    console.log(e);
    f7.dialog.alert(t('alerts.error-sending-reset-link', t('alerts.error')));
  }
}

export async function signInWithGoogle(): Promise<SignInResult> {
  // TODO: Should probably be a try catch here
  return await FirebaseAuthentication.signInWithGoogle();
}

export async function signInWithFacebook(): Promise<SignInResult> {
  // TODO: Should probably be a try catch here
  return await FirebaseAuthentication.signInWithFacebook();
}
export async function signInWithApple(): Promise<SignInResult> {
  // TODO: Should probably be a try catch here
  return await FirebaseAuthentication.signInWithApple();
}

export async function signOut(): Promise<void> {
  return await FirebaseAuthentication.signOut();
}
