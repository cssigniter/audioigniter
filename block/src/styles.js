import Style from './components/Style';
import Rule from './components/Style/Rule';

const AudioIgniterPlaylistStyles = ({ attributes }) => {
  const {
    uniqueId,
    backgroundColor,
    textColor,
    accentColor,
    textOnAccentColor,
    controlColor,
    backgroundImage,
  } = attributes;

  const { url, repeat, size, position, attachment } = backgroundImage;

  return (
    <Style id={`audioigniter-block-${uniqueId}`}>
      <Rule rule=".ai-wrap { background-color: %s; }" value={backgroundColor} />
      <Rule
        rule=".ai-wrap .ai-volume-bar { border-right-color: %s; }"
        value={backgroundColor}
      />
      <Rule
        rule=".ai-wrap .ai-track-btn { border-left-color: %s; }"
        value={backgroundColor}
      />

      <Rule rule=".ai-wrap { background-image: url(%s); }" value={url} />
      <Rule rule=".ai-wrap { background-repeat: %s; }" value={repeat} />
      <Rule rule=".ai-wrap { background-size: %s; }" value={size} />
      <Rule rule=".ai-wrap { background-position: %s; }" value={position} />
      <Rule rule=".ai-wrap { background-attachment: %s; }" value={attachment} />

      <Rule
        rule=".ai-wrap,
				.ai-wrap .ai-btn,
				.ai-wrap .ai-track-btn { color: %s; }"
        value={textColor}
      />
      <Rule
        rule="
				.ai-wrap .ai-btn svg,
				.ai-wrap .ai-track-no-thumb svg,
				.ai-wrap .ai-track-btn svg { fill: %s; }"
        value={textColor}
      />

      <Rule
        rule=".ai-wrap .ai-audio-control,
				.ai-wrap .ai-audio-control:hover,
				.ai-wrap .ai-audio-control:focus,
				.ai-wrap .ai-track-progress,
				.ai-wrap .ai-volume-bar.ai-volume-bar-active::before,
				.ai-wrap .ai-track:hover,
				.ai-wrap .ai-track.ai-track-active,
				.ai-wrap .ai-btn.ai-btn-active { background-color: %s; }"
        value={accentColor}
      />
      <Rule
        rule=".ai-wrap .ai-scroll-wrap > div:last-child div { background-color: %s !important; }"
        value={accentColor}
      />
      <Rule
        rule="
				.ai-wrap .ai-btn:hover,
				.ai-wrap .ai-btn:focus,
				.ai-wrap .ai-footer a,
				.ai-wrap .ai-footer a:hover {
					color: %s;
				}"
        value={accentColor}
      />
      <Rule
        rule="
				.ai-wrap .ai-btn:hover svg,
				.ai-wrap .ai-btn:focus svg  {
					fill: %s;
				}"
        value={accentColor}
      />

      <Rule
        rule="
					.ai-wrap .ai-audio-control,
					.ai-wrap .ai-track:hover,
					.ai-wrap .ai-track.ai-track-active,
					.ai-wrap .ai-track.ai-track-active .ai-track-btn,
					.ai-wrap .ai-track:hover .ai-track-btn,
					.ai-wrap .ai-btn.ai-btn-active {
						color: %s;
					}
				"
        value={textOnAccentColor}
      />
      <Rule
        rule="
					.ai-wrap .ai-audio-control path,
					.ai-wrap .ai-track.ai-track-active .ai-track-btn path,
					.ai-wrap .ai-track:hover .ai-track-btn path,
					.ai-wrap .ai-btn.ai-btn-active path {
						fill: %s;
					}
				"
        value={textOnAccentColor}
      />

      <Rule
        rule="
					.ai-wrap .ai-track-progress-bar,
					.ai-wrap .ai-volume-bar,
					.ai-wrap .ai-btn,
					.ai-wrap .ai-btn:hover,
					.ai-wrap .ai-btn:focus,
					.ai-wrap .ai-track,
					.ai-wrap .ai-track-no-thumb {
						background-color: %s;
					}
				"
        value={controlColor}
      />
      <Rule
        rule="
					.ai-wrap .ai-scroll-wrap > div:last-child {
						background-color: %s;
					}
				"
        value={controlColor}
      />
      <Rule
        rule="
					.ai-wrap .ai-footer {
						border-top-color: %s;
					}
				"
        value={controlColor}
      />
      <Rule
        rule="
					.ai-wrap.ai-is-loading .ai-control-wrap-thumb::after,
					.ai-wrap.ai-is-loading .ai-track-title::after,
					.ai-wrap.ai-is-loading .ai-track-subtitle::after {
						background: %s;
					}
				"
        value={controlColor}
      />
    </Style>
  );
};

export default AudioIgniterPlaylistStyles;
