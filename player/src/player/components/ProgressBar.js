import React from 'react';

export default class ProgressBar extends React.Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		const { duration, onSeek } = this.props;
		const posX = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;

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
					style={{ width: `${position * 100 / duration}%` }}
				>
				</span>
			</span>
		);
	}
}

ProgressBar.propTypes = {
	onSeek: React.PropTypes.func.isRequired,
	position: React.PropTypes.number.isRequired,
	duration: React.PropTypes.number.isRequired
};
