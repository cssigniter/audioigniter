<?php
	function audioigniter_player_block_init () {
		register_block_type('audioigniter/player', array(
			'attributes' => array(
				'uniqueId' => array(
					'type' => 'string',
				),
				'playerId' => array(
					'type' => 'string',
				),
				'backgroundColor' => array(
					'type' => 'string',
				),
				'textColor' => array(
					'type' => 'string',
				),
				'accentColor' => array(
					'type' => 'string',
				),
				'textOnAccentColor' => array(
					'type' => 'string',
				),
				'controlColor' => array(
					'type' => 'string',
				),
			),
			'render_callback' => 'audioigniter_player_block_render_callback',
		) );
	}

	function generate_styles( $attributes ) {
		ob_start();

		$unique_id            = $attributes['uniqueId'];
		$background_color     = $attributes['backgroundColor'];
		$text_color           = $attributes['textColor'];
		$accent_color         = $attributes['accentColor'];
		$text_on_accent_color = $attributes['textOnAccentColor'];
		$control_color        = $attributes['controlColor'];

		$id = '#audioigniter-block-' . $unique_id;

		// TODO clean this mess? Cleaner / prettier way to output $id and styles ?
		if ( $background_color ) {
			?>
			<?php echo $id; ?> .ai-wrap { background-color: <?php echo $background_color; ?>; }
			<?php echo $id; ?> .ai-wrap .ai-volume-bar { border-right-color: <?php echo $background_color; ?> }
			<?php echo $id; ?> .ai-wrap .ai-track-btn { border-left-color: <?php echo $background_color; ?> }
			<?php
		}

		if ( $text_color ) {
			?>
			<?php echo $id; ?> .ai-wrap,
			<?php echo $id; ?> .ai-wrap .ai-btn,
			<?php echo $id; ?> .ai-wrap .ai-track-btn {
				color: <?php echo $text_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap .ai-btn svg,
			<?php echo $id; ?> .ai-wrap .ai-track-no-thumb svg,
			<?php echo $id; ?> .ai-wrap .ai-track-btn svg {
				fill: <?php echo $text_color; ?>
			}
			<?php
		}

		if ( $accent_color ) {
			?>
			<?php echo $id; ?> .ai-wrap .ai-audio-control,
			<?php echo $id; ?> .ai-wrap .ai-audio-control:hover,
			<?php echo $id; ?> .ai-wrap .ai-audio-control:focus,
			<?php echo $id; ?> .ai-wrap .ai-track-progress,
			<?php echo $id; ?> .ai-wrap .ai-volume-bar.ai-volume-bar-active::before,
			<?php echo $id; ?> .ai-wrap .ai-track:hover,
			<?php echo $id; ?> .ai-wrap .ai-track.ai-track-active,
			<?php echo $id; ?> .ai-wrap .ai-btn.ai-btn-active {
				background-color: <?php echo $accent_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap .ai-scroll-wrap > div:last-child div {
				background-color: <?php echo $accent_color; ?> !important;
			}

			<?php echo $id; ?> .ai-wrap .ai-btn:hover,
			<?php echo $id; ?> .ai-wrap .ai-btn:focus,
			<?php echo $id; ?> .ai-wrap .ai-footer a,
			<?php echo $id; ?> .ai-wrap .ai-footer a:hover {
				color: <?php echo $accent_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap .ai-btn:hover path,
			<?php echo $id; ?> .ai-wrap .ai-btn:focus path  {
				fill: <?php echo $accent_color; ?>;
			}
			<?php
		}

		if ( $text_on_accent_color ) {
			?>
			<?php echo $id; ?> .ai-wrap .ai-audio-control,
			<?php echo $id; ?> .ai-wrap .ai-track:hover,
			<?php echo $id; ?> .ai-wrap .ai-track.ai-track-active,
			<?php echo $id; ?> .ai-wrap .ai-track.ai-track-active .ai-track-btn,
			<?php echo $id; ?> .ai-wrap .ai-track:hover .ai-track-btn,
			<?php echo $id; ?> .ai-wrap .ai-btn.ai-btn-active {
				color: <?php echo $text_on_accent_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap .ai-audio-control path,
			<?php echo $id; ?> .ai-wrap .ai-track.ai-track-active .ai-track-btn path,
			<?php echo $id; ?> .ai-wrap .ai-track:hover .ai-track-btn path,
			<?php echo $id; ?> .ai-wrap .ai-btn.ai-btn-active path {
				fill: <?php echo $text_on_accent_color; ?>;
			}
			<?php
		}

		if ( $control_color ) {
			?>
			<?php echo $id; ?> .ai-wrap .ai-track-progress-bar,
			<?php echo $id; ?> .ai-wrap .ai-volume-bar,
			<?php echo $id; ?> .ai-wrap .ai-btn,
			<?php echo $id; ?> .ai-wrap .ai-btn:hover,
			<?php echo $id; ?> .ai-wrap .ai-btn:focus,
			<?php echo $id; ?> .ai-wrap .ai-track,
			<?php echo $id; ?> .ai-wrap .ai-track-no-thumb {
				background-color: <?php echo $control_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap .ai-scroll-wrap > div:last-child {
				background-color: <?php echo $control_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap .ai-footer {
				border-top-color: <?php echo $control_color; ?>;
			}

			<?php echo $id; ?> .ai-wrap.ai-is-loading .ai-control-wrap-thumb::after,
			<?php echo $id; ?> .ai-wrap.ai-is-loading .ai-track-title::after,
			<?php echo $id; ?> .ai-wrap.ai-is-loading .ai-track-subtitle::after {
				background: <?php echo $control_color; ?>;
			}
			<?php
		}

		$css = ob_get_clean();

		return $css;
	}

	function audioigniter_player_block_render_callback ( $attributes ) {
		$unique_id        = $attributes['uniqueId'];
		$player_id        = $attributes['playerId'];
		$background_color = $attributes['backgroundColor'];

		if ( empty( $player_id ) ) {
			return esc_html__( 'Select a playlist from the block settings.', 'audioigniter' );
		}

		ob_start();

		if ( $background_color ) {
			?>
			<style>
			<?php echo generate_styles( $attributes ); ?>
			</style>

			<div id="<?php echo 'audioigniter-block-' . $unique_id ?>">
			<?php
		}

		echo do_shortcode( '[ai_playlist id="' . $player_id . '"]' );

		echo '</div>';

		$response = ob_get_clean();

		return $response;
	}

	add_action( 'init', 'audioigniter_player_block_init' );
