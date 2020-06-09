import { __ } from 'wp.i18n';
import { registerBlockType } from 'wp.blocks';

import AudioIgniterPlayerEdit from './edit';
import PlayerBlockIcon from './block-icon';

registerBlockType('audioigniter/player', {
  title: __('AudioIgniter Player'),
  description: __('Display your AudioIgniter player'),
  icon: PlayerBlockIcon,
  category: 'audioigniter',
  keywords: [__('playlist'), __('audioigniter'), __('player')],
  attributes: {
    uniqueId: {
      type: 'string',
    },
    playerId: {
      type: 'string',
    },
    backgroundColor: {
      type: 'string',
    },
    textColor: {
      type: 'string',
    },
    accentColor: {
      type: 'string',
    },
    textOnAccentColor: {
      type: 'string',
    },
    controlColor: {
      type: 'string',
    },
  },
  edit: AudioIgniterPlayerEdit,
  save: () => null,
});
