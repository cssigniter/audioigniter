import React from 'react';
import PropTypes from 'prop-types';
import { CartIcon, DownloadIcon, RefreshIcon } from './Icons';

const TrackButtons = ({
  buyButtonsTarget,
  buyUrl,
  downloadUrl,
  onTrackLoop,
  isLooping,
}) => {
  if (buyUrl == null && downloadUrl == null && !onTrackLoop) {
    return null;
  }

  return (
    <div className="ai-track-control-buttons">
      {buyUrl && (
        <a
          href={buyUrl}
          className="ai-track-btn"
          rel={buyButtonsTarget ? 'noopener noreferrer' : undefined}
          target={buyButtonsTarget ? '_blank' : '_self'}
          role="button"
          aria-label={aiStrings.buy_track}
        >
          <CartIcon />
        </a>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={downloadUrl}
          className="ai-track-btn"
          role="button"
          aria-label={aiStrings.download_track}
        >
          <DownloadIcon />
        </a>
      )}

      {onTrackLoop && (
        // eslint-disable-next-line
        <a
          href="#"
          className="ai-track-btn"
          role="button"
          aria-label={aiStrings.toggle_track_repeat}
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
  onTrackLoop: PropTypes.func,
  isLooping: PropTypes.bool,
};

export default TrackButtons;
