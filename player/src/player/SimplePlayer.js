import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import classNames from 'classnames';

import soundProvider from './soundProvider';
import Tracklist from './components/Tracklist';
import typographyDisabled from '../utils/typography-disabled';

const SimplePlayer = props => {
  const { playStatus } = props;
  const activeIndex =
    playStatus === Sound.status.PLAYING || playStatus === Sound.status.PAUSED
      ? props.activeIndex
      : undefined;

  const classes = classNames({
    'ai-wrap': true,
    'ai-type-simple': true,
    'ai-with-typography': !typographyDisabled(),
  });

  return (
    <div className={classes} style={{ maxWidth: props.maxWidth }}>
      <div className="ai-tracklist ai-tracklist-open">
        <Tracklist
          tracks={props.tracks}
          playStatus={props.playStatus}
          activeTrackIndex={activeIndex}
          onTrackClick={props.togglePlay}
          setPosition={props.setPosition}
          duration={props.duration}
          position={props.position}
          playbackRate={props.playbackRate}
          className="ai-tracklist"
          trackClassName="ai-track"
          reverseTrackOrder={props.reverseTrackOrder}
          displayTrackNo={props.displayTrackNo}
          displayBuyButtons={props.displayBuyButtons}
          buyButtonsTarget={props.buyButtonsTarget}
          displayArtistNames={props.displayArtistNames}
          standaloneTracks
          onTrackLoop={props.allowTrackLoop ? props.setTrackCycling : undefined}
          repeatingTrackIndex={props.repeatingTrackIndex}
          setPlaybackRate={props.setPlaybackRate}
          allowPlaybackRate={props.allowPlaybackRate}
          buffering={props.buffering}
        />
      </div>

      {props.displayCredits && (
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

SimplePlayer.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object),
  playStatus: PropTypes.oneOf([
    Sound.status.PLAYING,
    Sound.status.PAUSED,
    Sound.status.STOPPED,
  ]),
  activeIndex: PropTypes.number,
  position: PropTypes.number,
  duration: PropTypes.number,
  setPosition: PropTypes.func.isRequired,
  togglePlay: PropTypes.func.isRequired,
  setTrackCycling: PropTypes.func.isRequired,
  allowTrackLoop: PropTypes.bool,

  maxWidth: PropTypes.string,
  reverseTrackOrder: PropTypes.bool,
  displayTrackNo: PropTypes.bool,
  buyButtonsTarget: PropTypes.bool,
  displayArtistNames: PropTypes.bool,
  displayBuyButtons: PropTypes.bool,
  displayCredits: PropTypes.bool,
  repeatingTrackIndex: PropTypes.number,
  playbackRate: PropTypes.number,
  setPlaybackRate: PropTypes.func,
  allowPlaybackRate: PropTypes.bool,
  buffering: PropTypes.bool,
};

export default soundProvider(SimplePlayer, {
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
