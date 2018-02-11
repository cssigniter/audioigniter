import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import { sprintf } from 'sprintf-js';

import TrackTitle from './TrackTitle';
import Cover from './Cover';
import TrackButtons from './TrackButtons';
import ProgressBar from './ProgressBar';
import { PlayIcon, PauseIcon } from './Icons';

const Track = ({
	track,
	index,
	trackNo,
	isActive,
	playStatus,
	duration,
	position,
	setPosition,
	isStandalone,
	buyButtonsTarget,
	displayArtistNames,
	displayCovers,
	displayBuyButtons,
	onTrackClick,
	className
}) => {
	const isPlaying = isActive && playStatus === Sound.status.PLAYING;
	const hasProgressBar = typeof position !== 'undefined' && typeof duration !== 'undefined' && isActive && isStandalone;

	return (
		<li className={className + (isActive ? ' ai-track-active' : '')}>
			{displayCovers &&
				<Cover
					className="ai-track-thumb"
					src={track.cover}
					alt={track.title}
					onClick={() => onTrackClick(index)}
				/>
			}

			{isStandalone &&
				<button
					className="ai-track-btn ai-track-inline-play-btn"
					onClick={() => onTrackClick(index)}
					aria-label={isPlaying
						? sprintf(aiStrings.pause_title, track.title)
						: sprintf(aiStrings.play_title, track.title)
					}
					aria-pressed={isPlaying}
				>
					{isPlaying ? <PauseIcon /> : <PlayIcon />}
				</button>
			}

			<div
				className="ai-track-control"
				onClick={() => onTrackClick(index)}
			>
				<TrackTitle
					className="ai-track-name"
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

			{hasProgressBar &&
				<ProgressBar
					setPosition={setPosition}
					duration={duration}
					position={position}
				/>
			}
		</li>
	);
};

Track.propTypes = {
	track: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	index: PropTypes.number.isRequired,
	trackNo: PropTypes.number,
	isActive: PropTypes.bool,
	position: PropTypes.number,
	duration: PropTypes.number,
	setPosition: PropTypes.func,
	playStatus: PropTypes.oneOf([
		Sound.status.PLAYING,
		Sound.status.PAUSED,
		Sound.status.STOPPED
	]),
	onTrackClick: PropTypes.func.isRequired,
	className: PropTypes.string.isRequired,
	isStandalone: PropTypes.bool,
	buyButtonsTarget: PropTypes.bool,
	displayArtistNames: PropTypes.bool,
	displayCovers: PropTypes.bool,
	displayBuyButtons: PropTypes.bool
};

export default Track;
