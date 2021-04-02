import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import Track from './Track';

const Tracklist = ({ ...props }) => {
  const { tracks } = props;

  return (
    <ul className={props.className} aria-expanded="true">
      {tracks &&
        tracks.map((track, index) => {
          const trackNo = props.reverseTrackOrder
            ? tracks.length - index
            : index + 1;
          const isLooping = index === props.repeatingTrackIndex;

          return (
            <Track
              key={index}
              track={track}
              index={index}
              trackNo={props.displayTrackNo ? trackNo : undefined}
              playStatus={props.playStatus}
              isActive={props.activeTrackIndex === index}
              buyButtonsTarget={props.buyButtonsTarget}
              displayArtistNames={props.displayArtistNames}
              displayBuyButtons={props.displayBuyButtons}
              displayCovers={props.displayCovers}
              onTrackClick={props.onTrackClick}
              onTrackLoop={props.onTrackLoop}
              setPosition={props.setPosition}
              duration={props.duration}
              position={props.position}
              className={props.trackClassName}
              isStandalone={props.standaloneTracks}
              isLooping={isLooping}
              playbackRate={props.playbackRate}
              setPlaybackRate={props.setPlaybackRate}
              allowPlaybackRate={props.allowPlaybackRate}
              buffering={props.buffering}
            />
          );
        })}
    </ul>
  );
};

Tracklist.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  playStatus: PropTypes.oneOf([
    Sound.status.PLAYING,
    Sound.status.PAUSED,
    Sound.status.STOPPED,
  ]),
  activeTrackIndex: PropTypes.number,
  position: PropTypes.number,
  duration: PropTypes.number,
  setPosition: PropTypes.func,
  standaloneTracks: PropTypes.bool,
  onTrackClick: PropTypes.func.isRequired,
  onTrackLoop: PropTypes.func,
  className: PropTypes.string,
  trackClassName: PropTypes.string,
  reverseTrackOrder: PropTypes.bool,
  displayTrackNo: PropTypes.bool,
  displayBuyButtons: PropTypes.bool,
  buyButtonsTarget: PropTypes.bool,
  displayCovers: PropTypes.bool,
  displayArtistNames: PropTypes.bool,
  playbackRate: PropTypes.number,
  setPlaybackRate: PropTypes.func,
  allowPlaybackRate: PropTypes.bool,
  buffering: PropTypes.bool,
};

export default Tracklist;
