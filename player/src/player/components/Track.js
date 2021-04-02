import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import { sprintf } from 'sprintf-js';
import classNames from 'classnames';

import TrackTitle from './TrackTitle';
import Cover from './Cover';
import TrackButtons from './TrackButtons';
import ProgressBar from './ProgressBar';
import { PlayIcon, PauseIcon } from './Icons';
import { AppContext } from '../../App';

const Track = ({
  track,
  index,
  trackNo,
  isActive,
  playStatus,
  duration,
  position,
  setPosition,
  isStandalone,
  buyButtonsTarget,
  displayArtistNames,
  displayCovers,
  displayBuyButtons,
  onTrackClick,
  onTrackLoop,
  className,
  isLooping,
  playbackRate,
  setPlaybackRate,
  allowPlaybackRate,
  buffering,
}) => {
  const { toggleLyricsModal } = useContext(AppContext);
  const isPlaying = isActive && playStatus === Sound.status.PLAYING;
  const hasProgressBar =
    typeof position !== 'undefined' &&
    typeof duration !== 'undefined' &&
    isActive &&
    isStandalone;
  const classes = classNames({
    [className]: !!className,
    'ai-track-active': isActive,
    'ai-track-loading': isActive && buffering,
  });

  return (
    <li className={classes}>
      {displayCovers && (
        <Cover
          className="ai-track-thumb"
          src={track.cover}
          alt={track.title}
          onClick={() => onTrackClick(index)}
        />
      )}

      {isStandalone && (
        <button
          className={classNames({
            'ai-track-btn ai-track-inline-play-btn': true,
            'ai-is-loading': isActive && buffering,
          })}
          onClick={() => onTrackClick(index)}
          aria-label={
            isPlaying
              ? sprintf(aiStrings.pause_title, track.title)
              : sprintf(aiStrings.play_title, track.title)
          }
          aria-pressed={isPlaying}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          <spin className="ai-track-spinner" />
        </button>
      )}

      <div className="ai-track-control" onClick={() => onTrackClick(index)}>
        <TrackTitle
          className="ai-track-name"
          track={track}
          trackNo={trackNo}
          displayArtistNames={displayArtistNames}
        />
      </div>

      <TrackButtons
        buyButtonsTarget={buyButtonsTarget}
        buyUrl={track.buyUrl}
        downloadUrl={track.downloadUrl}
        downloadFilename={track.downloadFilename}
        onTrackLoop={onTrackLoop && (() => onTrackLoop(index))}
        isLooping={isLooping}
        displayBuyButtons={displayBuyButtons}
        onOpenTrackLyrics={
          track.lyrics && (() => toggleLyricsModal(true, track))
        }
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
        allowPlaybackRate={allowPlaybackRate}
        isPlaying={isPlaying}
      />

      {hasProgressBar && (
        <ProgressBar
          setPosition={setPosition}
          duration={duration}
          position={position}
        />
      )}
    </li>
  );
};

Track.propTypes = {
  track: PropTypes.shape({
    audio: PropTypes.string,
    buyUrl: PropTypes.string,
    cover: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    lyrics: PropTypes.string,
    downloadUrl: PropTypes.string,
  }),
  index: PropTypes.number.isRequired,
  trackNo: PropTypes.number,
  isActive: PropTypes.bool,
  position: PropTypes.number,
  duration: PropTypes.number,
  setPosition: PropTypes.func,
  playStatus: PropTypes.oneOf([
    Sound.status.PLAYING,
    Sound.status.PAUSED,
    Sound.status.STOPPED,
  ]),
  onTrackClick: PropTypes.func.isRequired,
  onTrackLoop: PropTypes.func,
  className: PropTypes.string.isRequired,
  isStandalone: PropTypes.bool,
  buyButtonsTarget: PropTypes.bool,
  displayArtistNames: PropTypes.bool,
  displayCovers: PropTypes.bool,
  displayBuyButtons: PropTypes.bool,
  isLooping: PropTypes.bool,
  playbackRate: PropTypes.number,
  setPlaybackRate: PropTypes.func,
  allowPlaybackRate: PropTypes.bool,
  buffering: PropTypes.bool,
};

export default Track;
