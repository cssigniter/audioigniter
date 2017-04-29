import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
	className,
	onClick,
	children
}) => (
	<button
		className={className}
		onClick={onClick}
	>
		{children}
	</button>
);

Button.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.element
};

export default Button;
