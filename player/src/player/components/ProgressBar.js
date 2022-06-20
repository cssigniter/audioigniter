import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  setPosition: PropTypes.func,
  position: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

const ProgressBar = ({ position, duration, setPosition }) => {
  const handleClick = event => {
    if (setPosition == null) {
      return;
    }

    const offsetX =
      event.pageX - event.currentTarget.getBoundingClientRect().left;
    const posX = offsetX / event.currentTarget.offsetWidth;

    setPosition(posX * duration);
  };

  return (
    <span onClick={handleClick} className="ai-track-progress-bar">
      <span
        className="ai-track-progress"
        style={{ width: `${(position * 100) / duration}%` }}
      />
    </span>
  );
};

ProgressBar.propTypes = propTypes;

export default ProgressBar;
