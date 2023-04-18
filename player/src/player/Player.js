import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import { sprintf } from 'sprintf-js';
import classNames from 'classnames';

import TracklistWrap from './components/TracklistWrap';
import ProgressBar from './components/ProgressBar';
import Time from './components/Time';
import VolumeControl from './components/VolumeControl';
import Button from './components/Button';
import Cover from './components/Cover';
import {
  PlayIcon,
  PauseIcon,
  NextIcon,
  PreviousIcon,
  PlaylistIcon,
  RefreshIcon,
  LyricsIcon,
  ShuffleIcon,
} from './components/Icons';
import soundProvider from './soundProvider';
import { AppContext } from '../App';
import typographyDisabled from '../utils/typography-disabled';
import useComponentSize from '../utils/useComponentSize';
import PlayerButtons from './components/PlayerButtons';

const propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object),
  playStatus: PropTypes.oneOf([
    Sound.status.PLAYING,
    Sound.status.PAUSED,
    Sound.status.STOPPED,
  ]),
  activeIndex: PropTypes.number,
  volume: PropTypes.number,
  position: PropTypes.number,
  duration: PropTypes.number,
  currentTrack: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  playTrack: PropTypes.func.isRequired,
  togglePlay: PropTypes.func.isRequired,
  nextTrack: PropTypes.func.isRequired,
  prevTrack: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired,
  setVolume: PropTypes.func.isRequired,
  toggleTracklistCycling: PropTypes.func.isRequired,
  setTrackCycling: PropTypes.func.isRequired,
  cycleTracks: PropTypes.bool.isRequired,
  displayTracklist: PropTypes.bool,
  allowTracklistToggle: PropTypes.bool,
  allowTracklistLoop: PropTypes.bool,
  allowTrackLoop: PropTypes.bool,
  reverseTrackOrder: PropTypes.bool,
  displayTrackNo: PropTypes.bool,
  displayCredits: PropTypes.bool,
  displayActiveCover: PropTypes.bool,
  displayTracklistCovers: PropTypes.bool,
  limitTracklistHeight: PropTypes.bool,
  tracklistHeight: PropTypes.number,
  displayBuyButtons: PropTypes.bool,
  buyButtonsTarget: PropTypes.bool,
  displayArtistNames: PropTypes.bool,
  maxWidth: PropTypes.string,
  repeatingTrackIndex: PropTypes.number,
  playbackRate: PropTypes.number,
  setPlaybackRate: PropTypes.func,
  skipAmount: PropTypes.number,
  skipPosition: PropTypes.func.isRequired,
  countdownTimerByDefault: PropTypes.bool,
  allowPlaybackRate: PropTypes.bool,
  buffering: PropTypes.bool,
  shuffleEnabled: PropTypes.bool,
  shuffle: PropTypes.bool,
  toggleShuffle: PropTypes.func.isRequired,
  playerButtons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      icon: PropTypes.string,
    }).isRequired,
  ),
  playerId: PropTypes.string,
};

const Player = ({
  tracks,
  playerId,
  playStatus,
  activeIndex,
  volume,
  position,
  duration,
  playbackRate,
  shuffle,
  shuffleEnabled,

  currentTrack,
  playTrack,
  togglePlay,
  nextTrack,
  prevTrack,
  setPosition,
  setVolume,
  setPlaybackRate,
  toggleTracklistCycling,
  cycleTracks,
  toggleShuffle,

  allowTracklistToggle,
  allowTracklistLoop,
  allowPlaybackRate,
  allowTrackLoop,
  setTrackCycling,
  reverseTrackOrder,
  displayTrackNo,
  displayTracklist,
  displayTracklistCovers,
  displayActiveCover,
  displayCredits,
  limitTracklistHeight,
  tracklistHeight,
  displayBuyButtons,
  buyButtonsTarget,
  displayArtistNames,
  maxWidth,
  repeatingTrackIndex,
  skipAmount,
  skipPosition,
  countdownTimerByDefault,
  buffering,
  playerButtons,
}) => {
  const ref = useRef(null);
  const [isTrackListOpen, setTracklistOpen] = useState(displayTracklist);
  const { width } = useComponentSize(ref);

  const isNarrowContext = () => {
    return width != null && width < 480 && window.innerWidth > 480;
  };

  const toggleTracklist = () => {
    setTracklistOpen(x => !x);
  };

  const classes = classNames({
    'ai-wrap': true,
    'ai-type-full': true,
    'ai-is-loading': !tracks.length,
    'ai-narrow': isNarrowContext(),
    'ai-with-typography': !typographyDisabled(),
  });

  const audioControlClasses = classNames({
    'ai-audio-control': true,
    'ai-audio-playing': playStatus === Sound.status.PLAYING,
    'ai-audio-loading': buffering,
  });

  return (
    <div ref={ref} className={classes} style={{ maxWidth }}>
      <div className="ai-control-wrap">
        {displayActiveCover && (
          <Cover
            className="ai-thumb ai-control-wrap-thumb"
            src={currentTrack.cover}
            alt={currentTrack.title}
          />
        )}

        <div className="ai-control-wrap-controls">
          <div className="ai-audio-controls-main">
            <Button
              onClick={togglePlay}
              className={audioControlClasses}
              ariaLabel={
                playStatus === Sound.status.PLAYING
                  ? sprintf(aiStrings.pause_title, currentTrack.title)
                  : sprintf(aiStrings.play_title, currentTrack.title)
              }
              ariaPressed={playStatus === Sound.status.PLAYING}
            >
              {playStatus === Sound.status.PLAYING ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}

              <span className="ai-control-spinner" />
            </Button>

            <div className="ai-track-info">
              <p className="ai-track-title">
                <span>{currentTrack.title}</span>
              </p>
              {(tracks.length === 0 || currentTrack.subtitle) &&
                displayArtistNames && (
                  <p className="ai-track-subtitle">
                    <span>{currentTrack.subtitle}</span>
                  </p>
                )}
            </div>
          </div>

          <div className="ai-audio-controls-progress">
            <ProgressBar
              setPosition={setPosition}
              duration={duration}
              position={position}
            />

            <Time
              duration={duration}
              position={position}
              countdown={countdownTimerByDefault}
            />
          </div>

          <div className="ai-audio-controls-meta">
            {tracks.length > 1 && (
              <Button
                className="ai-btn ai-tracklist-prev"
                onClick={prevTrack}
                ariaLabel={aiStrings.previous}
                title={aiStrings.previous}
              >
                <PreviousIcon />
              </Button>
            )}

            {tracks.length > 1 && (
              <Button
                className="ai-btn ai-tracklist-next"
                onClick={nextTrack}
                ariaLabel={aiStrings.next}
                title={aiStrings.next}
              >
                <NextIcon />
              </Button>
            )}

            <VolumeControl
              volume={volume}
              // eslint-disable-next-line no-shadow
              setVolume={setVolume}
            />

            {allowTracklistLoop && (
              <Button
                className={`ai-btn ai-btn-repeat ${cycleTracks &&
                  'ai-btn-active'}`}
                onClick={toggleTracklistCycling}
                ariaLabel={aiStrings.toggle_list_repeat}
              >
                <RefreshIcon />
              </Button>
            )}

            {shuffleEnabled && (
              <Button
                className={`ai-btn ai-btn-shuffle ${shuffle &&
                  'ai-btn-active'}`}
                onClick={toggleShuffle}
                ariaLabel={aiStrings.shuffle}
              >
                <ShuffleIcon />
              </Button>
            )}

            {allowPlaybackRate && (
              <Button
                className="ai-btn ai-btn-playback-rate"
                onClick={setPlaybackRate}
                ariaLabel={aiStrings.set_playback_rate}
              >
                <Fragment>&times;{playbackRate}</Fragment>
              </Button>
            )}

            {skipAmount > 0 && (
              <Fragment>
                <Button
                  className="ai-btn ai-btn-skip-position"
                  onClick={() => skipPosition(-1)}
                  ariaLabel={aiStrings.skip_backward}
                >
                  -{skipAmount}s
                </Button>
                <Button
                  className="ai-btn ai-btn-skip-position"
                  onClick={() => skipPosition(1)}
                  ariaLabel={aiStrings.skip_forward}
                >
                  +{skipAmount}s
                </Button>
              </Fragment>
            )}

            {currentTrack && currentTrack.lyrics && !isTrackListOpen && (
              <AppContext.Consumer>
                {({ toggleLyricsModal }) => (
                  <Button
                    className="ai-btn ai-lyrics"
                    onClick={() => toggleLyricsModal(true, currentTrack)}
                    ariaLabel={aiStrings.open_track_lyrics}
                    title={aiStrings.open_track_lyrics}
                  >
                    <LyricsIcon />
                  </Button>
                )}
              </AppContext.Consumer>
            )}

            {allowTracklistToggle && (
              <Button
                className="ai-btn ai-tracklist-toggle"
                onClick={toggleTracklist}
                ariaLabel={aiStrings.toggle_list_visible}
                ariaExpanded={isTrackListOpen}
              >
                <PlaylistIcon />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`ai-tracklist-wrap ${
          isTrackListOpen ? 'ai-tracklist-open' : ''
        }`}
      >
        <TracklistWrap
          className="ai-tracklist"
          trackClassName="ai-track"
          tracks={tracks}
          activeTrackIndex={activeIndex}
          isOpen={isTrackListOpen}
          displayTrackNo={displayTrackNo}
          displayCovers={displayTracklistCovers}
          displayBuyButtons={displayBuyButtons}
          buyButtonsTarget={buyButtonsTarget}
          displayArtistNames={displayArtistNames}
          reverseTrackOrder={reverseTrackOrder}
          limitTracklistHeight={limitTracklistHeight}
          tracklistHeight={tracklistHeight}
          onTrackClick={playTrack}
          onTrackLoop={allowTrackLoop ? setTrackCycling : undefined}
          repeatingTrackIndex={repeatingTrackIndex}
          playerId={playerId}
        />
      </div>

      {playerButtons?.length > 0 && <PlayerButtons buttons={playerButtons} />}

      {displayCredits && (
        <div className="ai-footer">
          <p>
            Powered by{' '}
            <a
              href="https://www.cssigniter.com/plugins/audioigniter?utm_source=player&utm_medium=link&utm_content=audioigniter&utm_campaign=footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              AudioIgniter
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

Player.propTypes = propTypes;

export default soundProvider(Player, {
  onFinishedPlaying(props) {
    const {
      repeatingTrackIndex,
      cycleTracks,
      nextTrack,
      activeIndex,
      playTrack,
      trackQueue,
    } = props;

    if (repeatingTrackIndex != null) {
      playTrack(repeatingTrackIndex);
      return;
    }

    if (cycleTracks) {
      nextTrack();
      return;
    }

    // Check if not the last track
    if (activeIndex !== trackQueue[trackQueue.length - 1]) {
      nextTrack();
    }
  },
});
