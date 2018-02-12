=== AudioIgniter ===
Contributors: cssigniterteam, anastis, silencerius, tsiger
Tags: audio, sound, player, audio player, music player, mp3 player, music, radio stream, radio player, sound player, playlist
Requires at least: 4.8
Tested up to: 4.9.4
Stable tag: 1.4.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

AudioIgniter lets you create music playlists and embed them in your WordPress posts, pages or custom post types and serve your audio content in style!

== Description ==
Looking for a music player? AudioIgniter lets you create music playlists and embed them in your WordPress posts, pages or custom post types. By using the standard WordPress media upload functionality, you can create new audio playlists in minutes. Oh, you can use AudioIgniter to stream your radio show too!

https://www.youtube.com/watch?v=AmRDYlVW_3M

Check out [the demo](https://www.cssigniter.com/preview/audioigniter/) now!

**Features:**

* Unlimited playlists
* Unlimited tracks
* Responsive layout
* Embed through shortcode
* Flexible settings per playlist
* Show/Hide track listing
* Show/Hide track numbers in tracklist
* Show numbers in reverse order
* Show/Hide track covers in playlist
* Show/Hide active track’s cover
* Show artist name
* Custom "Buy track" URL field
* Limit track listing height
* Maximum player width
* Heavily tested on the 150 most popular free themes on WordPress.org

But wait, there's more. A [Pro version](https://www.cssigniter.com/ignite/plugins/audioigniter-pro) is also available! Here's what you get if you decide to upgrade:

* Bulk upload functionality
* Total color customization control
* Visual Composer support
* Widget & Shortcode available
* Rearrange tracks functionality
* Internal taxonomy for archiving purposes
* Fixed position player

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
