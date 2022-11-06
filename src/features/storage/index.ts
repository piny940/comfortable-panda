import { HostnameStorage } from "../../constant"
import { get, ref, set } from 'firebase/database'
import { db } from "../../firebase"

export const fromStorage = <T>(
  hostname: string,
  key: string,
  decoder: (data: any) => T
): Promise<T> => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(key, function (items: any) {
      if (key in items) {
        resolve(decoder(items[key]))
      } else {
        get(ref(db, key)).then((snapshot) => {
          if (snapshot.exists()) {
            chrome.storage.local.set({[key]: snapshot.val()})
            resolve(decoder(snapshot.val()))
          } else {
            resolve(decoder(undefined))
          }
        })
      }
    })
  })
}

export const loadHostName = (): Promise<string | undefined> => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(HostnameStorage, function (items: any) {
      if (typeof items[HostnameStorage] === "undefined") {
        resolve(undefined)
      } else {
        resolve(items[HostnameStorage])
      }
    })
  })
}

export const toStorage = (
  hostname: string,
  key: string,
  value: any
): Promise<string> => {
  if (value) {
    set(ref(db, key), value)
  }
  return new Promise(function (resolve) {
    chrome.storage.local.get(key, function (items: any) {
      resolve("saved")
    })
  })
}

export const saveHostName = (hostname: string): Promise<string> => {
  return new Promise(function (resolve) {
    set(ref(db, `${HostnameStorage}`), hostname)
    chrome.storage.local.set({ [HostnameStorage]: hostname }, () => {
      resolve("saved")
    })
  })
}
