<?php
/**
 * AudioIgniter_Admin_Page_Upsell class.
 *
 * @since NewVersion
 */
class AudioIgniter_Admin_Page_Upsell {
	/**
	 * Settings tabs.
	 *
	 * @since NewVersion
	 *
	 * @var array
	 */
	protected $tabs = array();

	/**
	 * Settings page slug.
	 *
	 * @since NewVersion
	 */
	protected static $page_slug = 'audioigniter-upsell';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register' ) );

		$this->tabs = array(
			'general' => array(
				'title'    => _x( 'General', 'settings tab title', 'audioigniter' ),
				'callback' => array( $this, 'tab_general' ),
			),
		);
	}

	/**
	 * Register the page
	 *
	 * @since NewVersion
	 *
	 * @return void
	 */
	public function register() {
		$page_slug = 'edit.php?post_type=' . AudioIgniter()->post_type;
		add_submenu_page( $page_slug, __( 'AudioIgniter Settings', 'audioigniter' ), __( 'Go Pro!', 'audioigniter' ), 'manage_options', self::$page_slug, array( $this, 'render_page' ) );
	}

	/**
	 * Renders the onboarding page.
	 *
	 * @since NewVersion
	 */
	public function render_page() {
		$active_tab = isset( $_GET['tab'] ) ? sanitize_key( wp_unslash( $_GET['tab'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		if ( ! array_key_exists( $active_tab, $this->tabs ) ) {
			reset( $this->tabs );
			$active_tab = key( $this->tabs );
		}

		?>
		<div class="wrap ai-settings-wrap">
			<h2 class="ai-settings-header-title">
				<?php esc_html_e( 'AudioIgniter Settings', 'audioigniter' ); ?>
			</h2>

			<div class="ai-settings-main-wrap">

				<div class="ai-settings-wp-notices">
					<hr class="wp-header-end">
				</div>

				<div class="ai-settings-main">
					<?php $this->generate_tabs( $active_tab ); ?>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Creates the navigation tabs.
	 *
	 * @since NewVersion
	 */
	public function generate_tabs( $active_tab ) {
		?>
		<div class="ai-settings-main-content-nav-header ai-settings-box">
			<div class="ai-settings-main-content-nav">
				<?php foreach ( $this->tabs as $tab => $tab_info ) : ?>
					<?php if ( empty( $tab_info['title'] ) ) {
						continue;
					} ?>
					<a href="<?php echo esc_url( $this->get_tab_url( $tab ) ); ?>" class="ai-settings-main-content-nav-link <?php echo esc_attr( $active_tab === $tab ? 'is-active' : '' ); ?>"><?php echo esc_html( $tab_info['title'] ); ?></a>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="ai-settings-main-content tab-content-<?php echo esc_attr( $active_tab ); ?>">
			<?php if ( is_callable( $this->tabs[ $active_tab ]['callback'] ) ) {
				call_user_func( $this->tabs[ $active_tab ]['callback'], $active_tab );
			} ?>
		</div>
		<?php
	}

	public function tab_general( $active_tab ) {
		$stats_enabled = false;

		?>
		<form method="post" action="options.php">

		<div style="border:1px solid black; padding: 50px 15px; background-color: white;">
			TODO: Leave disabled option below and write some upsell stuff. Maybe add images. Or replace everything with upsell info.
		</div>

		<table class="form-table">
			<tr>
				<th scope="row"><label for="audioigniter_stats_enabled"><?php esc_html_e( 'Analytics', 'audioigniter' ); ?></label></th>
				<td>
					<label for="audioigniter_stats_enabled">
						<input disabled type="checkbox" id="audioigniter_stats_enabled" name="audioigniter_stats_enabled" value="1" <?php checked( 1, $stats_enabled ); ?>>
						<?php esc_html_e( 'Enable analytics', 'audioigniter' ); ?>
					</label>
					<p class="description" id="tagline-description">
						<?php esc_html_e( 'When disabled, no new events will be logged and processed into the database.', 'audioigniter' ); ?>
					</p>
				</td>
			</tr>
		</table>

		<?php submit_button(); ?>

		</form>
		<?php
	}

	/**
	 * Returns the setting page's URL.
	 *
	 * @since NewVersion
	 *
	 * @return string
	 */
	private function get_page_url() {
		return add_query_arg( array(
			'post_type' => 'ai_playlist',
			'page'      => self::$page_slug,
		), admin_url( 'edit.php' ) );
	}

	/**
	 * Returns the URL of a specific tab.
	 *
	 * @since NewVersion
	 *
	 * @return string
	 */
	private function get_tab_url( $tab ) {
		return add_query_arg( array(
			'tab' => $tab,
		), $this->get_page_url() );
	}

}
