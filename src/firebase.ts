import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { firebaseConfig } from "./apiKey"

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
