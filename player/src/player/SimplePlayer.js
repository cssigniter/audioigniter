import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import soundProvider from './soundProvider';
import Tracklist from './components/Tracklist';

class SimplePlayer extends React.Component {
	render() {
		const { playStatus } = this.props;
		const activeIndex = playStatus === Sound.status.PLAYING || playStatus === Sound.status.PAUSED
			? this.props.activeIndex
			: undefined;

		return (
			<div
				className="ai-wrap"
				style={{ maxWidth: this.props.maxWidth }}
			>
				<div className="ai-tracklist">
					<Tracklist
						tracks={this.props.tracks}
						activeTrackIndex={activeIndex}
						onTrackClick={this.props.playTrack}
						className="ai-tracklist"
						trackClassName="ai-track"
						reverseTrackOrder={this.props.reverseTrackOrder}
						displayTrackNo={this.props.displayTrackNo}
						displayBuyButtons={this.props.displayBuyButtons}
						buyButtonsTarget={this.props.buyButtonsTarget}
						displayArtistNames={this.props.displayArtistNames}
					/>
				</div>
			</div>
		);
	}
}

SimplePlayer.propTypes = {
	tracks: PropTypes.arrayOf(PropTypes.object),
	playStatus: PropTypes.oneOf([
		Sound.status.PLAYING,
		Sound.status.PAUSED,
		Sound.status.STOPPED
	]),
	activeIndex: PropTypes.number,
	position: PropTypes.number,
	duration: PropTypes.number,
	playTrack: PropTypes.func.isRequired,
	setPosition: PropTypes.func.isRequired,

	maxWidth: PropTypes.string,
	reverseTrackOrder: PropTypes.bool,
	displayTrackNo: PropTypes.bool,
	buyButtonsTarget: PropTypes.bool,
	displayArtistNames: PropTypes.bool,
	displayBuyButtons: PropTypes.bool,
	displayCredits: PropTypes.bool
};

export default soundProvider(SimplePlayer);
