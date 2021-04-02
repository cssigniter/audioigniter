/**
 * Shifts an array to right / left by n positions.
 *
 * @param {Array} arr The array.
 * @param {number} direction The direction - 0 for left 1 for right.
 * @param {number} n Number of positions to shift by.
 * @returns {any[]}
 */
const arrayShift = (arr, direction, n) => {
  const times = n > arr.length ? n % arr.length : n;
  return arr.concat(arr.splice(0, direction > 0 ? arr.length - times : times));
};

export default arrayShift;
