import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { VolumeUpIcon, VolumeDownIcon } from './Icons';

export default class VolumeControl extends React.Component {
  renderVolumeBars() {
    const { volume, setVolume } = this.props;

    return Array(...Array(11)).map((bar, i) => (
      <span
        key={i} // eslint-disable-line react/no-array-index-key
        className={`ai-volume-bar ${
          i <= volume / 10 ? 'ai-volume-bar-active' : ''
        }`}
        onClick={() => setVolume(i * 10)}
      />
    ));
  }

  render() {
    const { volume, setVolume } = this.props;

    return (
      <div className="ai-audio-volume-control">
        <div className="ai-audio-volume-bars">{this.renderVolumeBars()}</div>

        <div className="ai-audio-volume-control-btns">
          <Button
            className="ai-btn"
            onClick={() => setVolume(volume >= 100 ? volume : volume + 10)}
            aria-label={aiStrings.volume_up}
          >
            <VolumeUpIcon />
          </Button>
          <Button
            className="ai-btn"
            onClick={() => setVolume(volume <= 0 ? volume : volume - 10)}
            aria-label={aiStrings.volume_down}
          >
            <VolumeDownIcon />
          </Button>
        </div>
      </div>
    );
  }
}

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
};
