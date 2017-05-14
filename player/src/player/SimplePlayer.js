import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import soundProvider from './soundProvider';
import Tracklist from './components/Tracklist';

const SimplePlayer = props => {
	const { playStatus } = props;
	const activeIndex = (playStatus === Sound.status.PLAYING || playStatus === Sound.status.PAUSED)
		? props.activeIndex
		: undefined;

	return (
		<div className="ai-wrap ai-type-simple" style={{ maxWidth: props.maxWidth }}>
			<div className="ai-tracklist ai-tracklist-open">
				<Tracklist
					tracks={props.tracks}
					playStatus={props.playStatus}
					activeTrackIndex={activeIndex}
					onTrackClick={props.togglePlay}
					setPosition={props.setPosition}
					duration={props.duration}
					position={props.position}
					className="ai-tracklist"
					trackClassName="ai-track"
					reverseTrackOrder={props.reverseTrackOrder}
					displayTrackNo={props.displayTrackNo}
					displayBuyButtons={props.displayBuyButtons}
					buyButtonsTarget={props.buyButtonsTarget}
					displayArtistNames={props.displayArtistNames}
					standaloneTracks
				/>
			</div>

			{props.displayCredits &&
				<div className="ai-footer">
					<p>Powered by <a href="https://www.cssigniter.com/ignite/plugins/audioigniter?utm_source=player&utm_medium=link&utm_content=audioigniter&utm_campaign=footer-link" target="_blank" rel="noopener noreferrer">AudioIgniter</a></p>
				</div>
			}
		</div>
	);
};

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
	setPosition: PropTypes.func.isRequired,
	togglePlay: PropTypes.func.isRequired,

	maxWidth: PropTypes.string,
	reverseTrackOrder: PropTypes.bool,
	displayTrackNo: PropTypes.bool,
	buyButtonsTarget: PropTypes.bool,
	displayArtistNames: PropTypes.bool,
	displayBuyButtons: PropTypes.bool,
	displayCredits: PropTypes.bool
};

export default soundProvider(SimplePlayer, {
	onFinishedPlaying(props) {
		if (props.cycleTracks) {
			return props.nextTrack();
		}

		if (props.activeIndex !== props.tracks.length - 1) {
			props.nextTrack();
		}

		return undefined;
	}
});
