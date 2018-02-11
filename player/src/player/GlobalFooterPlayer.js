import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import { sprintf } from 'sprintf-js';

import soundProvider from './soundProvider';
import Cover from './components/Cover';
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import Time from './components/Time';
import VolumeControl from './components/VolumeControl';
import TracklistWrap from './components/TracklistWrap';
import {
	PlayIcon,
	PauseIcon,
	NextIcon,
	PreviousIcon,
	PlaylistIcon,
	RefreshIcon
} from './components/Icons';

class GlobalFooterPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isTrackListOpen: this.props.displayTracklist
		};

		this.toggleTracklist = this.toggleTracklist.bind(this);
	}

	toggleTracklist() {
		this.setState(state => ({
			isTrackListOpen: !state.isTrackListOpen
		}));
	}

	render() {
		const { isTrackListOpen } = this.state;

		const {
			tracks,
			playStatus,
			activeIndex,
			volume,
			position,
			duration,

			currentTrack,
			playTrack,
			togglePlay,
			nextTrack,
			prevTrack,
			setPosition,
			setVolume,
			toggleTrackCycling,
			cycleTracks,

			reverseTrackOrder,
			displayTrackNo,
			displayTracklistCovers,
			displayActiveCover,
			limitTracklistHeight,
			tracklistHeight,
			displayBuyButtons,
			buyButtonsTarget,
			displayArtistNames
		} = this.props;

		return (
			<div
				ref={ref => this.root = ref} // eslint-disable-line no-return-assign
				className={`ai-wrap ai-type-global-footer ${tracks.length ? '' : 'ai-is-loading'}`}
			>
				<div className="ai-control-wrap">
					{displayActiveCover &&
						<Cover
							className="ai-thumb ai-control-wrap-thumb"
							src={currentTrack.cover}
							alt={currentTrack.title}
						/>
					}

					<div className="ai-control-wrap-controls">
						<ProgressBar
							setPosition={setPosition}
							duration={duration}
							position={position}
						/>

						<div className="ai-audio-controls-main">
							<Button
								onClick={togglePlay}
								className={`ai-audio-control ${playStatus === Sound.status.PLAYING ? 'ai-audio-playing' : ''}`}
								ariaLabel={playStatus === Sound.status.PLAYING
									? sprintf(aiStrings.pause_title, currentTrack.title)
									: sprintf(aiStrings.play_title, currentTrack.title)
								}
								ariaPressed={playStatus === Sound.status.PLAYING}
							>
								{playStatus === Sound.status.PLAYING ? <PauseIcon /> : <PlayIcon />}
							</Button>

							<div className="ai-audio-controls-meta">
								{tracks.length > 1 &&
									<Button
										className="ai-btn ai-tracklist-prev"
										onClick={prevTrack}
										ariaLabel={aiStrings.previous}
									>
										<PreviousIcon />
									</Button>
								}

								{tracks.length > 1 &&
									<Button
										className="ai-btn ai-tracklist-next"
										onClick={nextTrack}
										ariaLabel={aiStrings.next}
									>
										<NextIcon />
									</Button>
								}

								<VolumeControl
									volume={volume}
									// eslint-disable-next-line no-shadow
									setVolume={setVolume}
								/>

								<Button
									className={`ai-btn ai-btn-repeat ${cycleTracks && 'ai-btn-active'}`}
									onClick={toggleTrackCycling}
									ariaLabel={aiStrings.toggle_list_repeat}
								>
									<RefreshIcon />
								</Button>
							</div>

							<div className="ai-track-info">
								<p className="ai-track-title">
									<span>{currentTrack.title}</span>
								</p>
								{(tracks.length === 0 || currentTrack.subtitle) && displayArtistNames &&
									<p className="ai-track-subtitle">
										<span>{currentTrack.subtitle}</span>
									</p>
								}
							</div>

							<div className="ai-audio-controls-meta-right">
								<Time
									duration={duration}
									position={position}
								/>
								<Button
									className="ai-btn ai-tracklist-toggle"
									onClick={this.toggleTracklist}
									ariaLabel={aiStrings.toggle_list_visible}
								>
									<PlaylistIcon />
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div
					className={`ai-tracklist-wrap ${isTrackListOpen ? 'ai-tracklist-open' : ''}`}
					style={{ display: isTrackListOpen ? 'block' : 'none' }}
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
					/>
				</div>
			</div>
		);
	}
}

GlobalFooterPlayer.propTypes = {
	tracks: PropTypes.arrayOf(PropTypes.object),
	playStatus: PropTypes.oneOf([
		Sound.status.PLAYING,
		Sound.status.PAUSED,
		Sound.status.STOPPED
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
	toggleTrackCycling: PropTypes.func.isRequired,
	cycleTracks: PropTypes.bool.isRequired,
	displayTracklist: PropTypes.bool,
	reverseTrackOrder: PropTypes.bool,
	displayTrackNo: PropTypes.bool,
	displayActiveCover: PropTypes.bool,
	displayTracklistCovers: PropTypes.bool,
	limitTracklistHeight: PropTypes.bool,
	tracklistHeight: PropTypes.number,
	displayBuyButtons: PropTypes.bool,
	buyButtonsTarget: PropTypes.bool,
	displayArtistNames: PropTypes.bool
};

export default soundProvider(GlobalFooterPlayer, {
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
