import React from 'react';
import PropTypes from 'prop-types';

export default class ProgressBar extends React.Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		const { duration, setPosition } = this.props;
		const offsetX = e.pageX - e.currentTarget.getBoundingClientRect().left;
		const posX = offsetX / e.currentTarget.offsetWidth;

		setPosition(posX * duration);
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
	setPosition: PropTypes.func.isRequired,
	position: PropTypes.number.isRequired,
	duration: PropTypes.number.isRequired
};
