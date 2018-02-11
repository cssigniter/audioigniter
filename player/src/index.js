import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import 'es6-promise/auto';
import 'whatwg-fetch';
import Player from './player/Player';
import SimplePlayer from './player/SimplePlayer';
import GlobalFooterPlayer from './player/GlobalFooterPlayer';

// Set up translatable strings here
// for development purposes only. The production build
// gets them from WordPress's injection
if (process.env.NODE_ENV !== 'production') {
	window.aiStrings = {
		play_title: 'Play %s',
		pause_title: 'Pause %s',
		previous: 'Previous track',
		next: 'Next track',
		toggle_list_repeat: 'Toggle track listing repeat',
		toggle_list_visible: 'Toggle track listing visibility',
		buy_track: 'Buy this track',
		download_track: 'Download this track',
		volume_up: 'Volume Up',
		volume_down: 'Volume Down'
	};
}

const nodes = document.getElementsByClassName('audioigniter-root');

const App = ({ type, ...props }) => {
	if (type === 'simple') {
		return <SimplePlayer {...props} />;
	}

	if (type === 'global-footer') {
		return <GlobalFooterPlayer {...props} />;
	}

	return <Player {...props} />;
};

App.propTypes = {
	type: PropTypes.string
};

function renderApp(node) {
	const type = node.getAttribute('data-player-type');

	const props = {
		tracksUrl: node.getAttribute('data-tracks-url'),
		displayTracklistCovers: JSON.parse(node.getAttribute('data-display-tracklist-covers')),
		displayActiveCover: JSON.parse(node.getAttribute('data-display-active-cover')),
		displayCredits: JSON.parse(node.getAttribute('data-display-credits')),
		displayTracklist: JSON.parse(node.getAttribute('data-display-tracklist')),
		displayTrackNo: JSON.parse(node.getAttribute('data-display-track-no')),
		displayBuyButtons: JSON.parse(node.getAttribute('data-display-buy-buttons')),
		buyButtonsTarget: JSON.parse(node.getAttribute('data-buy-buttons-target')),
		volume: parseInt(node.getAttribute('data-volume'), 10),
		displayArtistNames: JSON.parse(node.getAttribute('data-display-artist-names')),
		cycleTracks: JSON.parse(node.getAttribute('data-cycle-tracks')),
		limitTracklistHeight: JSON.parse(node.getAttribute('data-limit-tracklist-height')),
		tracklistHeight: parseInt(node.getAttribute('data-tracklist-height'), 10),
		reverseTrackOrder: JSON.parse(node.getAttribute('data-reverse-track-order')),
		maxWidth: node.getAttribute('data-max-width'),
		soundcloudClientId: node.getAttribute('data-soundcloud-client-id')
	};

	render(
		<App type={type} {...props} />,
		node
	);
}

Array.prototype.slice.call(nodes).forEach(node => { renderApp(node); });

// eslint-disable-next-line no-underscore-dangle
window.__CI_AUDIOIGNITER_MANUAL_INIT__ = node => { renderApp(node); };
