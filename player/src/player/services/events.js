/* global aiStats */

import isStreamTrack from '../../utils/isStreamTrack';

/**
 * @enum EVENT
 * @type {{PAUSE: string, PLAY: string, STOP: string, DOWNLOAD: string, SEEK: string}}
 */
export const EVENT = {
  PLAY: 'PLAY',
  PLAYING: 'PLAYING',
  PAUSE: 'PAUSE',
  STOP: 'STOP',
  SEEK: 'SEEK',
  DOWNLOAD: 'DOWNLOAD',
};

/**
 * Normalizes a player ID.
 *
 * @param {String} playerId The player ID
 * @returns {string|null}
 */
export const normalizePlayerId = playerId => {
  return playerId?.replace('audioigniter-', '') ?? null;
};

/**
 * Takes state and props from soundProvider and returns the formatted event data.
 * @param state
 * @param props
 * @returns {{duration, position, trackUrl: *, playerId: *}}
 */
export const getEventMeta = (state, props) => {
  const { activeIndex, tracks, position, duration } = state;
  const { playerId } = props;
  const track = tracks[activeIndex];
  const { title, subtitle, audio } = track ?? {};

  return {
    trackUrl: audio,
    // trackName: subtitle ? `${title} - ${subtitle}` : title,
    trackTitle: title,
    trackArtist: subtitle ?? '',
    playerId: normalizePlayerId(playerId),
    position,
    duration,
    isStream: isStreamTrack(audio),
  };
};

class AudioIgniterEvents {
  constructor() {
    this.clientId = null;
    this.queue = [];

    if (!window.aiStats?.enabled) {
      return;
    }

    this.eventQueueTimer();
    this.initializeFingerprint();

    // Flush the entire queue when the user ends their session.
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.eventQueueFlush();
      }
    });
  }

  initializeFingerprint = async () => {
    const FingerprintJS = await import(/* webpackChunkName: "fingerprintjs" */ '@fingerprintjs/fingerprintjs');
    const fingerprint = await FingerprintJS.load();
    const result = await fingerprint.get();
    this.clientId = result.visitorId;
  };

  fetch = async () => {
    const headers = {
      type: 'application/json',
    };
    const blob = new Blob([JSON.stringify(this.queue)], headers);
    navigator.sendBeacon(`${aiStats.apiUrl}/log`, blob);
  };

  eventQueueTimer = () => {
    setInterval(() => {
      if (this.queue.length > 0) {
        this.eventQueueFlush();
      }
    }, 15000);
  };

  eventQueueFlush = async () => {
    await this.fetch();
    this.queue = [];
  };

  eventTrack = ({
    event,
    trackUrl,
    // trackName,
    trackTitle,
    trackArtist,
    playerId,
    position,
    oldPosition,
    duration,
    isStream,
  }) => {
    if (!window.aiStats?.enabled) {
      return;
    }

    // Failsafe for multi sound pausing, some tracks
    // can be paused before they start due to external
    // soundManager pausing (see playTrack event in soundProvider.js).
    if (event === EVENT.PAUSE && position === 0) {
      return;
    }

    this.queue.push({
      event,
      track_url: trackUrl,
      // track_name: trackName,
      track_title: trackTitle,
      track_artist: trackArtist,
      playlist_id: parseInt(playerId, 10),
      timestamp: new Date().getTime(),
      referrer_url: window.location.href,
      event_data: {
        position: Math.floor(position / 1000) ?? null,
        old_position:
          oldPosition != null ? Math.floor(oldPosition / 1000) : null,
        duration: duration ? Math.floor(duration / 1000) : null,
      },
      client_fingerprint: this.clientId,
      is_stream: isStream,
    });
  };
}

export default new AudioIgniterEvents();
