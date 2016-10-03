<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AudioIgniter_Sanitizer {
	/**
	 * Sanitizes a playlist (repeatable tracks).
	 *
	 * @since 1.0.0
	 *
	 * @uses AudioIgniter_Sanitizer::playlist_track()
	 *
	 * @param array $POST_tracks Input values to sanitize, as passed by the playlist metabox.
	 * @param int|null $post_id Optional. Post ID where the track belongs to.
	 *
	 * @return array
	 */
	public static function metabox_playlist( $POST_tracks, $post_id = null ) {
		if ( empty( $POST_tracks ) || ! is_array( $POST_tracks ) ) {
			return array();
		}

		$tracks = array();

		foreach( $POST_tracks as $uid => $track_data ) {
			$track = AudioIgniter_Sanitizer::playlist_track( $track_data, $post_id, $uid );
			if( $track !== false ) {
				$tracks[] = $track;
			}
		}

		return apply_filters( 'audioigniter_sanitize_playlist', $tracks, $POST_tracks, $post_id );
	}

	/**
	 * Sanitizes a single playlist track.
	 *
	 * @since 1.0.0
	 *
	 * @uses AudioIgniter::get_default_track_values()
	 *
	 * @param array $track Input values to sanitize.
	 * @param int|null $post_id Optional. Post ID where the track belongs to.
	 * @param string $track_uid Optional. UID that identifies the track in the metabox list.
	 *
	 * @return array|false Array if at least one field is completed, false otherwise.
	 */
	public static function playlist_track( $track, $post_id = null, $track_uid = '' ) {
		$track = wp_parse_args( $track, AudioIgniter::get_default_track_values() );

		$sanitized_track = array();

		$sanitized_track['cover_id']  = intval( $track['cover_id'] );
		$sanitized_track['title']     = sanitize_text_field( $track['title'] );
		$sanitized_track['artist']    = sanitize_text_field( $track['artist'] );
		$sanitized_track['track_url'] = esc_url_raw( $track['track_url'] );
		$sanitized_track['buy_link']  = esc_url_raw( $track['buy_link'] );

		$sanitized_track = array_map( 'trim', $sanitized_track );

		$tmp = array_filter( $sanitized_track );
		if ( empty( $tmp ) ) {
			$sanitized_track = false;
		}

		return apply_filters( 'audioigniter_sanitize_playlist_track', $sanitized_track, $track, $post_id, $track_uid );
	}

	/**
	 * Sanitizes a checkbox value.
	 *
	 * @since 1.0.0
	 *
	 * @param int|string|bool $input Input value to sanitize.
	 *
	 * @return int|string Returns 1 if $input evaluates to 1, an empty string otherwise.
	 */
	public static function checkbox( $input ) {
		if ( $input == 1 ) {
			return 1;
		}

		return '';
	}

	/**
	 * Sanitizes a checkbox value. Value is passed by reference.
	 *
	 * Useful when sanitizing form checkboxes. Since browsers don't send any data when a checkbox
	 * is not checked, checkbox() throws an error.
	 * checkbox_ref() however evaluates &$input as null so no errors are thrown.
	 *
	 * @since 1.0.0
	 *
	 * @param int|string|bool &$input Input value to sanitize.
	 *
	 * @return int|string Returns 1 if $input evaluates to 1, an empty string otherwise.
	 */
	public static function checkbox_ref( &$input ) {
		if ( $input == 1 ) {
			return 1;
		}

		return '';
	}


	/**
	 * Sanitizes integer input while differentiating zero from empty string.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $input Input value to sanitize.
	 *
	 * @return int|string Integer value (including zero), or an empty string otherwise.
	 */
	public static function intval_or_empty( $input ) {
		if ( is_null( $input ) || $input === false || $input === '' ) {
			return '';
		}

		if ( $input == 0 ) {
			return 0;
		}

		return intval( $input );
	}


	/**
	 * Returns a sanitized hex color code.
	 *
	 * @since 1.0.0
	 *
	 * @param string $str The color string to be sanitized.
	 * @param bool $return_hash Whether to return the color code prepended by a hash.
	 * @param string $return_fail The value to return on failure.
	 *
	 * @return string A valid hex color code on success, an empty string on failure.
	 */
	public static function hex_color( $str, $return_hash = true, $return_fail = '' ) {
		if( $str === false || empty( $str ) || $str == 'false' ) {
			return $return_fail;
		}

		// Allow keywords and predefined colors
		if ( in_array( $str, array( 'transparent', 'initial', 'inherit', 'black', 'silver', 'gray', 'grey', 'white', 'maroon', 'red', 'purple', 'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua', 'orange', 'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'limegreen', 'linen', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'whitesmoke', 'yellowgreen', 'rebeccapurple' ) ) ) {
			return $str;
		}

		// Include the hash if not there.
		// The regex below depends on in.
		if ( substr( $str, 0, 1 ) != '#' ) {
			$str = '#' . $str;
		}

		preg_match( '/(#)([0-9a-fA-F]{6})/', $str, $matches );

		if ( count( $matches ) == 3 ) {
			if ( $return_hash ) {
				return $matches[1] . $matches[2];
			} else {
				return $matches[2];
			}
		}

		return $return_fail;
	}


	/**
	 * Removes elements whose keys are not valid data-attribute names.
	 *
	 * @since 1.0.0
	 *
	 * @param array $array Input array to sanitize.
	 *
	 * @return array()
	 */
	public static function html_data_attributes_array( $array ) {
		$keys       = array_keys( $array );
		$key_prefix = 'data-';

		// Remove keys that are not data attributes.
		foreach ( $keys as $key ) {
			if ( substr( $key, 0, strlen( $key_prefix ) ) != $key_prefix ) {
				unset( $array[ $key ] );
			}
		}

		return $array;
	}


}