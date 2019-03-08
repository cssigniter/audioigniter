import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

if (document.querySelector('.audioigniter-root')) {
  Modal.setAppElement('.audioigniter-root');
}

const TrackLyricsModal = ({ isOpen, closeModal, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      onRequestClose={closeModal}
      overlayClassName="ai-modal-overlay"
      className="ai-modal"
    >
      <div className="ai-modal-wrap">
        <div className="ai-modal-header">
          <button
            className="ai-modal-dismiss"
            type="button"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>

        <div className="ai-modal-content">{children}</div>
      </div>
    </Modal>
  );
};

const propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.any,
};

TrackLyricsModal.propTypes = propTypes;

export default TrackLyricsModal;
