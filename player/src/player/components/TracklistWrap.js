import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import Tracklist from './Tracklist';

export default class TracklistWrap extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { activeTrackIndex, limitTracklistHeight } = this.props;

    if (
      activeTrackIndex !== nextProps.activeTrackIndex &&
      limitTracklistHeight
    ) {
      this.scrollToTrack(nextProps.activeTrackIndex);
    }
  }

  scrollToTrack(trackIndex) {
    const { tracks } = this.props;
    const trackHeight = this.scrollbarsRef.getScrollHeight() / tracks.length;

    if (!this.isTrackVisible(trackIndex)) {
      this.scrollbarsRef.scrollTop(trackHeight * trackIndex);
    }
  }

  isTrackVisible(trackIndex) {
    const { tracks } = this.props;
    const trackHeight = this.scrollbarsRef.getScrollHeight() / tracks.length;
    const trackPosition = trackHeight * trackIndex;
    const scrollTop = this.scrollbarsRef.getScrollTop();
    const scrollBottom = scrollTop + this.scrollbarsRef.getClientHeight();

    return !(trackPosition < scrollTop || trackPosition > scrollBottom);
  }

  renderTracklist() {
    return (
      <Tracklist
        tracks={this.props.tracks}
        activeTrackIndex={this.props.activeTrackIndex}
        onTrackClick={this.props.onTrackClick}
        className={this.props.className}
        trackClassName={this.props.trackClassName}
        reverseTrackOrder={this.props.reverseTrackOrder}
        displayTrackNo={this.props.displayTrackNo}
        displayBuyButtons={this.props.displayBuyButtons}
        buyButtonsTarget={this.props.buyButtonsTarget}
        displayCovers={this.props.displayCovers}
        displayArtistNames={this.props.displayArtistNames}
        onTrackLoop={this.props.onTrackLoop}
        repeatingTrackIndex={this.props.repeatingTrackIndex}
      />
    );
  }

  render() {
    const { isOpen, limitTracklistHeight, tracklistHeight } = this.props;

    return (
      <div id="tracklisting" style={{ display: isOpen ? 'block' : 'none' }}>
        {limitTracklistHeight ? (
          <Scrollbars
            className="ai-scroll-wrap"
            ref={ref => (this.scrollbarsRef = ref)} // eslint-disable-line no-return-assign
            style={{ height: tracklistHeight }}
          >
            {this.renderTracklist()}
          </Scrollbars>
        ) : (
          this.renderTracklist()
        )}
      </div>
    );
  }
}

TracklistWrap.propTypes = {
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
};
