import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CartIcon, DownloadIcon, LyricsIcon, RefreshIcon } from './Icons';

const TrackButtons = ({
  buyButtonsTarget,
  buyUrl,
  downloadUrl,
  downloadFilename,
  onTrackLoop,
  isLooping,
  displayBuyButtons,
  onOpenTrackLyrics,
  setPlaybackRate,
  playbackRate,
  allowPlaybackRate,
  isPlaying,
}) => {
  if (
    buyUrl == null &&
    downloadUrl == null &&
    !onTrackLoop &&
    !onOpenTrackLyrics
  ) {
    return null;
  }

  return (
    <div className="ai-track-control-buttons">
      {buyUrl && displayBuyButtons && (
        <a
          href={buyUrl}
          className="ai-track-btn"
          rel={buyButtonsTarget ? 'noopener noreferrer' : undefined}
          target={buyButtonsTarget ? '_blank' : '_self'}
          role="button"
          aria-label={aiStrings.buy_track}
          title={aiStrings.buy_track}
        >
          <CartIcon />
        </a>
      )}

      {downloadUrl && downloadFilename && displayBuyButtons && (
        <a
          href={downloadUrl}
          download={downloadFilename}
          className="ai-track-btn"
          role="button"
          aria-label={aiStrings.download_track}
          title={aiStrings.download_track}
        >
          <DownloadIcon />
        </a>
      )}

      {onOpenTrackLyrics && (
        // eslint-disable-next-line
        <a
          href="#"
          className="ai-track-btn"
          role="button"
          aria-label={aiStrings.open_track_lyrics}
          title={aiStrings.open_track_lyrics}
          onClick={event => {
            event.preventDefault();
            onOpenTrackLyrics();
          }}
        >
          <LyricsIcon />
        </a>
      )}

      {allowPlaybackRate && isPlaying && (
        <a
          href="#"
          className="ai-track-btn ai-btn-playback-rate"
          role="button"
          aria-label={aiStrings.set_playback_rate}
          title={aiStrings.set_playback_rate}
          onClick={event => {
            event.preventDefault();
            setPlaybackRate();
          }}
        >
          <Fragment>&times;{playbackRate}</Fragment>
        </a>
      )}

      {onTrackLoop && (
        // eslint-disable-next-line
        <a
          href="#"
          className="ai-track-btn ai-track-btn-repeat"
          role="button"
          aria-label={aiStrings.toggle_track_repeat}
          title={aiStrings.toggle_track_repeat}
          onClick={event => {
            event.preventDefault();
            onTrackLoop();
          }}
        >
          <span
            style={{
              opacity: isLooping ? 1 : 0.3,
            }}
          >
            <RefreshIcon />
          </span>
        </a>
      )}
    </div>
  );
};

TrackButtons.propTypes = {
  buyButtonsTarget: PropTypes.bool,
  buyUrl: PropTypes.string,
  downloadUrl: PropTypes.string,
  downloadFilename: PropTypes.string,
  onTrackLoop: PropTypes.func,
  isLooping: PropTypes.bool,
  displayBuyButtons: PropTypes.bool,
  onOpenTrackLyrics: PropTypes.func,
  playbackRate: PropTypes.number,
  setPlaybackRate: PropTypes.func,
  allowPlaybackRate: PropTypes.bool,
  isPlaying: PropTypes.bool,
};

export default TrackButtons;
