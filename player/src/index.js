import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import 'es6-promise/auto';
import 'whatwg-fetch';
import Player from './player/Player';
import SimplePlayer from './player/SimplePlayer';
import FixedPlayer from './player/FixedPlayer';

const nodes = document.getElementsByClassName('audioigniter-root');

const App = ({ type, ...props }) => {
	if (type === 'simple') {
		return <SimplePlayer {...props} />;
	}

	if (type === 'fixed') {
		return <FixedPlayer {...props} />;
	}

	return <Player {...props} />;
};

App.propTypes = {
	type: PropTypes.string
};

Array.prototype.slice.call(nodes).forEach(node => {
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
});
