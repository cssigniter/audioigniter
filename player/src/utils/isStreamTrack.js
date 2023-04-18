/**
 * Determines whether a given url is that of a stream or not.
 *
 * @param {string} url The url.
 * @returns {boolean}
 */
const isStreamTrack = url => {
  const extensions = ['.mp3', '.flac', '.amr', '.aac', '.oga', '.wav', '.wma'];
  return !extensions.some(extension => url.includes(extension));
};

export default isStreamTrack;
