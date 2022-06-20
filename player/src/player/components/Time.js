import React, { useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  position: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  countdown: PropTypes.bool.isRequired,
};

const Time = ({ countdown, position, duration }) => {
  const [showRemaining, setShowRemaining] = useState(countdown || false);

  /**
   * Pretty prints time remaining/elapsed
   *
   * @returns {string} - Time pretty formatted
   */
  const renderFormattedTime = () => {
    const positionInSeconds = showRemaining
      ? (duration - position) / 1000
      : position / 1000;
    const hours = Math.floor(positionInSeconds / 3600);
    let min = Math.floor((positionInSeconds % 3600) / 60);
    let sec = Math.floor(positionInSeconds % 60);
    let time = '00:00';

    min = min >= 10 ? min : `0${min}`;
    sec = sec >= 10 ? sec : `0${sec}`;

    if (!Number.isNaN(sec)) {
      if (hours) {
        time = `${hours}:${min}:${sec}`;
      } else {
        time = `${min}:${sec}`;
      }
    }

    return showRemaining ? `-${time}` : time;
  };

  const handleClick = () => {
    setShowRemaining(x => !x);
  };

  return (
    <span className="ai-track-time" onClick={handleClick}>
      {renderFormattedTime()}
    </span>
  );
};

Time.propTypes = propTypes;

export default Time;
