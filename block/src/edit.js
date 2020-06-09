import { Fragment } from 'wp.element';
import { __ } from 'wp.i18n';
import { useSelect } from 'wp.data';
import { SelectControl, PanelBody } from 'wp.components';
import { InspectorControls, PanelColorSettings } from 'wp.blockEditor';
import ServerSideRender from 'wp.serverSideRender';

import useUniqueId from './hooks/useUniqueId';
import LoadingResponsePlaceholder from './components/LoadingResponsePlaceholder';
import AudioIgniterPlaylistStyles from './styles';

const AudioIgniterPlayerEdit = ({
  attributes,
  setAttributes,
  className,
  clientId,
}) => {
  const {
    uniqueId,
    playerId,
    backgroundColor,
    textColor,
    accentColor,
    textOnAccentColor,
    controlColor,
  } = attributes;

  useUniqueId({ attributes, setAttributes, clientId });

  const { playlists = [] } = useSelect(select => {
    const { getEntityRecords } = select('core');

    return {
      playlists: getEntityRecords('postType', 'ai_playlist', {
        per_page: -1,
      }),
    };
  });

  return (
    <Fragment>
      <div id={`audioigniter-block-${uniqueId}`} className={className}>
        <AudioIgniterPlaylistStyles attributes={attributes} />

        <ServerSideRender
          block="audioigniter/player"
          attributes={{
            uniqueId,
            playerId,
          }}
          LoadingResponsePlaceholder={LoadingResponsePlaceholder}
        />
      </div>

      <InspectorControls>
        <PanelBody title={__('Settings')} initialOpen>
          <SelectControl
            label={__('Playlist')}
            value={playerId}
            options={[
              {
                label: __('Select a playlist'),
                value: null,
              },
              ...(playlists || []).map(playlist => ({
                label: playlist.title.raw,
                value: playlist.id,
              })),
            ]}
            onChange={value => setAttributes({ playerId: value })}
          />
        </PanelBody>

        <PanelColorSettings
          title={__('Player Appearance')}
          initialOpen={false}
          colorSettings={[
            {
              value: backgroundColor,
              onChange: value => setAttributes({ backgroundColor: value }),
              label: __('Background Color'),
            },
            {
              value: textColor,
              onChange: value => setAttributes({ textColor: value }),
              label: __('Text Color'),
            },
            {
              value: accentColor,
              onChange: value => setAttributes({ accentColor: value }),
              label: __('Accent Color'),
            },
            {
              value: textOnAccentColor,
              onChange: value => setAttributes({ textOnAccentColor: value }),
              label: __('Text on Accent Color'),
            },
            {
              value: controlColor,
              onChange: value => setAttributes({ controlColor: value }),
              label: __('Controls Color'),
            },
          ]}
        />
      </InspectorControls>
    </Fragment>
  );
};

export default AudioIgniterPlayerEdit;
