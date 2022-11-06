import { HostnameStorage } from "../../constant"
import { firebaseConfig } from "./apiKey"
import { initializeApp } from 'firebase/app'
import { get, getDatabase, ref, set } from 'firebase/database'

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export const fromStorage = <T>(
  hostname: string,
  key: string,
  decoder: (data: any) => T
): Promise<T> => {
  return new Promise(function (resolve) {
    get(ref(db, key)).then((snapshot) => {
      if (snapshot.exists() && key in snapshot.val()) {
        console.log('fromStorage', snapshot.val())
        resolve(decoder(snapshot.val()[key]))
      } else {
        throw new Error()
      }
    }).catch(() => {
      chrome.storage.local.get(hostname, function (items: any) {
        if (hostname in items && key in items[hostname]) {
          set(ref(db, key), {
            [key]: items[hostname][key]
          })
          resolve(decoder(items[hostname][key]))
        } else {
          resolve(decoder(undefined))
        }
      })
    })
  })
}

export const loadHostName = (): Promise<string | undefined> => {
  return new Promise(function (resolve) {
    get(ref(db, `${HostnameStorage}`)).then((snapshot) => {
      if (snapshot.exists() && HostnameStorage in snapshot.val()) {
        console.log('loadHostName', snapshot.val())
        resolve(snapshot.val()[HostnameStorage])
      } else {
        throw new Error()
      }
    }).catch(() => {
      chrome.storage.local.get(HostnameStorage, function (items: any) {
        if (typeof items[HostnameStorage] === "undefined") {
          resolve(undefined)
        } else {
          set(ref(db, `${HostnameStorage}`), {
            [HostnameStorage]: items[HostnameStorage]
          })
          resolve(items[HostnameStorage])
        }
      })
    })
  })
}

export const toStorage = (
  hostname: string,
  key: string,
  value: any
): Promise<string> => {
  const entity: { [key: string]: [value: any] } = {}
  entity[key] = value
  return new Promise(function (resolve) {
    set(ref(db, key), {
      [key]: value
    })
    resolve('saved')
    chrome.storage.local.get(hostname, function (items: any) {
      if (typeof items[hostname] === "undefined") {
        items[hostname] = {}
      }
      items[hostname][key] = value
      chrome.storage.local.set({ [hostname]: items[hostname] }, () => {
        resolve("saved")
      })
    })
  })
}

export const saveHostName = (hostname: string): Promise<string> => {
  return new Promise(function (resolve) {
    chrome.storage.local.set({ [HostnameStorage]: hostname }, () => {
      resolve("saved")
    })
  })
}
