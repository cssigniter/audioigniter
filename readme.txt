=== AudioIgniter Music Player ===
Contributors: cssigniterteam, anastis, silencerius, tsiger
Tags: audio, sound, player, audio player, music player, mp3 player, music, radio stream, radio player, sound player, playlist
Requires at least: 5.0
Tested up to: 5.5.3
Stable tag: 1.6.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

AudioIgniter lets you create music playlists and embed them in your WordPress posts, pages or custom post types and serve your audio content in style!

== Description ==
Looking for an MP3 music player? AudioIgniter lets you create music playlists and embed them in your WordPress posts, pages or custom post types. By using the standard WordPress media upload functionality, you can create new audio playlists in minutes. Oh, you can use AudioIgniter to stream your radio show too!

https://www.youtube.com/watch?v=AmRDYlVW_3M

Check out [the demo](https://www.cssigniter.com/preview/audioigniter/) now!

**Selling digital music?**

You can combine [AudioIgniter with WooCommerce to easily sell individual tracks](https://www.cssigniter.com/sell-individual-tracks-using-audioigniter-with-woocommerce/).

**Features:**

* Supports audio and radio streaming
* Unlimited playlists
* Unlimited tracks
* 100% Compatible with Elementor
* 100% Compatible with Visual Composer
* 100% Compatible with Gutenberg Block Editor
* Responsive layout
* Embed through shortcode
* Flexible settings per playlist
* Show/Hide track listing
* Show/Hide track numbers in tracklist
* Show numbers in reverse order
* Show/Hide track covers in playlist
* Show/Hide active track’s cover
* Show/Hide artist name
* Custom "Buy track" URL field
* Custom "Download" URL field
* "Full" or "Simple" player mode (Great for podcasts)
* Limit track listing height
* Repeat track listing option
* Maximum player width
* Automatic ID3 Tag extraction from MP3 files
* Heavily tested on the 150 most popular free themes on WordPress.org

**Supported Services:**

* Acast
* Amazon S3
* Anchor
* Art19
* AudioBoom
* Castbox
* Captivate
* Icecast
* Podbean
* Radiojar
* Shoutcast
* Speaker
* Stitcher
* Libsyn

**But wait, there's more!**

A [Pro version](https://www.cssigniter.com/plugins/audioigniter) is also available! Here's what you get if you decide to upgrade:

* Bulk upload functionality
* Rearrange tracks functionality
* Stop Tracks From Other Players (Multiple Players In One Page)
* Track skipping functionality (You can adjust the number of seconds)
* Playback rate (1x, 1.5x, 2x)
* Lyrics per track
* Individual Track Repeat Mode
* Non-continuous playback (Stop each track after playing)
* Optional customizable delay between tracks
* Shuffle playlist mode
* Starting track option
* Default track timer to countdown mode
* Fixed position player (Continuous play must be supported by your theme)
* Internal taxonomy for archiving purposes
* Customize the colors through the Customizer
* Custom block for the Gutenberg Block Editor (With the ability to change colors per player)
* Widget & Shortcode available

**PREMIUM SUPPORT**
You can expect the same level of support for both the free and pro version of our plugin. Average response time: 24 hours.


== Installation ==
1. Upload the plugin files to the `/wp-content/plugins/audioigniter` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the "Plugins" screen in WordPress
3. In the WordPress admin dashboard you should see a new post type named "Playlists"
4. Navigate to the new Playlists post type and add your tracks!

== Screenshots ==
1. The AudioIgniter player
2. Managing your playlists via an intuitive and user friendly interface
3. Advanced player customization

== Changelog ==

= 1.7.0 =
* Added a loading spinner while the track is buffering.
* Developer note - Changed: Static property AudioIgniter::$version is now non-static and should be accessed as such.

= 1.6.3 =
* Fixed SVG appearance in TwentyTwenty theme.

= 1.6.2 =
* Fixed an issue where the download buttons would suggest an ugly filename consisting of the URL in a sanitized form.

= 1.6.1 =
* Fixed an issue where reverse track order would not work correctly under some particular option configurations.

= 1.6.0 =
* Change the layout of volume controls to be a bit more spacey.
* Hidden volume controls in mobile devices (improves player appearance in mobile).

= 1.5.1 =
* Minor performance improvements.

= 1.5.0 =
* Added new filters: 'aiStrings', 'audioigniter_get_playlist_data_attributes_array'.
* Added new actions: 'audioigniter_metabox_tracks_repeatable_track_fields_column_1', 'audioigniter_metabox_tracks_repeatable_track_fields_column_2', 'audioigniter_metabox_settings_group_player_track_listing_fields', 'audioigniter_metabox_settings_group_tracks_fields', 'audioigniter_metabox_settings_group_player_track_track_listing_repeat_fields'.
* Upgraded React / ReactDOM and dependencies to latest versions.
* Fixed issue with viewing buy/download buttons vs track repeat button.
* Fixed some untranslatable strings.
* Added base support for per-track Lyrics (requires Pro version).
* Added base support for single track looping (requires Pro version).
* Rearranged track listing settings layout.

= 1.4.2 =
* Accessibility enhancements.

= 1.4.1 =
* Developer enhancements.

= 1.4.0 =
* Code changes to accommodate a new player type, Global Footer Player, available in AudioIgniter Pro.
* Introduced AudioIgniter::is_playlist() for easier playlist ID validation.
* Added some translators comments.

= 1.3.0 =
* Added a new player type! From now on you can use a simpler playlist type if you don't need the full fledged player.
* Player type can now be selected via a simple dropdown.
* Updated some settings' labels to reflect the setting's function more accurately.
* Fixed an issue which prevented the player from working in IE11 sometimes.
* Fixed an issue where reversing a playlist would result in playing the incorrect tracks.
* Dropped IE9 support.

= 1.2.0 =
* Added support for initial volume setting.
* Show the tracklist toggle button when the tracklist is hidden by default.
* Added support for downloading tracks.
* Fixed issue where tracklist wouldn't display when there was only one track.

= 1.1.0 =
* Updated CSSIgniter links to https
* Added a button to enable repeating the playlist. Added admin option for the default state of the repeat button.
* Fixed a bug where the playlist would not get shown if it contained only one track.
* Added option to choose whether track links should open in a new window or not.

= 1.0.1 =
* Stop looping over the tracklist when the player finishes playing the last track.
* A couple of strings could not be translated.

= 1.0.0 =
* Initial release.
