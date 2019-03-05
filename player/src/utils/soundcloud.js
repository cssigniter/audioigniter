export default class SoundCloud {
  constructor(clientId) {
    if (!clientId) {
      throw new Error('SoundCloud client ID is required');
    }

    this.clientId = clientId;
    this.baseUrl = 'https://api.soundcloud.com';
  }

  /**
   * Checks if a URL is from SoundCloud
   *
   * @param {string} url - URL to be checked
   *
   * @returns {boolean}
   */
  static isSoundCloudUrl(url) {
    return url.indexOf('soundcloud.com') > -1;
  }

  /**
   * Resolves a SoundCloud URL into a track object
   *
   * @param {string} url - URL to be resolved
   *
   * @returns {Promise.<*>}
   */
  resolve(url) {
    /*
     * Tell the SoundCloud API not to serve a redirect. This is to get around
     * CORS issues on Safari 7+, which likes to send pre-flight requests
     * before following redirects, which has problems.
     *
     * https://github.com/soundcloud/soundcloud-javascript/issues/27
     */
    const statusCodeMap = encodeURIComponent('_status_code_map[302]=200');

    return fetch(
      `${this.baseUrl}/resolve?url=${url}&client_id=${
        this.clientId
      }&${statusCodeMap}`,
    )
      .then(res => res.json())
      .then(res => fetch(res.location))
      .then(res => res.json());
  }

  /**
   * Resolves and fetches SoundCloud track objects
   *
   * @param {Object[]} tracks - Tracks object
   *
   * @returns {Promise.<*>}
   */
  fetchSoundCloudStreams(tracks) {
    const scTracks = tracks
      .filter(track => SoundCloud.isSoundCloudUrl(track.audio))
      .map(track => this.resolve(track.audio));

    return Promise.all(scTracks);
  }

  /**
   * Maps a SoundCloud tracks object into an AudioIgniter one
   * by replacing `track.audio` with `sctrack.stream_url`.
   *
   * Works *in order* of appearance in the `tracks` object.
   *
   * @param {Object[]} tracks - AudioIgniter tracks object
   * @param {Object[]} scTracks - SoundCloud tracks object
   *
   * @returns {Object[]}
   */
  mapStreamsToTracks(tracks, scTracks) {
    let i = 0;

    return tracks.map(track => {
      if (SoundCloud.isSoundCloudUrl(track.audio)) {
        // eslint-disable-next-line no-param-reassign
        track.audio = `${scTracks[i].stream_url}?client_id=${this.clientId}`;
        i++; // eslint-disable-line no-plusplus
      }

      return track;
    });
  }
}
