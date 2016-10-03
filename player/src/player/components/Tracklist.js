import React from 'react';
import Cover from './Cover';
import { Scrollbars } from 'react-custom-scrollbars';
import { CartIcon } from './Icons';

export default class Tracklist extends React.Component {
	componentWillReceiveProps(nextProps) {
		const { activeTrackIndex, limitTracklistHeight } = this.props;

		if (activeTrackIndex !== nextProps.activeTrackIndex && limitTracklistHeight) {
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

	renderButtons(track) {
		return (
			<div className="ai-track-control-buttons">
				<a href={track.buyUrl} className="ai-track-btn" target="_blank">
					<CartIcon />
				</a>
			</div>
		);
	}

	renderTrackTitle(track, idx) {
		const {
			tracks,
			reverseTrackOrder,
			displayArtistNames,
			displayTrackNo
		} = this.props;

		let trackTitle = track.title;
		let trackNo = idx + 1;

		if (reverseTrackOrder) {
			trackNo = tracks.length - idx;
		}

		if (displayArtistNames && track.subtitle) {
			trackTitle = `${track.title} - ${track.subtitle}`;
		}

		if (displayTrackNo) {
			trackTitle = `${trackNo}. ${trackTitle}`;
		}

		return trackTitle;
	}

	renderTrack(track, idx) {
		const {
			trackClassName,
			onTrackClick,
			activeTrackIndex,
			displayBuyButtons,
			displayCovers
		} = this.props;

		return (
			<li
				key={idx}
				className={trackClassName + (activeTrackIndex === idx ? ' ai-track-active' : '')}
			>
				<div
					className="ai-track-control"
					onClick={() => onTrackClick(idx)}
				>

					{displayCovers &&
						<Cover
							className="ai-track-thumb"
							src={track.cover}
							alt={track.title}
						/>
					}

					<span className="ai-track-name">
						{this.renderTrackTitle(track, idx)}
					</span>
				</div>

				{displayBuyButtons && track.buyUrl && this.renderButtons(track)}
			</li>
		);
	}

	renderTracks() {
		const { className, reverseTrackOrder } = this.props;
		let tracks = this.props.tracks;

		if (reverseTrackOrder) {
			tracks = this.props.tracks.slice().reverse();
		}

		return (
			<ul className={className}>
				{tracks && tracks.map((track, idx) => this.renderTrack(track, idx))}
			</ul>
		);
	}

	render() {
		const { isOpen, limitTracklistHeight, tracklistHeight } = this.props;

		return (
			<div style={{ display: isOpen ? 'block' : 'none' }}>
				{limitTracklistHeight ?
					<Scrollbars
						className="ai-scroll-wrap"
						ref={(ref) => this.scrollbarsRef = ref} // eslint-disable-line no-return-assign
						style={{ height: tracklistHeight }}
					>
						{this.renderTracks()}
					</Scrollbars> :
					this.renderTracks()
				}
			</div>
		);
	}
}

Tracklist.propTypes = {
	tracks: React.PropTypes.array.isRequired,
	activeTrackIndex: React.PropTypes.number.isRequired,
	onTrackClick: React.PropTypes.func.isRequired,
	isOpen: React.PropTypes.bool,
	className: React.PropTypes.string,
	trackClassName: React.PropTypes.string,
	reverseTrackOrder: React.PropTypes.bool,
	displayTrackNo: React.PropTypes.bool,
	limitTracklistHeight: React.PropTypes.bool,
	tracklistHeight: React.PropTypes.number,
	displayBuyButtons: React.PropTypes.bool,
	displayCovers: React.PropTypes.bool,
	displayArtistNames: React.PropTypes.bool
};