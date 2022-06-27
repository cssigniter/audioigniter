import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  className: PropTypes.string,
  button: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
};

const PlayerButton = ({ className, button }) => {
  const classes = classNames({
    'ai-btn': true,
    'ai-player-button': true,
    'ai-player-button-icon-only': !button.title,
    [className]: !!className,
  });

  return (
    <a
      href={button.url}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {button.icon && (
        <span
          className="ai-player-button-icon"
          dangerouslySetInnerHTML={{ __html: button.icon }}
        />
      )}
      {button.title && (
        <span className="ai-player-button-title">{button.title}</span>
      )}
    </a>
  );
};

PlayerButton.propTypes = propTypes;

export default PlayerButton;
