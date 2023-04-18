import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import Tracklist from './Tracklist';

const propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeTrackIndex: PropTypes.number.isRequired,
  onTrackClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  trackClassName: PropTypes.string,
  reverseTrackOrder: PropTypes.bool,
  displayTrackNo: PropTypes.bool,
  limitTracklistHeight: PropTypes.bool,
  tracklistHeight: PropTypes.number,
  displayBuyButtons: PropTypes.bool,
  buyButtonsTarget: PropTypes.bool,
  displayCovers: PropTypes.bool,
  displayArtistNames: PropTypes.bool,
  onTrackLoop: PropTypes.func,
  repeatingTrackIndex: PropTypes.number,
  playerId: PropTypes.string,
};

const TracklistWrap = ({
  isOpen,
  limitTracklistHeight,
  tracklistHeight,
  tracks,
  activeTrackIndex,
  onTrackClick,
  onTrackLoop,
  className,
  reverseTrackOrder,
  trackClassName,
  displayTrackNo,
  displayBuyButtons,
  buyButtonsTarget,
  displayCovers,
  displayArtistNames,
  repeatingTrackIndex,
  playerId,
}) => {
  const scrollbarRef = useRef(null);

  const isTrackVisible = trackIndex => {
    const trackHeight = scrollbarRef.current.getScrollHeight() / tracks.length;
    const trackPosition = trackHeight * trackIndex;
    const scrollTop = scrollbarRef.current.getScrollTop();
    const scrollBottom = scrollTop + scrollbarRef.current.getClientHeight();

    return !(trackPosition < scrollTop || trackPosition > scrollBottom);
  };

  const scrollToTrack = trackIndex => {
    const trackHeight = scrollbarRef.current.getScrollHeight() / tracks.length;

    if (!isTrackVisible(trackIndex)) {
      scrollbarRef.current.scrollTop(trackHeight * trackIndex);
    }
  };

  useEffect(() => {
    if (limitTracklistHeight) {
      scrollToTrack(activeTrackIndex);
    }
  }, [activeTrackIndex, limitTracklistHeight]);

  const renderTracklist = () => {
    return (
      <Tracklist
        tracks={tracks}
        activeTrackIndex={activeTrackIndex}
        onTrackClick={onTrackClick}
        className={className}
        trackClassName={trackClassName}
        reverseTrackOrder={reverseTrackOrder}
        displayTrackNo={displayTrackNo}
        displayBuyButtons={displayBuyButtons}
        buyButtonsTarget={buyButtonsTarget}
        displayCovers={displayCovers}
        displayArtistNames={displayArtistNames}
        onTrackLoop={onTrackLoop}
        repeatingTrackIndex={repeatingTrackIndex}
        playerId={playerId}
      />
    );
  };

  return (
    <div id="tracklisting" style={{ display: isOpen ? 'block' : 'none' }}>
      {limitTracklistHeight ? (
        <Scrollbars
          className="ai-scroll-wrap"
          ref={scrollbarRef} // eslint-disable-line no-return-assign
          style={{ height: tracklistHeight }}
        >
          {renderTracklist()}
        </Scrollbars>
      ) : (
        renderTracklist()
      )}
    </div>
  );
};

TracklistWrap.propTypes = propTypes;

export default TracklistWrap;
