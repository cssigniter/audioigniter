import React from 'react';

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
	className: React.PropTypes.string,
	onClick: React.PropTypes.func,
	children: React.PropTypes.element
};

export default Button;
