import React from 'react';
import PropTypes from 'prop-types';
import Track from './Track';

export default class Tracklist extends React.Component {
	render() {
		const { tracks } = this.props;

		return (
			<ul className={this.props.className}>
				{tracks && tracks.map((track, index) => {
					const trackNo = this.props.reverseTrackOrder
						? tracks.length - index
						: index + 1;

					return (
						<Track
							key={index}
							track={track}
							index={index}
							trackNo={this.props.displayTrackNo ? trackNo : undefined}
							isActive={this.props.activeTrackIndex === index}
							buyButtonsTarget={this.props.buyButtonsTarget}
							displayArtistNames={this.props.displayArtistNames}
							displayBuyButtons={this.props.displayBuyButtons}
							displayCovers={this.props.displayCovers}
							onTrackClick={this.props.onTrackClick}
							className={this.props.trackClassName}
						/>
					);
				})}
			</ul>
		);
	}
}

Tracklist.propTypes = {
	tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
	activeTrackIndex: PropTypes.number,
	onTrackClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	trackClassName: PropTypes.string,
	reverseTrackOrder: PropTypes.bool,
	displayTrackNo: PropTypes.bool,
	displayBuyButtons: PropTypes.bool,
	buyButtonsTarget: PropTypes.bool,
	displayCovers: PropTypes.bool,
	displayArtistNames: PropTypes.bool
};
