/**
 * Simple throttling function.
 *
 * @param {Function} fn The function to throttle.
 * @param {number} limit The limit in milliseconds.
 * @returns {(function(*): void)|*}
 */
const throttle = (fn, limit) => {
  let waiting = false;
  return function throttleCallback(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

export default throttle;
