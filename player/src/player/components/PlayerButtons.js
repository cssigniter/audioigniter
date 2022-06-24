import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PlayerButton from './PlayerButton';

const propTypes = {
  className: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      icon: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

const PlayerButtons = ({ className, buttons }) => {
  const classes = classNames({
    'ai-player-buttons': true,
    [className]: !!className,
  });

  return (
    <div className={classes}>
      {buttons.map((button, index) => {
        return <PlayerButton key={index} button={button} />;
      })}
    </div>
  );
};

PlayerButtons.propTypes = propTypes;

export default PlayerButtons;
