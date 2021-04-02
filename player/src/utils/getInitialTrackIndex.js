/**
 * Fetches the initial track index.
 *
 * @param {Object} options The options.
 * @param {Array} options.tracks The tracks.
 * @param {number} [options.initialTrack] The initial track index.
 * @param {boolean} options.reverseTrackOrder Whether the track order is reversed.
 * @returns {number}
 */
import arrayShuffle from './array-shuffle';
import arrayShift from './array-shift';

export const getInitialTrackIndex = ({
  tracks = [],
  initialTrack = 1,
  reverseTrackOrder = false,
}) => {
  // The user provides a 1-index value.
  const initialTrackIndex = initialTrack - 1;

  if (!tracks.length || !initialTrack || initialTrack > tracks.length) {
    return 0;
  }

  if (reverseTrackOrder) {
    return Math.max(tracks.length - initialTrack, 0);
  }

  return initialTrackIndex;
};

/**
 * Fetches the initial track index and the initial track queue.
 *
 * @param {Object} options The options.
 * @param {Array} options.tracks The tracks.
 * @param {Number} options.initialTrack The initial track number (1-indexed).
 * @param {Boolean} reverseTrackOrder Whether the track order is reversed.
 * @param {Boolean} shuffle Whether the track queue is shuffled.
 * @returns {{activeIndex: number, trackQueue: (*[]|*)}|{activeIndex: number, trackQueue: *}}
 */
export const getInitialTrackQueueAndIndex = ({
  tracks = [],
  initialTrack = 1,
  reverseTrackOrder = false,
  shuffle = false,
}) => {
  const activeIndex = getInitialTrackIndex({
    tracks,
    initialTrack,
    reverseTrackOrder,
  });

  const orderedTrackIndexes = tracks.map((_, index) => index);

  if (!shuffle) {
    const shiftAmount = orderedTrackIndexes.indexOf(activeIndex);
    return {
      activeIndex,
      trackQueue: arrayShift(orderedTrackIndexes, 0, shiftAmount),
    };
  }

  const shuffledQueue = arrayShuffle(orderedTrackIndexes);

  // Always bring the initial track (activeIndex) to the front of the queue.
  shuffledQueue.splice(shuffledQueue.indexOf(activeIndex), 1);
  shuffledQueue.unshift(activeIndex);

  return {
    activeIndex,
    trackQueue: shuffledQueue,
  };
};

export default getInitialTrackIndex;
