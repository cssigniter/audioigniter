import React from 'react';
import PropTypes from 'prop-types';
import { MusicNoteIcon } from './Icons';

const Cover = ({ className, title, src, onClick }) => (
  <div
    className={className + (src ? '' : ' ai-track-no-thumb')}
    onClick={onClick}
  >
    {src ? <img src={src} alt={title || ''} /> : <MusicNoteIcon />}
  </div>
);

Cover.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  src: PropTypes.string,
  onClick: PropTypes.func,
};

export default Cover;
