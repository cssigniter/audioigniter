import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';

const propTypes = {
  position: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  audio: PropTypes.string,
  setPosition: PropTypes.func.isRequired,
};

const WaveformProgressBar = ({ audio, position, duration, setPosition }) => {
  const waveFormDomRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    if (waveFormDomRef.current && audio) {
      wavesurfer.current = WaveSurfer.create({
        container: waveFormDomRef.current,
        mediaControls: false,
        height: 40,
        barWidth: 2,
        barGap: 2,
        barRadius: 3,
        responsive: true,
        cursorWidth: 0,
        backgroundColor: 'transparent',
        progressColor: '#f70f5d',
        waveColor: '#fff',
        xhr: {
          mode: 'no-cors',
        },
      });
      wavesurfer.current.load(audio);
      wavesurfer.current.on('ready', () => {
        console.log('wavesurfer loaded');
      });
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audio, waveFormDomRef.current]);

  useEffect(() => {
    // Sync wavesurfer with current playing position
    const progress = position / duration;

    if (wavesurfer.current && !Number.isNaN(progress)) {
      wavesurfer.current.seekTo(progress || 0);
    }
  }, [position]);

  const handleClick = event => {
    if (setPosition == null) {
      return;
    }

    const offsetX =
      event.pageX - event.currentTarget.getBoundingClientRect().left;
    const posX = offsetX / event.currentTarget.offsetWidth;

    setPosition(posX * duration);
  };

  if (!audio) {
    return null;
  }

  return (
    <div className="ai-waveform-bar" onClick={handleClick}>
      <div className="ai-waveform" ref={waveFormDomRef} />
      <div className="ai-waveform-progress" />
    </div>
  );
};

WaveformProgressBar.propTypes = propTypes;

export default WaveformProgressBar;
