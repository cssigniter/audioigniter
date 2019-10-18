import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  className,
  onClick,
  children,
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  ariaControls,
}) => (
  <button
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    aria-expanded={ariaExpanded}
    aria-controls={ariaControls}
  >
    {children}
  </button>
);

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  ariaLabel: PropTypes.string,
  ariaPressed: PropTypes.bool,
  ariaExpanded: PropTypes.bool,
  ariaControls: PropTypes.string,
};

export default Button;
