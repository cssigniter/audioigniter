import React from 'react';
import PropTypes from 'prop-types';
import { MusicNoteIcon } from './Icons';

const Cover = ({
	className,
	title,
	src
}) => (
	<div className={className + (src ? '' : ' ai-track-no-thumb')}>
		{src ?
			<img src={src} alt={title || ''} /> :
			<MusicNoteIcon />
		}
	</div>
);

Cover.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	src: PropTypes.string
};

export default Cover;
