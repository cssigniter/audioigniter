import React from 'react';
import { render } from 'react-dom';
import Promise from 'es6-promise'; // eslint-disable-line no-unused-vars
import 'whatwg-fetch';
import Player from './player/Player';


const nodes = document.getElementsByClassName('audioigniter-root');

Array.prototype.slice.call(nodes).forEach(node => {
	render(
		<Player
			tracksUrl={node.getAttribute('data-tracks-url')}
			displayTracklistCovers={JSON.parse(node.getAttribute('data-display-tracklist-covers'))}
			displayActiveCover={JSON.parse(node.getAttribute('data-display-active-cover'))}
			displayCredits={JSON.parse(node.getAttribute('data-display-credits'))}
			displayTracklist={JSON.parse(node.getAttribute('data-display-tracklist'))}
			displayTrackNo={JSON.parse(node.getAttribute('data-display-track-no'))}
			displayBuyButtons={JSON.parse(node.getAttribute('data-display-buy-buttons'))}
			displayArtistNames={JSON.parse(node.getAttribute('data-display-artist-names'))}
			cycleTracks={JSON.parse(node.getAttribute('data-cycle-tracks'))}
			limitTracklistHeight={JSON.parse(node.getAttribute('data-limit-tracklist-height'))}
			tracklistHeight={parseInt(node.getAttribute('data-tracklist-height'), 10)}
			reverseTrackOrder={JSON.parse(node.getAttribute('data-reverse-track-order'))}
			maxWidth={node.getAttribute('data-max-width')}
			soundcloudClientId={node.getAttribute('data-soundcloud-client-id')}
		/>,
		node
	);
});
