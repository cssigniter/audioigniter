<?php
/**
 * Plugin Name: AudioIgniter
 * Plugin URI: https://www.cssigniter.com/plugins/audioigniter/
 * Description: AudioIgniter lets you create music playlists and embed them in your WordPress posts, pages or custom post types and serve your audio content in style!
 * Author: The CSSIgniter Team
 * Author URI: https://www.cssigniter.com
 * Version: 1.7.0
 * Text Domain: audioigniter
 * Domain Path: languages
 *
 * AudioIgniter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * AudioIgniter Downloads is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AudioIgniter. If not, see <http://www.gnu.org/licenses/>.
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class AudioIgniter {

	/**
	 * AudioIgniter version.
	 *
	 * @var string
	 * @since 1.0.0
	 * @since 1.7.0 Changed from static to non-static.
	 */
	public $version = null;

	/**
	 * Instance of this class.
	 *
	 * @var AudioIgniter
	 * @since 1.0.0
	 */
	protected static $instance = null;

	/**
	 * Sanitizer instance.
	 *
	 * @var AudioIgniter_Sanitizer
	 * @since 1.0.0
	 */
	public $sanitizer = null;

	/**
	 * The URL directory path (with trailing slash) of the main plugin file.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected static $plugin_url = '';

	/**
	 * The filesystem directory path (with trailing slash) of the main plugin file.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected static $plugin_path = '';


	/**
	 * Playlist post type name.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public $post_type = 'ai_playlist';



	/**
	 * AudioIgniter Instance.
	 *
	 * Instantiates or reuses an instance of AudioIgniter.
	 *
	 * @since 1.0.0
	 * @static
	 * @see AudioIgniter()
	 * @return AudioIgniter - Single instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}


	/**
	 * AudioIgniter constructor. Intentionally left empty so that instances can be created without
	 * re-loading of resources (e.g. scripts/styles), or re-registering hooks.
	 * http://wordpress.stackexchange.com/questions/70055/best-way-to-initiate-a-class-in-a-wp-plugin
	 * https://gist.github.com/toscho/3804204
	 *
	 * @since 1.0.0
	 */
	public function __construct() {}

	/**
	 * Kickstarts plugin loading.
	 *
	 * @since 1.0.0
	 */
	public function plugin_setup() {
		if ( is_null( $this->version ) ) {
			if ( ! function_exists( 'get_plugin_data' ) ) {
				include_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			$plugin_data = get_plugin_data( __FILE__ );

			$this->version = $plugin_data['Version'];
		}

		self::$plugin_url  = plugin_dir_url( __FILE__ );
		self::$plugin_path = plugin_dir_path( __FILE__ );

		load_plugin_textdomain( 'audioigniter', false, dirname( self::plugin_basename() ) . '/languages' );

		include_once( 'class-audioigniter-sanitizer.php' );
		$this->sanitizer = new AudioIgniter_Sanitizer();

		// Initialization needed in every request.
		$this->init();

		// Initialization needed in admin requests.
		$this->admin_init();

		// Initialization needed in frontend requests.
		$this->frontend_init();

		do_action( 'audioigniter_loaded' );
	}

	/**
	 * Registers actions that need to be run on both admin and frontend
	 *
	 * @since 1.0.0
	 */
	protected function init() {
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_scripts' ) );
		add_action( 'init', array( $this, 'register_playlist_endpoint' ) );
		add_action( 'init', array( $this, 'register_image_sizes' ) );
		add_action( 'init', array( $this, 'register_shortcodes' ) );
		add_action( 'widgets_init', array( $this, 'register_widgets' ) );

		do_action( 'audioigniter_init' );
	}


	/**
	 * Registers actions that need to be run on admin only.
	 *
	 * @since 1.0.0
	 */
	protected function admin_init() {
		if ( ! is_admin() ) {
			return;
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_post' ) );

		do_action( 'audioigniter_admin_init' );
	}

	/**
	 * Registers actions that need to be run on frontend only.
	 *
	 * @since 1.0.0
	 */
	protected function frontend_init() {
		if ( is_admin() ) {
			return;
		}

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'template_redirect', array( $this, 'handle_playlist_endpoint' ) );

		do_action( 'audioigniter_frontend_init' );
	}

	/**
	 * Register (but not enqueue) all scripts and styles to be used throughout the plugin.
	 *
	 * @since 1.0.0
	 */
	public function register_scripts() {
		wp_register_style( 'audioigniter', $this->plugin_url() . 'player/build/style.css', array(), $this->version );
		wp_register_style( 'audioigniter-admin', $this->plugin_url() . 'assets/css/admin-styles.css', array(), $this->version );

		wp_register_script( 'audioigniter', $this->plugin_url() . 'player/build/app.js', array(), $this->version, true );
		wp_register_script( 'audioigniter-admin', $this->plugin_url() . 'assets/js/audioigniter.js', array(), $this->version, true );

		wp_localize_script( 'audioigniter', 'aiStrings', apply_filters( 'audioigniter_aiStrings', array(
			/* translators: %s is the track's title. */
			'play_title'          => esc_html__( 'Play %s', 'audioigniter' ),
			/* translators: %s is the track's title. */
			'pause_title'         => esc_html__( 'Pause %s', 'audioigniter' ),
			'previous'            => esc_html__( 'Previous track', 'audioigniter' ),
			'next'                => esc_html__( 'Next track', 'audioigniter' ),
			'toggle_list_repeat'  => esc_html__( 'Toggle track listing repeat', 'audioigniter' ),
			'toggle_track_repeat' => esc_html__( 'Toggle track repeat' ),
			'toggle_list_visible' => esc_html__( 'Toggle track listing visibility', 'audioigniter' ),
			'buy_track'           => esc_html__( 'Buy this track', 'audioigniter' ),
			'download_track'      => esc_html__( 'Download this track', 'audioigniter' ),
			'volume_up'           => esc_html__( 'Volume Up', 'audioigniter' ),
			'volume_down'         => esc_html__( 'Volume Down', 'audioigniter' ),
			'open_track_lyrics'   => esc_html__( 'Open track lyrics', 'audioigniter' ),
			'set_playback_rate'   => esc_html__( 'Set playback rate', 'audioigniter' ),
			'skip_forward'        => esc_html__( 'Skip forward', 'audioigniter' ),
			'skip_backward'       => esc_html__( 'Skip backward', 'audioigniter' ),
		) ) );

		wp_localize_script( 'audioigniter-admin', 'ai_scripts', array(
			'messages' => array(
				'confirm_clear_tracks'     => esc_html__( 'Do you really want to remove all tracks? (This will not delete your audio files).', 'audioigniter' ),
				'media_title_upload'       => esc_html__( 'Select or upload audio media', 'audioigniter' ),
				'media_title_upload_cover' => esc_html__( 'Select a cover image', 'audioigniter' ),
			),
		) );
	}

	/**
	 * Enqueues frontend scripts and styles.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_style( 'audioigniter' );
		wp_enqueue_script( 'audioigniter' );
	}

	/**
	 * Enqueues admin scripts and styles.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_admin_scripts( $hook ) {
		$screen = get_current_screen();

		if ( 'post' === $screen->base && $screen->post_type === $this->post_type ) {
			wp_enqueue_media();
			wp_enqueue_style( 'audioigniter-admin' );
			wp_enqueue_script( 'audioigniter-admin' );
		}
	}

	/**
	 * Post types registration.
	 *
	 * @since 1.0.0
	 */
	public function register_post_types() {
		$labels = array(
			'name'               => esc_html_x( 'Playlists', 'post type general name', 'audioigniter' ),
			'singular_name'      => esc_html_x( 'Playlist', 'post type singular name', 'audioigniter' ),
			'menu_name'          => esc_html_x( 'Playlists', 'admin menu', 'audioigniter' ),
			'name_admin_bar'     => esc_html_x( 'Playlist', 'add new on admin bar', 'audioigniter' ),
			'add_new'            => esc_html__( 'Add New Playlist', 'audioigniter' ),
			'add_new_item'       => esc_html__( 'Add New Playlist', 'audioigniter' ),
			'edit_item'          => esc_html__( 'Edit Playlist', 'audioigniter' ),
			'new_item'           => esc_html__( 'New Playlist', 'audioigniter' ),
			'view_item'          => esc_html__( 'View Playlist', 'audioigniter' ),
			'search_items'       => esc_html__( 'Search Playlists', 'audioigniter' ),
			'not_found'          => esc_html__( 'No playlists found', 'audioigniter' ),
			'not_found_in_trash' => esc_html__( 'No playlists found in the trash', 'audioigniter' ),
		);

		$args = array(
			'labels'          => $labels,
			'singular_label'  => esc_html_x( 'Playlist', 'post type singular name', 'audioigniter' ),
			'public'          => false,
			'show_ui'         => true,
			'capability_type' => 'post',
			'hierarchical'    => false,
			'has_archive'     => false,
			'supports'        => array( 'title' ),
			'menu_icon'       => 'dashicons-controls-volumeon',
		);

		register_post_type( $this->post_type, $args );
	}


	/**
	 * Registers metaboxes for the ai_playlist post type.
	 *
	 * @since 1.0.0
	 */
	public function add_meta_boxes() {
		add_meta_box( 'ai-meta-box-tracks', esc_html__( 'Tracks', 'audioigniter' ), array( $this, 'metabox_tracks' ), $this->post_type, 'normal', 'high' );
		add_meta_box( 'ai-meta-box-settings', esc_html__( 'Settings', 'audioigniter' ), array( $this, 'metabox_settings' ), $this->post_type, 'normal', 'high' );
		add_meta_box( 'ai-meta-box-shortcode', esc_html__( 'Shortcode', 'audioigniter' ), array( $this, 'metabox_shortcode' ), $this->post_type, 'normal', 'high' );
	}

	/**
	 * Echoes the Tracks metabox markup.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post $object
	 * @param array $box
	 */
	public function metabox_tracks( $object, $box ) {
		$tracks = $this->get_post_meta( $object->ID, '_audioigniter_tracks', array() );

		wp_nonce_field( basename( __FILE__ ), $object->post_type . '_nonce' );
		?>

		<?php $this->metabox_tracks_header(); ?>

		<div class="ai-container">
			<?php $this->metabox_tracks_field_controls(); ?>

			<?php $container_classes = apply_filters( 'audioigniter_metabox_tracks_container_classes', array( 'ai-fields-container' ) ); ?>

			<div class="<?php echo esc_attr( implode( ' ', $container_classes ) ); ?>">
				<?php
					if ( ! empty( $tracks ) ) {
						foreach ( $tracks as $track ) {
							$this->metabox_tracks_repeatable_track_field( $track );
						}
					} else {
						$this->metabox_tracks_repeatable_track_field();
					}
				?>
			</div>

			<?php $this->metabox_tracks_field_controls(); ?>
		</div>

		<?php $this->metabox_tracks_footer(); ?>

		<input type="hidden" name="ai_nonce" id="ai_nonce" value="<?php echo esc_attr( wp_create_nonce( self::plugin_basename() ) ); ?>"/>
		<?php
	}


	/**
	 * Echoes the Tracks metabox header.
	 *
	 * @since 1.0.0
	 */
	protected function metabox_tracks_header() {
		?>
		<div class="ai-header ai-brand-module">
			<div class="ai-row">
				<div class="ai-col-left">
					<a href="https://www.cssigniter.com/plugins/audioigniter?utm_source=dashboard&utm_medium=link&utm_content=audioigniter&utm_campaign=logo" target="_blank" class="ai-logo">
						<img
							src="<?php echo esc_url( $this->plugin_url() . 'assets/images/logo.svg' ); ?>"
							alt="<?php esc_attr_e( 'AudioIgniter Logo', 'audioigniter' ); ?>"
						>
					</a>
				</div>

				<?php if ( apply_filters( 'audioigniter_metabox_tracks_show_upgrade_button', true ) ) : ?>
					<div class="ai-col-right">
						<div class="ai-brand-module-actions">
							<a href="https://www.cssigniter.com/plugins/audioigniter?utm_source=dashboard&utm_medium=link&utm_content=audioigniter&utm_campaign=upgrade-pro" class="ai-btn ai-btn-green" target="_blank">
								<?php esc_html_e( 'Upgrade to Pro', 'audioigniter' ); ?>
							</a>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<?php
	}

	/**
	 * Echoes the Tracks metabox footer.
	 *
	 * @since 1.0.0
	 */
	protected function metabox_tracks_footer() {
		?>
		<div class="ai-footer ai-brand-module">
			<div class="ai-row">
				<div class="ai-col-left">
					<ul class="ai-list-inline ai-footer-links">
						<?php
							$links = apply_filters( 'audioigniter_metabox_tracks_footer_links', array(
								'support'       => array(
									'title' => __( 'Support', 'audioigniter' ),
									'url'   => 'https://wordpress.org/support/plugin/audioigniter',
								),
								'documentation' => array(
									'title' => __( 'Documentation', 'audioigniter' ),
									'url'   => 'https://www.cssigniter.com/docs/audioigniter/',
								),
								'rate_plugin'   => array(
									'title' => __( 'Rate this plugin', 'audioigniter' ),
									'url'   => 'https://wordpress.org/support/view/plugin-reviews/audioigniter',
								),
							) );

							foreach ( $links as $link ) {
								if ( empty( $link['url'] ) || empty( $link['title'] ) ) {
									continue;
								}

								echo sprintf( '<li><a href="%s" target="_blank">%s</a></li>',
									esc_url( $link['url'] ),
									esc_html( $link['title'] )
								);
							}
						?>
					</ul>
				</div>

				<div class="ai-col-right">
					<?php
						$url = 'https://www.cssigniter.com/plugins/audioigniter?utm_source=dashboard&utm_medium=link&utm_content=audioigniter&utm_campaign=footer-link';
						/* translators: %s is a URL. */
						$copy = sprintf( __( 'Thank you for creating with <a href="%s" target="_blank">AudioIgniter</a>', 'audioigniter' ),
							esc_url( $url )
						);
					?>
					<div class="ai-brand-module-actions">
						<p class="ai-note"><?php echo wp_kses( $copy, array( 'a' => array( 'href' => true, 'target' => true ) ) ); ?></p>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	protected function metabox_tracks_repeatable_track_field( $track = array() ) {
		$track = wp_parse_args( $track, self::get_default_track_values() );

		$cover_id     = $track['cover_id'];
		$title        = $track['title'];
		$artist       = $track['artist'];
		$track_url    = $track['track_url'];
		$buy_link     = $track['buy_link'];
		$download_url = $track['download_url'];

		$cover_url = wp_get_attachment_image_src( intval( $cover_id ), 'thumbnail' );
		if ( ! empty( $cover_url[0] ) ) {
			$cover_url  = $cover_url[0];
			$cover_data = wp_prepare_attachment_for_js( intval( $cover_id ) );
		} else {
			$cover_url  = '';
			$cover_data = '';
		}

		$uid = uniqid();

		$field_classes = apply_filters( 'audioigniter_metabox_track_classes', array( 'ai-field-repeatable' ), $track_url );
		?>
		<div class="<?php echo esc_attr( implode( ' ', $field_classes ) ); ?>" data-uid="<?php echo esc_attr( $uid ); ?>">
			<div class="ai-field-head">

				<?php do_action( 'audioigniter_metabox_tracks_repeatable_track_field_before_title' ); ?>

				<span class="ai-field-title"><?php echo wp_kses( $title, array() ); ?></span>

				<button type="button" class="ai-field-toggle button-link">
					<span class="screen-reader-text">
						<?php esc_html_e( 'Toggle track visibility', 'audioigniter' ); ?>
					</span>
					<span class="toggle-indicator"></span>
				</button>
			</div>

			<div class="ai-field-container">
				<div class="ai-field-cover">
					<a href="#" class="ai-field-upload-cover <?php echo ! empty( $cover_url ) ? 'ai-has-cover' : ''; ?>">
						<span class="ai-remove-cover">
							<span class="screen-reader-text">
								<?php esc_html_e( 'Remove Cover Image', 'audioigniter' ); ?>
							</span>
							<span class="dashicons dashicons-no-alt"></span>
						</span>

						<?php if ( ! empty( $cover_url ) ) : ?>
							<img src="<?php echo esc_url( $cover_url ); ?>" alt="<?php echo esc_attr( $cover_data['alt'] ); ?>">
						<?php else : ?>
							<img src="#" alt="">
						<?php endif; ?>

						<div class="ai-field-cover-placeholder">
							<span class="ai-cover-prompt">
								<?php esc_html_e( 'Upload Cover', 'audioigniter' ); ?>
							</span>
						</div>
					</a>

					<input
						type="hidden"
						id="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-cover_id"
						name="ai_playlist_tracks[<?php echo esc_attr( $uid ); ?>][cover_id]"
						value="<?php echo esc_attr( $cover_id ); ?>"
					/>
				</div>

				<div class="ai-field-split">
					<div class="ai-form-field">
						<label
							for="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-title"
							class="screen-reader-text">
							<?php esc_html_e( 'Title', 'audioigniter' ); ?>
						</label>
						<input
							type="text"
							id="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-title"
							class="ai-track-title"
							name="ai_playlist_tracks[<?php echo esc_attr( $uid ); ?>][title]"
							placeholder="<?php esc_attr_e( 'Title', 'audioigniter' ); ?>"
							value="<?php echo esc_attr( $title ); ?>"
						/>
					</div>
					<div class="ai-form-field">
						<label
							for="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-artist"
							class="screen-reader-text">
							<?php esc_html_e( 'Artist', 'audioigniter' ); ?>
						</label>
						<input
							type="text"
							id="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-artist"
							class="ai-track-artist"
							name="ai_playlist_tracks[<?php echo esc_attr( $uid ); ?>][artist]"
							placeholder="<?php esc_attr_e( 'Artist', 'audioigniter' ); ?>"
							value="<?php echo esc_attr( $artist ); ?>"
						/>
					</div>

					<div class="ai-form-field">
						<label
							for="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-buy_link"
							class="screen-reader-text">
							<?php esc_html_e( 'Buy link', 'audioigniter' ); ?>
						</label>
						<input
							type="text"
							id="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-buy_link"
							class="ai-track-buy-link"
							name="ai_playlist_tracks[<?php echo esc_attr( $uid ); ?>][buy_link]"
							placeholder="<?php esc_attr_e( 'Buy link', 'audioigniter' ); ?>"
							value="<?php echo esc_url( $buy_link ); ?>"
						/>
					</div>

					<?php do_action( 'audioigniter_metabox_tracks_repeatable_track_fields_column_1', $track, $uid ); ?>
				</div>

				<div class="ai-field-split">
					<div class="ai-form-field">
						<label
							for="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-track_url"
							class="screen-reader-text">
							<?php esc_html_e( 'Audio file or radio stream', 'audioigniter' ); ?>
						</label>

						<div class="ai-form-field-addon">
							<input
								type="text"
								id="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-track_url"
								class="ai-track-url"
								name="ai_playlist_tracks[<?php echo esc_attr( $uid ); ?>][track_url]"
								placeholder="<?php esc_attr_e( 'Audio file or radio stream', 'audioigniter' ); ?>"
								value="<?php echo esc_url( $track_url ); ?>"
							/>
							<button type="button" class="button ai-upload">
								<?php esc_html_e( 'Upload', 'audioigniter' ); ?>
							</button>

							<?php do_action( 'audioigniter_metabox_tracks_repeatable_track_field_after_track_upload_button' ); ?>
						</div>
					</div>

					<div class="ai-form-field">
						<label
							for="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-download_url"
							class="screen-reader-text">
							<?php esc_html_e( 'Download URL', 'audioigniter' ); ?>
						</label>
						<input
							type="text"
							id="ai_playlist_tracks-<?php echo esc_attr( $uid ); ?>-download_url"
							class="ai-track-download-url"
							name="ai_playlist_tracks[<?php echo esc_attr( $uid ); ?>][download_url]"
							placeholder="<?php esc_attr_e( 'Download URL', 'audioigniter' ); ?>"
							value="<?php echo esc_url( $download_url ); ?>"
						/>
					</div>

					<?php do_action( 'audioigniter_metabox_tracks_repeatable_track_fields_column_2', $track, $uid ); ?>

					<button type="button" class="button ai-remove-field">
						<span class="dashicons dashicons-dismiss"></span>
						<?php esc_html_e( 'Remove Track', 'audioigniter' ); ?>
					</button>
				</div>

			</div>
		</div>
		<?php
	}

	protected function metabox_tracks_field_controls() {
		?>
		<div class="ai-field-controls-wrap">
			<div class="ai-field-controls">
				<button type="button" class="button ai-add-field">
					<span class="dashicons dashicons-plus-alt"></span>
					<?php esc_html_e( 'Add Track', 'audioigniter' ); ?>
				</button>

				<?php do_action( 'audioigniter_metabox_tracks_field_controls' ); ?>

				<button type="button" class="button ai-remove-all-fields">
					<span class="dashicons dashicons-dismiss"></span>
					<?php esc_html_e( 'Clear Playlist', 'audioigniter' ); ?>
				</button>
			</div>

			<div class="ai-field-controls-visibility">
				<a href="#" class="ai-fields-expand-all">
					<?php esc_html_e( 'Expand All', 'audioigniter' ); ?>
				</a>
				<a href="#" class="ai-fields-collapse-all">
					<?php esc_html_e( 'Collapse All', 'audioigniter' ); ?>
				</a>
			</div>
		</div>
		<?php
	}

	/**
	 * Echoes the Settings metabox markup.
	 *
	 * @version 1.4.0
	 * @since   1.0.0
	 *
	 * @param WP_Post $object
	 * @param array $box
	 */
	public function metabox_settings( $object, $box ) {
		$type                       = $this->get_post_meta( $object->ID, '_audioigniter_player_type', 'full' );
		$numbers                    = $this->get_post_meta( $object->ID, '_audioigniter_show_numbers', 1 );
		$numbers_reverse            = $this->get_post_meta( $object->ID, '_audioigniter_show_numbers_reverse', 0 );
		$thumb                      = $this->get_post_meta( $object->ID, '_audioigniter_show_covers', 1 );
		$active_thumb               = $this->get_post_meta( $object->ID, '_audioigniter_show_active_cover', 1 );
		$artist                     = $this->get_post_meta( $object->ID, '_audioigniter_show_artist', 1 );
		$buy_links                  = $this->get_post_meta( $object->ID, '_audioigniter_show_buy_links', 1 );
		$buy_links_new_target       = $this->get_post_meta( $object->ID, '_audioigniter_buy_links_new_target', 1 );
		$cycle_tracks               = $this->get_post_meta( $object->ID, '_audioigniter_cycle_tracks', 0 );
		$track_listing              = $this->get_post_meta( $object->ID, '_audioigniter_show_track_listing', 1 );
		$track_listing_allow_toggle = $this->get_post_meta( $object->ID, '_audioigniter_allow_track_listing_toggle', 1 );
		$track_listing_allow_loop   = $this->get_post_meta( $object->ID, '_audioigniter_allow_track_listing_loop', 1 );
		$credit                     = $this->get_post_meta( $object->ID, '_audioigniter_show_credit', 0 );
		$limit_tracklisting_height  = $this->get_post_meta( $object->ID, '_audioigniter_limit_tracklisting_height', 1 );
		$tracklisting_height        = $this->get_post_meta( $object->ID, '_audioigniter_tracklisting_height', 185 );
		$volume                     = $this->get_post_meta( $object->ID, '_audioigniter_volume', 100 );
		$max_width                  = $this->get_post_meta( $object->ID, '_audioigniter_max_width' );

		wp_nonce_field( basename( __FILE__ ), $object->post_type . '_nonce' );
		?>
		<div class="ai-module ai-module-settings">
			<div class="ai-form-field-group">
				<h3 class="ai-form-field-group-title"><?php esc_html_e( 'Player &amp; Track listing', 'audioigniter' ); ?></h3>

				<div class="ai-form-field">
					<div class="ai-player-type-message ai-info-box"></div>
					<label for="_audioigniter_player_type">
						<?php esc_html_e( 'Player Type', 'audioigniter' ); ?>
					</label>

					<select
						class="widefat ai-form-select-player-type"
						id="_audioigniter_player_type"
						name="_audioigniter_player_type"
					>
						<?php foreach ( $this->get_player_types() as $player_key => $player_type ) : ?>
							<option
								value="<?php echo esc_attr( $player_key ); ?>"
								data-no-support="<?php echo esc_attr( implode( ', ', $player_type['no-support'] ) ); ?>"
								data-info="<?php echo esc_attr( $player_type['info'] ); ?>"
								<?php selected( $type, $player_key ); ?>
							>
								<?php echo wp_kses( $player_type['label'], 'strip' ); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_track_listing"
						name="_audioigniter_show_track_listing"
						value="1" <?php checked( $track_listing, true ); ?>
					/>

					<label for="_audioigniter_show_track_listing">
						<?php esc_html_e( 'Show track listing by default', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_allow_track_listing_toggle"
						name="_audioigniter_allow_track_listing_toggle"
						value="1" <?php checked( $track_listing_allow_toggle, true ); ?>
					/>

					<label for="_audioigniter_allow_track_listing_toggle">
						<?php esc_html_e( 'Show track listing visibility toggle button', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_numbers_revese"
						name="_audioigniter_show_numbers_reverse"
						value="1" <?php checked( $numbers_reverse, true ); ?>
					/>

					<label for="_audioigniter_show_numbers_revese">
						<?php esc_html_e( 'Reverse track order', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<label for="_audioigniter_volume">
						<?php esc_html_e( 'Starting volume', 'audioigniter' ); ?>
					</label>

					<input
						type="number"
						min="0"
						max="100"
						step="10"
						id="_audioigniter_volume"
						class="ai-track-title"
						name="_audioigniter_volume"
						placeholder="<?php esc_attr_e( '0-100', 'audioigniter' ); ?>"
						value="<?php echo esc_attr( $volume ); ?>"
					/>

					<p class="ai-field-help">
						<?php esc_html_e( 'Enter a value between 0 and 100 in increments of 10', 'audioigniter' ); ?>
					</p>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_limit_tracklisting_height"
						name="_audioigniter_limit_tracklisting_height"
						value="1" <?php checked( $limit_tracklisting_height, true ); ?>
					/>

					<label for="_audioigniter_limit_tracklisting_height">
						<?php esc_html_e( 'Limit track listing height', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<label for="_audioigniter_tracklisting_height">
						<?php esc_html_e( 'Track listing height', 'audioigniter' ); ?>
					</label>

					<input
						type="number"
						min="10"
						step="5"
						id="_audioigniter_tracklisting_height"
						class="ai-track-title"
						name="_audioigniter_tracklisting_height"
						placeholder="<?php esc_attr_e( 'Track listing height', 'audioigniter' ); ?>"
						value="<?php echo esc_attr( $tracklisting_height ); ?>"
					/>

					<p class="ai-field-help">
						<?php esc_html_e( 'Set a number of pixels', 'audioigniter' ); ?>
					</p>
				</div>

				<div class="ai-form-field">
					<label for="_audioigniter_max_width">
						<?php esc_html_e( 'Maximum player width', 'audioigniter' ); ?>
					</label>

					<input
						type="number"
						id="_audioigniter_max_width"
						class="ai-track-title"
						name="_audioigniter_max_width"
						placeholder="<?php esc_attr_e( 'Automatic width', 'audioigniter' ); ?>"
						value="<?php echo esc_attr( $max_width ); ?>"
					/>

					<p class="ai-field-help">
						<?php esc_html_e( 'Set a number of pixels, or leave empty to automatically cover 100% of the available area (recommended).', 'audioigniter' ); ?>
					</p>
				</div>

				<?php do_action( 'audioigniter_metabox_settings_group_player_track_listing_fields', $object, $box ); ?>
			</div>

			<div class="ai-form-field-group">
				<h3 class="ai-form-field-group-title"><?php esc_html_e( 'Tracks', 'audioigniter' ); ?></h3>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_numbers"
						name="_audioigniter_show_numbers"
						value="1" <?php checked( $numbers, true ); ?>
					/>

					<label for="_audioigniter_show_numbers">
						<?php esc_html_e( 'Show track numbers in tracklist', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_covers"
						name="_audioigniter_show_covers"
						value="1" <?php checked( $thumb, true ); ?>
					/>

					<label for="_audioigniter_show_covers">
						<?php esc_html_e( 'Show track covers in tracklist', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_active_cover"
						name="_audioigniter_show_active_cover"
						value="1" <?php checked( $active_thumb, true ); ?>
					/>

					<label for="_audioigniter_show_active_cover">
						<?php esc_html_e( "Show active track's cover", 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_artist"
						name="_audioigniter_show_artist"
						value="1" <?php checked( $artist, true ); ?>
					/>

					<label for="_audioigniter_show_artist">
						<?php esc_html_e( 'Show artist names', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_show_buy_links"
						name="_audioigniter_show_buy_links"
						value="1" <?php checked( $buy_links, true ); ?>
					/>

					<label for="_audioigniter_show_buy_links">
						<?php esc_html_e( 'Show track extra buttons (buy link, download button etc)', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_buy_links_new_target"
						name="_audioigniter_buy_links_new_target"
						value="1" <?php checked( $buy_links_new_target, true ); ?>
					/>

					<label for="_audioigniter_buy_links_new_target">
						<?php esc_html_e( 'Open buy links in new window', 'audioigniter' ); ?>
					</label>
				</div>

				<?php do_action( 'audioigniter_metabox_settings_group_tracks_fields', $object, $box ); ?>
			</div>

			<div class="ai-form-field-group">
				<h3 class="ai-form-field-group-title"><?php esc_html_e( 'Track &amp; Track listing repeat', 'audioigniter' ); ?></h3>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_cycle_tracks"
						name="_audioigniter_cycle_tracks"
						value="1" <?php checked( $cycle_tracks, true ); ?>
					/>

					<label for="_audioigniter_cycle_tracks">
						<?php esc_html_e( 'Repeat track listing enabled by default', 'audioigniter' ); ?>
					</label>
				</div>

				<div class="ai-form-field">
					<input
						type="checkbox"
						class="ai-checkbox"
						id="_audioigniter_allow_track_listing_loop"
						name="_audioigniter_allow_track_listing_loop"
						value="1" <?php checked( $track_listing_allow_loop, true ); ?>
					/>

					<label for="_audioigniter_allow_track_listing_loop">
						<?php esc_html_e( 'Show track listing repeat toggle button', 'audioigniter' ); ?>
					</label>
				</div>

				<?php do_action( 'audioigniter_metabox_settings_group_player_track_track_listing_repeat_fields', $object, $box ); ?>
			</div>

			<div class="ai-form-field">
				<input
					type="checkbox"
					class="ai-checkbox"
					id="_audioigniter_show_credit"
					name="_audioigniter_show_credit"
					value="1" <?php checked( $credit, true ); ?>
				/>

				<label for="_audioigniter_show_credit">
					<?php esc_html_e( 'Show "Powered by AudioIgniter" link', 'audioigniter' ); ?>
				</label>

				<p class="ai-field-help">
					<?php esc_html_e( "We've put a great deal of effort into building this plugin. If you feel like it, let others know about it by enabling this option.", 'audioigniter' ); ?>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Echoes the Shortcode metabox markup.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post $object
	 * @param array $box
	 */
	public function metabox_shortcode( $object, $box ) {
		?>
		<div class="ai-module ai-module-shortcode">
			<div class="ai-form-field">
				<label for="ai_shortcode">
					<?php esc_html_e( 'Grab the shortcode', 'audioigniter' ); ?>
				</label>

				<input
					type="text"
					class="code"
					id="ai_shortcode"
					name="ai_shortcode"
					value="<?php echo esc_attr( sprintf( '[ai_playlist id="%s"]', $object->ID ) ); ?>"
				/>

			</div>
		</div>
		<?php
	}

	/**
	 * Returns the available player types and their data.
	 *
	 * @version 1.4.0
	 * @since   1.4.0
	 *
	 * @return array
	 */
	public function get_player_types() {
		// Each player type has a number of settings that it might not support
		// E.g. "Simple Player" does not support track listing visibility, covers
		// and others. Provide every setting that's not supported based on the `name`
		// attribute of each setting input (input, select, textarea), *without
		// the _audioigniter_ prefix* in the `no-support` array.
		// To allow support for every setting simply set `no-support` to an empty array.

		$player_types = array(
			'full'   => array(
				'label'      => __( 'Full Player', 'audioigniter' ),
				'no-support' => array(),
				'info'       => '',
			),
			'simple' => array(
				'label'      => __( 'Simple Player', 'audioigniter' ),
				'no-support' => array(
					'show_track_listing',
					'show_covers',
					'show_active_cover',
					'limit_tracklisting_height',
					'tracklisting_height',
					'allow_track_listing_loop',
					'allow_track_listing_toggle',
					'skip_amount',
					'initial_track',
				),
				'info'       => '',
			),
		);

		return apply_filters( 'audioigniter_player_types', $player_types );
	}

	public function save_post( $post_id ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return false; }
		if ( isset( $_POST['post_view'] ) && 'list' === $_POST['post_view'] ) { return false; }
		if ( ! isset( $_POST['post_type'] ) || $_POST['post_type'] !== $this->post_type ) { return false; }
		if ( ! isset( $_POST[ $this->post_type . '_nonce' ] ) || ! wp_verify_nonce( $_POST[ $this->post_type . '_nonce' ], basename( __FILE__ ) ) ) { return false; }
		$post_type_obj = get_post_type_object( $this->post_type );
		if ( ! current_user_can( $post_type_obj->cap->edit_post, $post_id ) ) { return false; }

		update_post_meta( $post_id, '_audioigniter_tracks', $this->sanitizer->metabox_playlist( $_POST['ai_playlist_tracks'], $post_id ) );

		update_post_meta( $post_id, '_audioigniter_show_numbers', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_numbers'] ) );
		update_post_meta( $post_id, '_audioigniter_show_numbers_reverse', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_numbers_reverse'] ) );
		update_post_meta( $post_id, '_audioigniter_show_covers', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_covers'] ) );
		update_post_meta( $post_id, '_audioigniter_show_active_cover', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_active_cover'] ) );
		update_post_meta( $post_id, '_audioigniter_show_artist', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_artist'] ) );
		update_post_meta( $post_id, '_audioigniter_show_buy_links', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_buy_links'] ) );
		update_post_meta( $post_id, '_audioigniter_buy_links_new_target', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_buy_links_new_target'] ) );
		update_post_meta( $post_id, '_audioigniter_cycle_tracks', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_cycle_tracks'] ) );
		update_post_meta( $post_id, '_audioigniter_show_track_listing', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_track_listing'] ) );
		update_post_meta( $post_id, '_audioigniter_allow_track_listing_toggle', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_allow_track_listing_toggle'] ) );
		update_post_meta( $post_id, '_audioigniter_allow_track_listing_loop', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_allow_track_listing_loop'] ) );
		update_post_meta( $post_id, '_audioigniter_player_type', $this->sanitizer->player_type( $_POST['_audioigniter_player_type'] ) );
		update_post_meta( $post_id, '_audioigniter_show_credit', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_show_credit'] ) );
		update_post_meta( $post_id, '_audioigniter_limit_tracklisting_height', $this->sanitizer->checkbox_ref( $_POST['_audioigniter_limit_tracklisting_height'] ) );
		update_post_meta( $post_id, '_audioigniter_tracklisting_height', intval( $_POST['_audioigniter_tracklisting_height'] ) );
		update_post_meta( $post_id, '_audioigniter_volume', intval( $_POST['_audioigniter_volume'] ) );
		update_post_meta( $post_id, '_audioigniter_max_width', $this->sanitizer->intval_or_empty( $_POST['_audioigniter_max_width'] ) );

		/**
		 * @since 1.4.0
		 */
		do_action( 'audioigniter_save_post', $post_id );
	}

	public static function get_default_track_values() {
		return apply_filters( 'audioigniter_default_track_values', array(
			'cover_id'     => '',
			'title'        => '',
			'artist'       => '',
			'track_url'    => '',
			'buy_link'     => '',
			'download_url' => '',
		) );
	}

	public function register_image_sizes() {
		add_image_size( 'audioigniter_cover', 560, 560, true );
	}

	public function register_widgets() {
		$widgets = apply_filters( 'audioigniter_register_widgets', array() );

		foreach ( $widgets as $class => $file ) {
			require_once( $file );
			register_widget( $class );
		}
	}

	public function register_shortcodes() {
		add_shortcode( 'ai_playlist', array( $this, 'shortcode_ai_playlist' ) );
	}

	/**
	 * Checks whether passed post object or ID is an AudioIgniter playlist.
	 *
	 * @version 1.4.0
	 * @since   1.4.0
	 *
	 * @param int|WP_Post $post Post ID or post object.
	 *
	 * @return bool
	 */
	public function is_playlist( $post ) {
		$post = get_post( $post );

		if ( is_wp_error( $post ) || empty( $post ) || is_null( $post ) || $post->post_type !== $this->post_type ) {
			return false;
		}

		return true;
	}

	/**
	 * Returns a data attributes array for the given playlist.
	 *
	 * @version 1.4.0
	 * @since   1.4.0
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return array
	 */
	public function get_playlist_data_attributes_array( $post_id ) {
		$post_id = intval( $post_id );

		if ( ! $this->is_playlist( $post_id ) ) {
			return array();
		}

		$attrs = array(
			'data-player-type'              => $this->get_post_meta( $post_id, '_audioigniter_player_type', 'full' ),
			'data-tracks-url'               => add_query_arg( array( 'audioigniter_playlist_id' => $post_id ), home_url( '/' ) ),
			'data-display-track-no'         => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_numbers', 1 ) ),
			'data-reverse-track-order'      => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_numbers_reverse', 0 ) ),
			'data-display-tracklist-covers' => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_covers', 1 ) ),
			'data-display-active-cover'     => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_active_cover', 1 ) ),
			'data-display-artist-names'     => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_artist', 1 ) ),
			'data-display-buy-buttons'      => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_buy_links', 1 ) ),
			'data-buy-buttons-target'       => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_buy_links_new_target', 1 ) ),
			'data-cycle-tracks'             => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_cycle_tracks', 0 ) ),
			'data-display-credits'          => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_credit', 1 ) ),
			'data-display-tracklist'        => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_show_track_listing', 1 ) ),
			'data-allow-tracklist-toggle'   => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_allow_track_listing_toggle', 1 ) ),
			'data-allow-tracklist-loop'     => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_allow_track_listing_loop', 1 ) ),
			'data-limit-tracklist-height'   => $this->convert_bool_string( $this->get_post_meta( $post_id, '_audioigniter_limit_tracklisting_height', 1 ) ),
			'data-volume'                   => intval( $this->get_post_meta( $post_id, '_audioigniter_volume', 100 ) ),
			'data-tracklist-height'         => intval( $this->get_post_meta( $post_id, '_audioigniter_tracklisting_height', 185 ) ),
			'data-max-width'                => $this->get_post_meta( $post_id, '_audioigniter_max_width' ),
		);

		return apply_filters( 'audioigniter_get_playlist_data_attributes_array', $attrs, $post_id );
	}

	/**
	 * Returns the output of the [ai_playlist] shortcode.
	 *
	 * @version 1.4.0
	 * @since   1.0.0
	 *
	 * @param array       $atts    The shortcode attributes.
	 * @param string|null $content Content, when used with a shortcode closing tag.
	 * @param string      $tag     The shortcode name used to reach this function.
	 *
	 * @return string
	 */
	public function shortcode_ai_playlist( $atts, $content = null, $tag ) {
		$atts = shortcode_atts( array(
			'id' => '',
		), $atts, $tag );

		$id = intval( $atts['id'] );

		if ( ! $this->is_playlist( $id ) ) {
			return '';
		}

		$post = get_post( $id );

		$params = apply_filters( 'audioigniter_shortcode_data_attributes_array', $this->get_playlist_data_attributes_array( $id ), $id, $post );
		$params = array_filter( $params, array( $this->sanitizer, 'array_filter_empty_null' ) );
		$params = $this->sanitizer->html_data_attributes_array( $params );

		// Returning a truthy value from the filter, will short-circuit execution of the shortcode.
		if ( false !== apply_filters( 'audioigniter_shortcode_shortcircuit', false, $id, $post, $params ) ) {
			return '';
		}

		$data = '';
		foreach ( $params as $attribute => $value ) {
			$data .= sprintf( '%s="%s" ', sanitize_key( $attribute ), esc_attr( $value ) );
		}

		$output = sprintf( '<div id="audioigniter-%s" class="audioigniter-root" %s></div>',
			esc_attr( $id ),
			$data
		);

		return $output;
	}

	public function convert_bool_string( $value ) {
		if ( $value ) {
			return 'true';
		}

		return 'false';
	}

	public function register_playlist_endpoint() {
		add_rewrite_tag( '%audioigniter_playlist_id%', '([0-9]+)' );
		add_rewrite_rule( '^audioigniter/playlist/([0-9]+)/?', 'index.php?audioigniter_playlist_id=$matches[1]', 'bottom' );
	}

	public function handle_playlist_endpoint() {
		global $wp_query;

		$playlist_id = $wp_query->get( 'audioigniter_playlist_id' );

		if ( empty( $playlist_id ) ) {
			return;
		}

		$playlist_id = intval( $playlist_id );
		$post        = get_post( $playlist_id );

		if ( empty( $post ) || $post->post_type !== $this->post_type ) {
			wp_send_json_error( __( "ID doesn't match a playlist", 'audioigniter' ) );
		}

		$response = array();
		$tracks   = $this->get_post_meta( $playlist_id, '_audioigniter_tracks', array() );

		foreach ( $tracks as $track ) {
			$track          = wp_parse_args( $track, self::get_default_track_values() );
			$track_response = array();

			$track_response['title']            = $track['title'];
			$track_response['subtitle']         = $track['artist'];
			$track_response['audio']            = $track['track_url'];
			$track_response['buyUrl']           = $track['buy_link'];
			$track_response['downloadUrl']      = $track['download_url'];
			$track_response['downloadFilename'] = $this->get_filename_from_url( $track['download_url'] );

			if ( ! $track_response['downloadFilename'] ) {
				$track_response['downloadFilename'] = $track_response['downloadUrl'];
			}

			$cover_url = wp_get_attachment_image_src( intval( $track['cover_id'] ), 'audioigniter_cover' );
			if ( ! empty( $cover_url[0] ) ) {
				$cover_url = $cover_url[0];
			} else {
				$cover_url = '';
			}

			$track_response['cover'] = $cover_url;

			$track_response = apply_filters( 'audioigniter_playlist_endpoint_track', $track_response, $track, $playlist_id, $post );

			$response[] = $track_response;
		}

		wp_send_json( $response );
	}

	function get_filename_from_url( $url ) {
		$struct = wp_parse_url( $url );

		if ( ! empty( $struct['path'] ) ) {
			return basename( $struct['path'] );
		}

		return '';
	}

	public function get_all_playlists( $orderby = 'date', $order = 'DESC' ) {
		$q = new WP_Query( array(
			'post_type'      => $this->post_type,
			'posts_per_page' => - 1,
			'orderby'        => $orderby,
			'order'          => $order,
		) );

		return $q->posts;
	}

	public function get_post_meta( $post_id, $key, $default = '' ) {
		$keys = get_post_custom_keys( $post_id );

		$value = $default;

		if ( is_array( $keys ) && in_array( $key, $keys, true ) ) {
			$value = get_post_meta( $post_id, $key, true );
		}

		return $value;
	}

	public function plugin_activated() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		$this->register_post_types();

		do_action( 'audioigniter_activated' );

		flush_rewrite_rules();
	}

	public function plugin_deactivated() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		unregister_post_type( $this->post_type );

		do_action( 'audioigniter_deactivated' );

		flush_rewrite_rules();
	}

	public static function plugin_basename() {
		return plugin_basename( __FILE__ );
	}

	public function plugin_url() {
		return self::$plugin_url;
	}

	public function plugin_path() {
		return self::$plugin_path;
	}
}


/**
 * Main instance of AudioIgniter.
 *
 * Returns the working instance of AudioIgniter. No need for globals.
 *
 * @since  1.0.0
 * @return AudioIgniter
 */
function AudioIgniter() {
	return AudioIgniter::instance();
}

add_action( 'plugins_loaded', array( AudioIgniter(), 'plugin_setup' ) );
register_activation_hook( __FILE__, array( AudioIgniter(), 'plugin_activated' ) );
register_deactivation_hook( __FILE__, array( AudioIgniter(), 'plugin_deactivated' ) );
