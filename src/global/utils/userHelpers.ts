import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { FirebaseAuthentication, type SignInResult } from '@capacitor-firebase/authentication'
import { f7 } from 'framework7-vue'

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<SignInResult | void> {
  try {
    f7.dialog.preloader()
    const auth: any = getAuth()
    await setPersistence(auth, browserLocalPersistence)
    const result = await FirebaseAuthentication.signInWithEmailAndPassword({
      email,
      password
    })
    f7.dialog.close()
    return result
  } catch (err: any) {
    f7.dialog.close()

    console.log(err)
    if (err.message.includes('auth/wrong-password')) f7.dialog.alert('Wrong password')
    if (err.message.includes('auth/too-many-requests')) f7.dialog.alert('Too many requests')
  }
}

export async function signUpWithEmailAndPassword(email: string, password: string) {
  try {
    f7.dialog.preloader()
    const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email: email,
      password: password
    })
    await FirebaseAuthentication.sendEmailVerification()
    f7.dialog.close()
    return result
  } catch (err: any) {
    f7.dialog.close()

    console.log(err)
    if (err.message.includes('auth/wrong-password')) f7.dialog.alert('Wrong password')
    if (err.message.includes('auth/too-many-requests')) f7.dialog.alert('Too many requests')
  }
}

export async function signInWithGoogle(): Promise<SignInResult> {
  // TODO: Should probably be a try catch here
  return await FirebaseAuthentication.signInWithGoogle()
}

export async function signInWithFacebook(): Promise<SignInResult> {
  // TODO: Should probably be a try catch here
  return await FirebaseAuthentication.signInWithFacebook()
}
export async function signInWithApple(): Promise<SignInResult> {
  // TODO: Should probably be a try catch here
  return await FirebaseAuthentication.signInWithApple()
}

export async function signOut(): Promise<void> {
  return await FirebaseAuthentication.signOut()
}
