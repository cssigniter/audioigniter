/**
 * Very basic local storage facade with the ability to store objects.
 *
 * @type {{set: playerStorage.set, get: ((function(*): (undefined))|*)}}
 */
const playerStorage = {
  set: (key, value) => {
    if (!key || !value) {
      return;
    }

    if (typeof value === 'object') {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.setItem(key, value);
    }
  },
  get: key => {
    const value = localStorage.getItem(key);

    if (!value) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(value);

      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      return value;
    }

    return value;
  },
};

export default playerStorage;
