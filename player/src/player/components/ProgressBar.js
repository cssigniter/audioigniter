import React from 'react';
import PropTypes from 'prop-types';

export default class ProgressBar extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { duration, setPosition } = this.props;

    if (setPosition == null) {
      return;
    }

    const offsetX =
      event.pageX - event.currentTarget.getBoundingClientRect().left;
    const posX = offsetX / event.currentTarget.offsetWidth;

    setPosition(posX * duration);
  }

  render() {
    const { position, duration } = this.props;

    return (
      <span onClick={this.handleClick} className="ai-track-progress-bar">
        <span
          className="ai-track-progress"
          style={{ width: `${(position * 100) / duration}%` }}
        />
      </span>
    );
  }
}

ProgressBar.propTypes = {
  setPosition: PropTypes.func,
  position: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};
