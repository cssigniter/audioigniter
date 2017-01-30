import React from 'react';

export default class Time extends React.Component {
	constructor() {
		super();

		this.state = {
			showRemaining: false
		};

		this.handleClick = this.handleClick.bind(this);
	}

	/**
	 * Pretty prints time remaining/elapsed
	 *
	 * @param {number} position - Track position in milliseconds
	 * @param {number} duration - Track duration in milliseconds
	 * @returns {string} - Time pretty formatted
	 */
	formatTime(position, duration) {
		const { showRemaining } = this.state;
		const positionInSeconds = showRemaining
			? (duration - position) / 1000
			: position / 1000;
		const hours = Math.floor(positionInSeconds / 3600);
		let min = Math.floor((positionInSeconds % 3600) / 60);
		let sec = Math.floor(positionInSeconds % 60);
		let time = '00:00';

		min = min >= 10 ? min : `0${min}`;
		sec = sec >= 10 ? sec : `0${sec}`;

		if (!isNaN(sec)) {
			if (hours) {
				time = `${hours}:${min}:${sec}`;
			} else {
				time = `${min}:${sec}`;
			}
		}

		return showRemaining ? `-${time}` : time;
	}

	handleClick() {
		const { showRemaining } = this.state;
		this.setState({ showRemaining: !showRemaining });
	}

	render() {
		const { position, duration } = this.props;

		return (
			<span
				className="ai-track-time"
				onClick={this.handleClick}
			>
				{this.formatTime(position, duration)}
			</span>
		);
	}
}

Time.propTypes = {
	position: React.PropTypes.number.isRequired,
	duration: React.PropTypes.number.isRequired
};
