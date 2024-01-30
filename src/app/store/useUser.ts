import { ref as dbRef, onValue, off } from 'firebase/database'
// get firebase user
import { getAuth } from 'firebase/auth'
import rtDatabase from '@/plugins/templatePlugin/firebase/rtDatabase'
import type { IUser } from '../types/userInterface'
import { ref } from 'vue'

// Define dbUser outside of the composable
const dbUser = ref<IUser | undefined>(undefined)
const pending = ref(false)

export function useUser() {
  const db = rtDatabase.getDatabase()
  const uid = getAuth().currentUser?.uid

  // If dbUser is already initialized, return it
  if (dbUser.value != undefined || pending.value) {
    return dbUser
  }

  if (uid === undefined || db === undefined) return
  pending.value = true
  console.log('started')
  onValue(dbRef(db, 'users/' + uid), (snapshot) => {
    const data = snapshot.val()
    console.log('Got user data from firebase')
    console.log(data)
    dbUser.value = data
    if (pending.value) pending.value = false
  })

  return dbUser
}

// Provide a separate method to manually stop and clear dbUser
export function clearUser() {
  const db = rtDatabase.getDatabase()
  const uid = getAuth().currentUser?.uid
  if (uid === undefined || db === undefined) return
  off(dbRef(db, 'users/' + uid))
  dbUser.value = undefined
}
