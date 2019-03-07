import React, { Fragment, useState, createContext } from 'react';
import PropTypes from 'prop-types';

import Player from './player/Player';
import SimplePlayer from './player/SimplePlayer';
import GlobalFooterPlayer from './player/GlobalFooterPlayer';
import TrackLyricsModal from './player/components/TrackLyricsModal';

export const AppContext = createContext();

const App = ({ type, ...props }) => {
  const [modal, setModalState] = useState({
    open: false,
    track: null,
  });

  const toggleLyricsModal = (open, track) =>
    setModalState(prevState => ({
      ...prevState,
      track,
      open,
    }));

  const { track, open } = modal;

  const PlayerActual = (() => {
    if (type === 'simple') {
      return SimplePlayer;
    }

    if (type === 'global-footer') {
      return GlobalFooterPlayer;
    }

    return Player;
  })();

  return (
    <Fragment>
      <AppContext.Provider
        value={{
          toggleLyricsModal,
        }}
      >
        <PlayerActual {...props} />
      </AppContext.Provider>

      {track && track.lyrics && (
        <TrackLyricsModal
          isOpen={open}
          closeModal={() => toggleLyricsModal(false)}
        >
          {track && track.lyrics}
        </TrackLyricsModal>
      )}
    </Fragment>
  );
};

App.propTypes = {
  type: PropTypes.string,
};

export default App;
