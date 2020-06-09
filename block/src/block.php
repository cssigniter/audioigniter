<?php
	add_action( 'init', 'audioigniter_player_block_init' );
	function audioigniter_player_block_init () {
		register_block_type('audioigniter/player', array(
			'attributes' => array(
				'uniqueId'          => array(
					'type' => 'string',
				),
				'playerId'          => array(
					'type' => 'string',
				),
				'backgroundColor'   => array(
					'type' => 'string',
				),
				'backgroundImage'   => array(
					'type' => 'object',
				),
				'textColor'         => array(
					'type' => 'string',
				),
				'accentColor'       => array(
					'type' => 'string',
				),
				'textOnAccentColor' => array(
					'type' => 'string',
				),
				'controlColor'      => array(
					'type' => 'string',
				),
			),
			'render_callback' => 'audioigniter_player_block_render_callback',
		) );
	}

	function audioigniter_player_block_defaults() {
		return array(
			'uniqueId'          => false,
			'playerId'          => false,
			'backgroundColor'   => false,
			'backgroundImage'   => false,
			'textColor'         => false,
			'accentColor'       => false,
			'textOnAccentColor' => false,
			'controlColor'      => false,
		);
	}

	function audioigniter_player_block_generate_styles( $attributes ) {
		ob_start();

		$attributes = wp_parse_args( $attributes, audioigniter_player_block_defaults() );

		$unique_id            = $attributes['uniqueId'];
		$background_color     = $attributes['backgroundColor'];
		$background_image     = $attributes['backgroundImage'];
		$text_color           = $attributes['textColor'];
		$accent_color         = $attributes['accentColor'];
		$text_on_accent_color = $attributes['textOnAccentColor'];
		$control_color        = $attributes['controlColor'];

		$id = '#audioigniter-block-' . $unique_id;

		if ( $background_color ) {
			echo wp_kses_post( sprintf( '
				%1$s .ai-wrap { background-color: %2$s; }
				%1$s .ai-wrap .ai-volume-bar { border-right-color: %2$s; }
				%1$s .ai-wrap .ai-track-btn { border-left-color: %2$s; }
			', esc_html( $id ), sanitize_hex_color( $background_color ) ) );
		}

		if ( $background_image && $background_image['url'] ) {
			$background_image_url        = $background_image['url'];
			$background_image_repeat     = $background_image['repeat'];
			$background_image_size       = $background_image['size'];
			$background_image_position   = $background_image['position'];
			$background_image_attachment = $background_image['attachment'];
			?>
			<?php echo $id; ?> .ai-wrap {
				background-image: url('<?php echo esc_url_raw( $background_image_url ); ?>');
				<?php if ( $background_image_repeat ) : ?>
					background-repeat: <?php echo $background_image_repeat; ?>;
				<?php endif; ?>
				<?php if ( $background_image_position ) : ?>
					background-position: <?php echo $background_image_position; ?>;
				<?php endif; ?>
				<?php if ( $background_image_size ) : ?>
					background-size: <?php echo $background_image_size; ?>;
				<?php endif; ?>
				<?php if ( $background_image_attachment ) : ?>
					background-attachment: <?php echo $background_image_attachment; ?>;
				<?php endif; ?>
			}
			<?php
		}

		if ( $text_color ) {
			echo wp_kses_post( sprintf( '
				%1$s .ai-wrap,
				%1$s .ai-wrap .ai-btn,
				%1$s .ai-wrap .ai-track-btn {
					color: %2$s;
			}

				%1$s .ai-wrap .ai-btn svg,
				%1$s .ai-wrap .ai-track-no-thumb svg,
				%1$s .ai-wrap .ai-track-btn svg {
					fill: %2$s;
			}
			', esc_html( $id ), sanitize_hex_color( $text_color ) ) );
		}

		if ( $accent_color ) {
			echo wp_kses_post( sprintf( '
				%1$s .ai-wrap .ai-audio-control,
				%1$s .ai-wrap .ai-audio-control:hover,
				%1$s .ai-wrap .ai-audio-control:focus,
				%1$s .ai-wrap .ai-track-progress,
				%1$s .ai-wrap .ai-volume-bar.ai-volume-bar-active::before,
				%1$s .ai-wrap .ai-track:hover,
				%1$s .ai-wrap .ai-track.ai-track-active,
				%1$s .ai-wrap .ai-btn.ai-btn-active {
					background-color: %2$s;
			}

				%1$s .ai-wrap .ai-scroll-wrap > div:last-child div {
					background-color: %2$s !important;
			}

				%1$s .ai-wrap .ai-btn:hover,
				%1$s .ai-wrap .ai-btn:focus,
				%1$s .ai-wrap .ai-footer a,
				%1$s .ai-wrap .ai-footer a:hover {
					color: %2$s;
			}

				%1$s .ai-wrap .ai-btn:hover path,
				%1$s .ai-wrap .ai-btn:focus path  {
					fill: %2$s;
			}
			', esc_html( $id ), sanitize_hex_color( $accent_color ) ) );
		}

		if ( $text_on_accent_color ) {
			echo wp_kses_post( sprintf( '
				%1$s .ai-wrap .ai-audio-control,
				%1$s .ai-wrap .ai-track:hover,
				%1$s .ai-wrap .ai-track.ai-track-active,
				%1$s .ai-wrap .ai-track.ai-track-active .ai-track-btn,
				%1$s .ai-wrap .ai-track:hover .ai-track-btn,
				%1$s .ai-wrap .ai-btn.ai-btn-active {
					color: %2$s;
			}

				%1$s .ai-wrap .ai-audio-control path,
				%1$s .ai-wrap .ai-track.ai-track-active .ai-track-btn path,
				%1$s .ai-wrap .ai-track:hover .ai-track-btn path,
				%1$s .ai-wrap .ai-btn.ai-btn-active path {
					fill: %2$s;
			}
			', esc_html( $id ), sanitize_hex_color( $text_on_accent_color ) ) );
		}

		if ( $control_color ) {
			echo wp_kses_post( sprintf( '
				%1$s .ai-wrap .ai-track-progress-bar,
				%1$s .ai-wrap .ai-volume-bar,
				%1$s .ai-wrap .ai-btn,
				%1$s .ai-wrap .ai-btn:hover,
				%1$s .ai-wrap .ai-btn:focus,
				%1$s .ai-wrap .ai-track,
				%1$s .ai-wrap .ai-track-no-thumb {
					background-color: %2$s;
			}

				%1$s .ai-wrap .ai-scroll-wrap > div:last-child {
					background-color: %2$s;
				}

				%1$s .ai-wrap .ai-footer {
					border-top-color: %2$s;
			}

				%1$s .ai-wrap.ai-is-loading .ai-control-wrap-thumb::after,
				%1$s .ai-wrap.ai-is-loading .ai-track-title::after,
				%1$s .ai-wrap.ai-is-loading .ai-track-subtitle::after {
					background: %2$s;
			}
			', esc_html( $id ), sanitize_hex_color( $control_color ) ) );
		}

		$css = ob_get_clean();

		return $css;
	}

	function audioigniter_player_block_render_callback ( $attributes ) {
		$attributes = wp_parse_args( $attributes, audioigniter_player_block_defaults() );

		$unique_id = $attributes['uniqueId'];
		$player_id = $attributes['playerId'];

		if ( empty( $player_id ) ) {
			return esc_html__( 'Select a playlist from the block settings.', 'audioigniter' );
		}

		ob_start();

		$css = audioigniter_player_block_generate_styles( $attributes );
		if ( trim( $css ) ) {
			?>
			<style>
				<?php echo wp_kses_post( $css ); ?>
			</style>
			<?php
		}

		?>
		<div id="<?php echo esc_attr( 'audioigniter-block-' . $unique_id ); ?>">
			<?php echo do_shortcode( sprintf( '[ai_playlist id="%s"]', esc_attr( $player_id ) ) ); ?>
		</div>
		<?php

		$response = ob_get_clean();

		return $response;
	}

