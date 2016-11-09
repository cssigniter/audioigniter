/* global window fetch */
import React from 'react';
import Sound from 'react-sound';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Tracklist from './components/Tracklist';
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
	RefreshIcon
} from './components/Icons';
import SoundCloud from '../utils/soundcloud';

export default class Player extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tracks: [],
			activeIndex: 0, // Determine active track by index
			playStatus: Sound.status.STOPPED,
			position: 0,
			duration: 0,
			volume: 100,
			isTrackListOpen: true,
			cycleTracks: this.props.cycleTracks
		};

		this.togglePlay = this.togglePlay.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.onSeek = this.onSeek.bind(this);
		this.nextTrack = this.nextTrack.bind(this);
		this.prevTrack = this.prevTrack.bind(this);
		this.toggleTracklist = this.toggleTracklist.bind(this);
		this.toggleTrackCycling = this.toggleTrackCycling.bind(this);
		this.isNarrowContext = this.isNarrowContext.bind(this);
	}

	componentDidMount() {
		const { tracksUrl, soundcloudClientId } = this.props;
		const tracks = fetch(tracksUrl).then(res => res.json());

		if (!soundcloudClientId) {
			tracks.then(tracks => this.setState({ tracks }));
			return;
		}

		const sc = new SoundCloud(soundcloudClientId);
		const scTracks = tracks.then(tracks => sc.fetchSoundCloudStreams(tracks));

		// Make sure if SoundCloud fetching fails we delegate and load our tracks anyway
		const promiseArray = [tracks, scTracks].map(p => p.catch(error => ({
			status: 'error',
			error
		})));

		Promise.all(promiseArray)
			.then(res => {
				if (res[1].status === 'error') {
					return this.setState({ tracks: res[0] });
				}

				return this.setState({ tracks: sc.mapStreamsToTracks(...res) });
			});
	}

	onSeek(position) {
		this.setState({ position });
	}

	isNarrowContext() {
		return this.root && this.root.offsetWidth < 480 && window.innerWidth > 480;
	}

	playTrack(idx, e) {
		if (e) {
			e.preventDefault();
		}

		const { playStatus } = this.state;
		this.setState({ activeIndex: idx, position: 0 });

		if (playStatus !== Sound.status.PLAYING) {
			this.setState({ playStatus: Sound.status.PLAYING });
		}
	}

	togglePlay() {
		const status = this.state.playStatus === Sound.status.PLAYING ?
			Sound.status.PAUSED : Sound.status.PLAYING;

		this.setState({ playStatus: status });
	}

	nextTrack() {
		const { activeIndex, tracks } = this.state;
		this.playTrack(activeIndex === tracks.length - 1 ? 0 : activeIndex + 1);
	}

	prevTrack() {
		const { activeIndex, tracks } = this.state;
		this.playTrack(activeIndex === 0 ? tracks.length - 1 : activeIndex - 1);
	}

	toggleTracklist() {
		this.setState({ isTrackListOpen: !this.state.isTrackListOpen });
	}

	toggleTrackCycling() {
		this.setState({ cycleTracks: !this.state.cycleTracks });
	}

	maybePlayNextTrack() {
		const { cycleTracks, activeIndex, tracks } = this.state;

		if (cycleTracks) {
			return this.nextTrack();
		}

		return activeIndex === tracks.length - 1 ? this.togglePlay() : this.nextTrack();
	}

	render() {
		const {
			tracks,
			playStatus,
			activeIndex,
			position,
			duration,
			volume,
			isTrackListOpen,
			cycleTracks
		} = this.state;

		const {
			displayTracklist,
			reverseTrackOrder,
			displayTrackNo,
			displayTracklistCovers,
			displayActiveCover,
			displayCredits,
			limitTracklistHeight,
			tracklistHeight,
			displayBuyButtons,
			displayArtistNames,
			maxWidth
		} = this.props;

		const currentTrack = tracks[activeIndex] || {};

		return (
			<div
				ref={(ref) => this.root = ref} // eslint-disable-line no-return-assign
				className={
					`ai-wrap ${tracks.length ? '' : 'ai-is-loading'}${this.isNarrowContext() ? 'ai-narrow' : ''}`
				}
				style={{ maxWidth }}
			>
				<div className={`ai-control-wrap ${displayActiveCover ? '' : 'ai-control-wrap-fullwidth'}`}>
					{displayActiveCover &&
						<Cover
							className="ai-thumb ai-control-wrap-thumb"
							src={currentTrack.cover}
							alt={currentTrack.title}
						/>
					}

					<div className="ai-control-wrap-controls">
						<div className="ai-audio-controls-main">
							<Button
								onClick={this.togglePlay}
								className={`ai-audio-control ${playStatus === Sound.status.PLAYING ? 'ai-audio-playing' : ''}`}
							>
								{playStatus === Sound.status.PLAYING ? <PauseIcon /> : <PlayIcon />}
							</Button>

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
						</div>

						<div className="ai-audio-controls-progress">
							<ProgressBar
								onSeek={this.onSeek}
								duration={duration}
								position={position}
							/>
							<Time
								duration={duration}
								position={position}
							/>
						</div>

						<div className="ai-audio-controls-meta">
							<div className="ai-audio-controls-meta-left">
								{tracks.length > 1 &&
									<Button
										className="ai-btn ai-tracklist-prev"
										onClick={this.prevTrack}
									>
										<PreviousIcon />
									</Button>
								}

								{tracks.length > 1 &&
									<Button
										className="ai-btn ai-tracklist-next"
										onClick={this.nextTrack}
									>
										<NextIcon />
									</Button>
								}

								<VolumeControl
									volume={volume}
									// eslint-disable-next-line no-shadow
									setVolume={(volume) => { this.setState({ volume }); }}
								/>

								<Button
									className={`ai-btn ${cycleTracks && 'ai-btn-active'}`}
									onClick={this.toggleTrackCycling}
								>
									<RefreshIcon />
								</Button>
							</div>

							{(tracks.length > 1 && displayTracklist) &&
								<div className="ai-audio-controls-meta-right">
									<Button
										className="ai-btn ai-tracklist-toggle"
										onClick={this.toggleTracklist}
									>
										<PlaylistIcon />
									</Button>
								</div>
							}
						</div>
					</div>
				</div>

				{(tracks.length > 1 && displayTracklist) &&
					<div className={`ai-tracklist-wrap ${isTrackListOpen ? 'ai-tracklist-open' : ''}`}>
						<ReactCSSTransitionGroup
							transitionName="ai-tracklist"
							transitionEnterTimeout={500}
							transitionLeaveTimeout={1000}
						>
							<Tracklist
								className="ai-tracklist"
								trackClassName="ai-track"
								tracks={tracks}
								activeTrackIndex={activeIndex}
								isOpen={isTrackListOpen}
								displayTrackNo={displayTrackNo}
								displayCovers={displayTracklistCovers}
								displayBuyButtons={displayBuyButtons}
								displayArtistNames={displayArtistNames}
								reverseTrackOrder={reverseTrackOrder}
								limitTracklistHeight={limitTracklistHeight}
								tracklistHeight={tracklistHeight}
								onTrackClick={this.playTrack}
							/>
						</ReactCSSTransitionGroup>
					</div>
				}

				{displayCredits &&
					<div className="ai-footer">
						<p>Powered by <a href="https://www.cssigniter.com/ignite/plugins/audioigniter?utm_source=player&utm_medium=link&utm_content=audioigniter&utm_campaign=footer-link" target="_blank" rel="noopener noreferrer">AudioIgniter</a></p>
					</div>
				}

				{tracks.length > 0 &&
					<Sound
						url={currentTrack.audio}
						playStatus={playStatus}
						position={position}
						volume={volume}
						// eslint-disable-next-line no-shadow
						onPlaying={({ duration, position }) => this.setState({ duration, position })}
						onFinishedPlaying={() => this.maybePlayNextTrack()}
					/>
				}
			</div>
		);
	}
}

Player.propTypes = {
	tracksUrl: React.PropTypes.string.isRequired,
	displayTracklist: React.PropTypes.bool,
	reverseTrackOrder: React.PropTypes.bool,
	displayTrackNo: React.PropTypes.bool,
	displayCredits: React.PropTypes.bool,
	displayActiveCover: React.PropTypes.bool,
	displayTracklistCovers: React.PropTypes.bool,
	limitTracklistHeight: React.PropTypes.bool,
	tracklistHeight: React.PropTypes.number,
	displayBuyButtons: React.PropTypes.bool,
	displayArtistNames: React.PropTypes.bool,
	cycleTracks: React.PropTypes.bool,
	maxWidth: React.PropTypes.string,
	soundcloudClientId: React.PropTypes.string
};
