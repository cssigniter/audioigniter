import React from 'react';
import Button from './Button';
import { VolumeUpIcon, VolumeDownIcon } from './Icons';

export default class VolumeControl extends React.Component {
	renderVolumeBars() {
		const { volume, setVolume } = this.props;

		return Array(...Array(11)).map((bar, i) =>
			<span
				key={i} // eslint-disable-line react/no-array-index-key
				className={`ai-volume-bar ${i <= volume / 10 ? 'ai-volume-bar-active' : ''}`}
				onClick={() => setVolume(i * 10)}
			/>
		);
	}

	render() {
		const { volume, setVolume } = this.props;

		return (
			<div className="ai-audio-volume-control">
				<div className="ai-audio-volume-bars">
					{this.renderVolumeBars()}
				</div>

				<Button
					className="ai-btn"
					onClick={() => setVolume(volume <= 0 ? volume : volume - 10)}
				>
					<VolumeDownIcon />
				</Button>

				<Button
					className="ai-btn"
					onClick={() => setVolume(volume >= 100 ? volume : volume + 10)}
				>
					<VolumeUpIcon />
				</Button>
			</div>
		);
	}
}

VolumeControl.propTypes = {
	volume: React.PropTypes.number.isRequired,
	setVolume: React.PropTypes.func.isRequired
};
