import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { firebaseConfig, accountInfo } from "./apiKey"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

const auth = getAuth()
const signIn = async () => {
  try {
    signInWithEmailAndPassword(auth, accountInfo.email, accountInfo.password)
  }
  catch {
    createUserWithEmailAndPassword(auth, accountInfo.email, accountInfo.password)
  }
}
signIn()
