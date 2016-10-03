import React from 'react';
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
	className: React.PropTypes.string,
	title: React.PropTypes.string,
	src: React.PropTypes.string
};

export default Cover;
