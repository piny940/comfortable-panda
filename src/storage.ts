function loadFromLocalStorage(key: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, function (items: any) {
      if (typeof items[key] === "undefined") resolve([]);
      else resolve(items[key]);
    });
  });
}

function saveToLocalStorage(key: string, value: any): Promise<any> {
  const entity: { [key: string]: [value: any] } = {};
  entity[key] = value;
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(entity, () => {
      resolve("saved");
    });
  });
}

export { loadFromLocalStorage, saveToLocalStorage };
