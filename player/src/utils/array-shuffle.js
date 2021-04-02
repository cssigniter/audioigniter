/**
 * Shuffles an array.
 * Copied from https://github.com/sindresorhus/array-shuffle
 *
 * @param {Array} array The array to be shuffled.
 * @returns {*[]|*}
 */
const arrayShuffle = array => {
  if (!Array.isArray(array)) {
    return array;
  }

  const clone = [...array];

  // eslint-disable-next-line no-plusplus
  for (let index = clone.length - 1; index > 0; index--) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[newIndex]] = [clone[newIndex], clone[index]];
  }

  return clone;
};

export default arrayShuffle;
