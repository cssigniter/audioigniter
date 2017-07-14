import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import soundProvider from './soundProvider';
import Cover from './components/Cover';
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import Time from './components/Time';
import VolumeControl from './components/VolumeControl';
import {
	PlayIcon,
	PauseIcon,
	NextIcon,
	PreviousIcon,
	PlaylistIcon,
	RefreshIcon
} from './components/Icons';

class FixedPlayer extends React.Component {
	render() {
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
			displayCredits,
			limitTracklistHeight,
			tracklistHeight,
			displayBuyButtons,
			buyButtonsTarget,
			displayArtistNames,
			maxWidth
		} = this.props;

		return (
			<div
				ref={ref => this.root = ref} // eslint-disable-line no-return-assign
				className={`ai-wrap ai-type-fixed ${tracks.length ? '' : 'ai-is-loading'}`}
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
							>
								{playStatus === Sound.status.PLAYING ? <PauseIcon /> : <PlayIcon />}
							</Button>

							<div className="ai-audio-controls-meta">
								{tracks.length > 1 &&
									<Button
										className="ai-btn ai-tracklist-prev"
										onClick={prevTrack}
									>
										<PreviousIcon />
									</Button>
								}

								{tracks.length > 1 &&
									<Button
										className="ai-btn ai-tracklist-next"
										onClick={nextTrack}
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
								>
									<PlaylistIcon />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default soundProvider(FixedPlayer, {
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
