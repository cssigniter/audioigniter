import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import SoundCloud from '../utils/soundcloud';

const soundProvider = (Player, events) => {
	class EnhancedPlayer extends React.Component {
		constructor(props) {
			super(props);

			const { volume, cycleTracks } = this.props;

			this.state = {
				tracks: [],
				activeIndex: 0, // Determine active track by index
				playStatus: Sound.status.STOPPED,
				position: 0,
				duration: 0,
				volume: volume == null ? 100 : volume,
				cycleTracks
			};

			this.playTrack = this.playTrack.bind(this);
			this.pauseTrack = this.pauseTrack.bind(this);
			this.togglePlay = this.togglePlay.bind(this);
			this.nextTrack = this.nextTrack.bind(this);
			this.prevTrack = this.prevTrack.bind(this);
			this.setPosition = this.setPosition.bind(this);
			this.setVolume = this.setVolume.bind(this);
			this.toggleTrackCycling = this.toggleTrackCycling.bind(this);
			this.reverseTracks = this.reverseTracks.bind(this);
			this.getFinalProps = this.getFinalProps.bind(this);
			this.onPlaying = this.onPlaying.bind(this);
			this.onFinishedPlaying = this.onFinishedPlaying.bind(this);
		}

		componentDidMount() {
			const { tracksUrl, soundcloudClientId, reverseTrackOrder } = this.props;
			const tracksPromised = fetch(tracksUrl).then(res => res.json());

			if (!soundcloudClientId) {
				tracksPromised.then(tracks => this.setState({ tracks }));
				return;
			}

			const sc = new SoundCloud(soundcloudClientId);
			const scTracks = tracksPromised
				.then(tracks => sc.fetchSoundCloudStreams(tracks))
				.catch(err => console.error(err)); // eslint-disable-line no-console

			// Make sure if SoundCloud fetching fails
			// we delegate and load our tracks anyway
			const promiseArray = [tracksPromised, scTracks].map(p => p.catch(error => ({
				status: 'error',
				error
			})));

			Promise.all(promiseArray)
				.then(res => {
					if (res[1].status === 'error') {
						return this.setState({ tracks: res[0] });
					}

					return this.setState(() => ({ tracks: sc.mapStreamsToTracks(...res) }), () => {
						if (reverseTrackOrder) {
							this.reverseTracks();
						}
					});
				});
		}

		// Events
		onPlaying({ duration, position }) {
			this.setState(() => ({ duration, position }), () => {
				if (events && events.onPlaying) {
					events.onPlaying(this.getFinalProps());
				}
			});
		}

		onFinishedPlaying() {
			this.setState(() => ({ playStatus: Sound.status.STOPPED }));

			if (events && events.onFinishedPlaying) {
				events.onFinishedPlaying(this.getFinalProps());
			}
		}

		getFinalProps() {
			const { tracks, activeIndex } = this.state;
			const currentTrack = tracks[activeIndex] || {};

			return {
				playTrack: this.playTrack,
				pauseTrack: this.pauseTrack,
				togglePlay: this.togglePlay,
				nextTrack: this.nextTrack,
				prevTrack: this.prevTrack,
				setPosition: this.setPosition,
				setVolume: this.setVolume,
				toggleTrackCycling: this.toggleTrackCycling,
				currentTrack,
				...this.props,
				...this.state
			};
		}

		setVolume(volume) {
			this.setState(() => ({ volume }));
		}

		setPosition(position) {
			this.setState(() => ({ position }));
		}

		playTrack(index, event) {
			if (event) {
				event.preventDefault();
			}

			const { playStatus } = this.state;
			this.setState(() => ({ activeIndex: index, position: 0 }));

			if (playStatus !== Sound.status.PLAYING) {
				this.setState(() => ({ playStatus: Sound.status.PLAYING }));
			}
		}

		pauseTrack(event) {
			if (event) {
				event.preventDefault();
			}

			const { playStatus } = this.state;

			if (playStatus === Sound.status.PLAYING) {
				this.setState(() => ({ playStatus: Sound.status.PAUSED }));
			}
		}

		togglePlay(index, event) {
			if (event) {
				event.preventDefault();
			}

			const { playStatus, activeIndex } = this.state;

			if (typeof index === 'number' && index !== activeIndex) {
				this.playTrack(index);
				return;
			}

			const status = playStatus === Sound.status.PLAYING
				? Sound.status.PAUSED
				: Sound.status.PLAYING;
			this.setState(() => ({ playStatus: status }));
		}

		nextTrack() {
			const { activeIndex, tracks } = this.state;
			this.playTrack(activeIndex === tracks.length - 1 ? 0 : activeIndex + 1);
		}

		prevTrack() {
			const { activeIndex, tracks } = this.state;
			this.playTrack(activeIndex === 0 ? tracks.length - 1 : activeIndex - 1);
		}

		toggleTrackCycling() {
			this.setState(state => ({
				cycleTracks: !state.cycleTracks
			}));
		}

		reverseTracks() {
			this.setState(state => ({
				tracks: state.tracks.slice().reverse()
			}));
		}

		render() {
			const {
				tracks,
				playStatus,
				position,
				volume
			} = this.state;

			const finalProps = this.getFinalProps();

			return (
				<div className="ai-audioigniter">
					<Player {...finalProps} />

					{tracks.length > 0 &&
						<Sound
							url={finalProps.currentTrack.audio}
							playStatus={playStatus}
							position={position}
							volume={volume}
							// eslint-disable-next-line no-shadow
							onPlaying={this.onPlaying}
							onFinishedPlaying={this.onFinishedPlaying}
						/>
					}
				</div>
			);
		}
	}

	EnhancedPlayer.propTypes = {
		volume: PropTypes.number,
		cycleTracks: PropTypes.bool,
		tracksUrl: PropTypes.string,
		soundcloudClientId: PropTypes.string,
		reverseTrackOrder: PropTypes.bool
	};

	return EnhancedPlayer;
};

export default soundProvider;
