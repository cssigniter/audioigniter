import { useEffect } from 'wp.element';

const LoadingResponsePlaceholder = ({ attributes }) => {
  const { playerId } = attributes;

  useEffect(() => {
    if (!playerId) {
      return;
    }

    setTimeout(() => {
      const nodes = document.querySelectorAll(`#audioigniter-${playerId}`);
      if (nodes.length > 0) {
        [...nodes].forEach(node => __CI_AUDIOIGNITER_MANUAL_INIT__(node));
      }
    }, 600);
  }, []);

  return 'Loading playlist...';
};

export default LoadingResponsePlaceholder;
