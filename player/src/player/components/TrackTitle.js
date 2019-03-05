import React from 'react';
import PropTypes from 'prop-types';

const TrackTitle = ({
  className,
  style,
  track,
  trackNo,
  displayArtistNames,
}) => {
  let trackTitle = track.title;

  if (displayArtistNames && track.subtitle) {
    trackTitle = `${track.title} - ${track.subtitle}`;
  }

  if (trackNo != null) {
    trackTitle = `${trackNo}. ${trackTitle}`;
  }

  return (
    <span className={className} style={style}>
      {trackTitle}
    </span>
  );
};

TrackTitle.propTypes = {
  track: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  trackNo: PropTypes.number,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  displayArtistNames: PropTypes.bool,
};

export default TrackTitle;
