/**
 * @file React hook for determining the size of a component.
 *
 * Forked from https://github.com/rehooks/component-size.
 */

import { useCallback, useState, useLayoutEffect } from 'react';

const getSize = el => {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
};

const useComponentSize = ref => {
  const [ComponentSize, setComponentSize] = useState(
    getSize(ref ? ref.current : {}),
  );

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    handleResize();

    if (typeof ResizeObserver === 'function') {
      // eslint-disable-next-line no-undef
      let resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect(ref.current);
        resizeObserver = null;
      };
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref.current]);

  return ComponentSize;
};

export default useComponentSize;
