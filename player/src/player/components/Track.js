import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import TrackTitle from './TrackTitle';
import Cover from './Cover';
import TrackButtons from './TrackButtons';

class Track extends React.Component {
	render() {
		const {
			track,
			index,
			trackNo,
			isActive,
			buyButtonsTarget,
			displayArtistNames,
			displayCovers,
			displayBuyButtons,
			onTrackClick,
			className
		} = this.props;

		const paddingRight = track.downloadUrl && track.buyUrl ? '90px' : '';

		return (
			<li className={className + (isActive ? ' ai-track-active' : '')}>
				<div
					className="ai-track-control"
					onClick={() => onTrackClick(index)}
				>
					{displayCovers &&
						<Cover
							className="ai-track-thumb"
							src={track.cover}
							alt={track.title}
						/>
					}

					<TrackTitle
						className="ai-track-name"
						style={{ paddingRight }}
						track={track}
						trackNo={trackNo}
						displayArtistNames={displayArtistNames}
					/>
				</div>

				{displayBuyButtons &&
					<TrackButtons
						buyButtonsTarget={buyButtonsTarget}
						buyUrl={track.buyUrl}
						downloadUrl={track.downloadUrl}
					/>
				}
			</li>
		);
	}
}

Track.propTypes = {
	track: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	index: PropTypes.number.isRequired,
	trackNo: PropTypes.number,
	isActive: PropTypes.bool,
	position: PropTypes.number,
	duration: PropTypes.number,
	playStatus: PropTypes.oneOf([
		Sound.status.PLAYING,
		Sound.status.PAUSED,
		Sound.status.STOPPED
	]),
	onTrackClick: PropTypes.func.isRequired,
	className: PropTypes.string.isRequired,
	buyButtonsTarget: PropTypes.bool,
	displayArtistNames: PropTypes.bool,
	displayCovers: PropTypes.bool,
	displayBuyButtons: PropTypes.bool
};

export default Track;
