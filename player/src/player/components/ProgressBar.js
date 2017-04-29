import React from 'react';
import PropTypes from 'prop-types';

export default class ProgressBar extends React.Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		const { duration, onSeek } = this.props;
		const offsetX = e.pageX - e.currentTarget.getBoundingClientRect().left;
		const posX = offsetX / e.currentTarget.offsetWidth;

		onSeek(posX * duration);
	}

	render() {
		const { position, duration } = this.props;

		return (
			<span
				onClick={this.handleClick}
				className="ai-track-progress-bar"
			>
				<span
					className="ai-track-progress"
					style={{ width: `${(position * 100) / duration}%` }}
				/>
			</span>
		);
	}
}

ProgressBar.propTypes = {
	onSeek: PropTypes.func.isRequired,
	position: PropTypes.number.isRequired,
	duration: PropTypes.number.isRequired
};
