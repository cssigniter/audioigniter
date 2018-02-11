import React from 'react';
import PropTypes from 'prop-types';
import { CartIcon, DownloadIcon } from './Icons';

const TrackButtons = ({
	buyButtonsTarget,
	buyUrl,
	downloadUrl
}) => {
	if (buyUrl == null || downloadUrl == null) {
		return null;
	}

	return (
		<div className="ai-track-control-buttons">
			{buyUrl &&
				<a
					href={buyUrl}
					className="ai-track-btn"
					rel={buyButtonsTarget ? 'noopener noreferrer' : undefined}
					target={buyButtonsTarget ? '_blank' : '_self'}
					role="button"
					aria-label={aiStrings.buy_track}
				>
					<CartIcon />
				</a>
			}

			{downloadUrl &&
				<a
					href={downloadUrl}
					download={downloadUrl}
					className="ai-track-btn"
					role="button"
					aria-label={aiStrings.download_track}
				>
					<DownloadIcon />
				</a>
			}
		</div>
	);
};

TrackButtons.propTypes = {
	buyButtonsTarget: PropTypes.bool,
	buyUrl: PropTypes.string,
	downloadUrl: PropTypes.string
};

export default TrackButtons;
