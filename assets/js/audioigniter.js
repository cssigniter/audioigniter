/* eslint-env browser, jquery */
/* eslint-disable prefer-arrow-callback, prefer-template, func-names, no-var, object-shorthand, no-alert */
/* global wp ai_scripts */

jQuery(function($) {
  // Return early if ai_scripts are not available
  if (!ai_scripts) {
    // eslint-disable-line camelcase
    return;
  }

  // eslint-disable-next-line vars-on-top
  var AudioIgniter = (function() {
    var el = {
      $trackContainer: $(".ai-fields-container"),
      trackFieldClassName: ".ai-field-repeatable",
      $addTrackButton: $(".ai-add-field"),
      removeFieldButtonClassName: ".ai-remove-field",
      $removeAllTracksButton: $(".ai-remove-all-fields"),
      $batchUploadButton: $(".ai-add-field-batch"),
      audioUploadButtonClassName: ".ai-upload",
      coverUploadButtonClassName: ".ai-field-upload-cover",
      coverRemoveClassName: ".ai-remove-cover",
      fieldTitleClassName: ".ai-field-title",
      trackTitleClassName: ".ai-track-title",
      trackArtistClassName: ".ai-track-artist",
      trackLyricsClassName: ".ai-track-lyrics",
      trackUrlClassName: ".ai-track-url",
      hasCoverClass: "ai-has-cover",
      fieldHeadClassName: ".ai-field-head",
      fieldCollapsedClass: "ai-collapsed",
      $expandAllButton: $(".ai-fields-expand-all"),
      $collapseAllButton: $(".ai-fields-collapse-all"),
      $shortcodeInputField: $("#ai_shortcode"),
      soundCloudTrackClass: "ai-soundcloud-track"
    };

    /**
     * Generate a rfc4122 version 4 compliant UUID
     * http://stackoverflow.com/a/2117523
     *
     * @returns {string} - UUID
     */
    function uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0;
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    /**
     * Check if field is collapsed
     *
     * @param {Object} $field - jQuery object
     * @returns {*|boolean}
     */
    function isFieldCollapsed($field) {
      return $field.hasClass(el.fieldCollapsedClass);
    }

    /**
     * Collapse a field
     *
     * @param {Object} $field - jQuery object
     */
    function collapseField($field) {
      $field.addClass(el.fieldCollapsedClass);
    }

    /**
     * Expand a field
     *
     * @param {Object} $field - jQuery object
     */
    function expandField($field) {
      $field.removeClass(el.fieldCollapsedClass);
    }

    /**
     * Resets the cover image placeholder state
     *
     * @param {Object} $field - the remove button jQuery object
     */
    function resetCoverImage($field) {
      var $coverWrap = $field.find("." + el.hasCoverClass);

      $coverWrap
        .removeClass(el.hasCoverClass)
        .find("img")
        .attr("src", "")
        .attr("alt", "");
      $coverWrap
        .parent()
        .find("input")
        .val("");
    }

    /**
     * Resets a form field
     * - Clears input values
     * - Clears thumbnail
     *
     * @param {object} $field - the field's jQuery object
     * @param {string} [hash] - UUID or random hash
     */
    function resetField($field, hash) {
      var fieldHash = $field.data("uid");
      var newHash = hash || uuid();

      $field.attr("data-uid", newHash);
      $field
        .find("input, textarea")
        .not(":button")
        .each(function() {
          var $this = $(this);
          $this.attr("id", $this.attr("id").replace(fieldHash, newHash));
          $this.attr("name", $this.attr("name").replace(fieldHash, newHash));
          $this.val("");
        });
      $field.find("label").each(function() {
        var $this = $(this);
        $this.attr("for", $this.attr("for").replace(fieldHash, newHash));
      });
      $field.find(el.fieldTitleClassName).text("");
      $field.removeClass(el.soundCloudTrackClass);
      expandField($field);
      resetCoverImage($field);
    }

    /**
     * Checks if a track field is clear of values
     *
     * @param {object} $field - Track field jQuery object
     * @returns {boolean}
     */
    function isTrackFieldEmpty($field) {
      var isEmpty = true;
      var $inputs = $field.find("input");
      $inputs.each(function() {
        if ($(this).val()) {
          isEmpty = false;
        }
      });

      return isEmpty;
    }

    /**
     * Gets the first field from $trackContainer
     * and appends it back after resetting it
     *
     * @param {string} [hash] - UUID or random hash
     *
     * return {Object} - jQuery object
     */
    function getNewTrackField(hash) {
      var newHash = hash || uuid();
      var $clone = el.$trackContainer
        .find(el.trackFieldClassName)
        .first()
        .clone();
      resetField($clone, newHash);

      return $clone;
    }

    /**
     * Removes an element (or many) from the DOM
     * by fading it out first
     *
     * @param {Object} $el - jQuery object of the element(s) to be removed
     * @param {Function} [callback] - Optional callback
     */
    function removeElement($el, callback) {
      $el.fadeOut("fast", function() {
        $(this).remove();

        if (callback && typeof callback === "function") {
          callback();
        }
      });
    }

    /**
     * Populates a track field
     *
     * @param {Object} $field - The field's jQuery object
     * @param {Object} media - WP Media Manager media object
     */
    function populateTrackField($field, media) {
      var $urlInput = $field.find(el.trackUrlClassName);
      var $titleInput = $field.find(el.trackTitleClassName);
      var $artistInput = $field.find(el.trackArtistClassName);
      var $fieldTitle = $field.find(el.fieldTitleClassName);

      if (media.url) {
        $urlInput.val(media.url);
      }

      if (media.title && $titleInput.val() === "") {
        $titleInput.val(media.title);
        $fieldTitle.text(media.title);
      }

      if (media.meta && media.meta.artist && $artistInput.val() === "") {
        $artistInput.val(media.meta.artist);
      }
    }

    /**
     * Sets a cover image for the field
     *
     * @param $field - The field's jQuery object
     * @param {Object} cover - Cover object
     * @param {number} cover.id - Image ID
     * @param {string} cover.url - Image URL
     * @param {string} [cover.alt] - Image alt text
     */
    function setTrackFieldCover($field, cover) {
      var $coverField = $field.find(el.coverUploadButtonClassName);

      if (!cover || !cover.url || !cover.id) {
        return;
      }

      $coverField
        .find("img")
        .attr("src", cover.url)
        .attr("alt", cover.alt || "");

      $coverField
        .addClass(el.hasCoverClass)
        .siblings("input")
        .val(cover.id);
    }

    /**
     * Initializes the WordPress Media Manager
     *
     * @param {Object} opts - Options object
     * @param {string} opts.handler - Handler identifier of the media frame,
     * this allows multiple media manager frames with different functionalities
     * @param {string} [opts.type] - Filter media manager by type (audio, image etc)
     * @param {string} [opts.title=Select Media] - Title of the media manager frame
     * @param {boolean} [opts.multiple=false] - Accept multiple selections
     * @param {Function} [opts.onMediaSelect] - Do something after media selection
     */
    function wpMediaInit(opts) {
      if (!opts.handler) {
        throw new Error("Missing `handler` option");
      }

      /* eslint-disable */
      var multiple = opts.multiple || false;
      var title = opts.title || "Select media";
      var mediaManager = wp.media.frames[opts.handler];
      /* eslint-enable */

      if (mediaManager) {
        mediaManager.open();
        return;
      }

      mediaManager = wp.media({
        title: title,
        multiple: multiple,
        library: {
          type: opts.type
        }
      });

      mediaManager.open();

      mediaManager.on("select", function() {
        var attachments;
        var attachmentModels = mediaManager.state().get("selection");

        if (multiple) {
          attachments = attachmentModels.map(function(attachment) {
            return attachment.toJSON();
          });
        } else {
          attachments = attachmentModels.first().toJSON();
        }

        if (opts.onMediaSelect && typeof opts.onMediaSelect === "function") {
          opts.onMediaSelect(attachments);
        }
      });
    }

    /**
     * Collapsible bindings
     */
    el.$trackContainer.on("click", el.fieldHeadClassName, function(e) {
      var $this = $(this);
      var $parentField = $this.parents(el.trackFieldClassName);

      if (isFieldCollapsed($parentField)) {
        expandField($parentField);
      } else {
        collapseField($parentField);
      }

      e.preventDefault();
    });

    el.$expandAllButton.on("click", function(e) {
      expandField(el.$trackContainer.find(el.trackFieldClassName));
      e.preventDefault();
    });

    el.$collapseAllButton.on("click", function(e) {
      collapseField(el.$trackContainer.find(el.trackFieldClassName));
      e.preventDefault();
    });

    /**
     * Field control bindings
     * (Add, remove buttons etc)
     */

    /* Bind track title to title input value */
    el.$trackContainer.on("keyup", el.trackTitleClassName, function() {
      var $this = $(this);
      var $fieldTitle = $this
        .parents(el.trackFieldClassName)
        .find(el.fieldTitleClassName);
      $fieldTitle.text($this.val());
    });

    /* Add Track */
    el.$addTrackButton.on("click", function() {
      el.$trackContainer.append(getNewTrackField());
    });

    /* Remove Track */
    el.$trackContainer.on("click", el.removeFieldButtonClassName, function() {
      var $this = $(this);
      removeElement($this.parents(".ai-field-repeatable"));
    });

    /* Remove All Tracks */
    el.$removeAllTracksButton.on("click", function() {
      var $trackFields = el.$trackContainer.find(el.trackFieldClassName);

      if (window.confirm(ai_scripts.messages.confirm_clear_tracks)) {
        if ($trackFields.length > 1) {
          removeElement($trackFields.slice(1));
          resetField($trackFields);
        } else {
          resetField($trackFields);
        }
      }
    });

    /**
     * Bind media uploaders
     */

    /* Audio upload */
    el.$trackContainer.on("click", el.audioUploadButtonClassName, function() {
      var $this = $(this);
      var $parentTrackField = $this.parents(el.trackFieldClassName);

      wpMediaInit({
        handler: "ai-audio",
        title: ai_scripts.messages.media_title_upload,
        type: "audio",
        onMediaSelect: function(media) {
          populateTrackField($parentTrackField, media);
        }
      });
    });

    /**
     * Cover image upload
     *
     * Element `coverUploadButtonClassName` *must* have
     * an `img` and `coverRemoveClassName` elements
     * as children
     */
    el.$trackContainer
      .on("click", el.coverUploadButtonClassName, function(e) {
        var $this = $(this);

        wpMediaInit({
          handler: "ai-cover",
          title: ai_scripts.messages.media_title_upload_cover,
          type: "image",
          onMediaSelect: function(media) {
            setTrackFieldCover($this.parents(el.trackFieldClassName), {
              id: media.id,
              url: media.sizes.thumbnail.url,
              alt: media.alt
            });
          }
        });

        e.preventDefault();
      })
      /* Remove Image */
      .on("click", el.coverRemoveClassName, function(e) {
        var $this = $(this);
        resetCoverImage($this.parents(el.trackFieldClassName));
        e.stopPropagation();
        e.preventDefault();
      });

    /**
     * Hide / show options based on player type
     *
     * Different player types support different kind of options.
     * E.g. "Simple Player" doesn't support tracklist height, etc.
     */
    var $settingsWrap = $(".ai-module-settings");
    var $typeSelect = $(".ai-form-select-player-type");

    function getUnsupportedSettings($el) {
      var settingsString = $el.data("no-support");

      if (typeof settingsString !== "string") {
        return [];
      }

      return settingsString
        .replace(/\s/g, "") // remove all whitespace
        .split(",")
        .map(function(x) {
          return "_audioigniter_" + x;
        });
    }

    function filterUIBasedOnPlayerType($el) {
      var type = $el.val();

      // Reset styles
      var $shortcodeMetaBox = $("#ai-meta-box-shortcode");
      var $messageBox = $(".ai-player-type-message");
      var info = $el.data("info");

      $shortcodeMetaBox.show();

      if (info) {
        $messageBox.text(info).show();
      } else {
        $messageBox.text("").hide();
      }

      // Player specific controls
      switch (type) {
        case "global-footer":
          $shortcodeMetaBox.hide();
          break;
        default:
          return;
      }
    }

    function filterSettings() {
      var $formFields;
      var $type = $typeSelect.find(":selected");
      var unsupportedSettings = getUnsupportedSettings($type);

      filterUIBasedOnPlayerType($type);

      if (unsupportedSettings.length === 0) {
        $formFields = $settingsWrap.find(".ai-form-field");
        $formFields.show();
        return;
      }

      $settingsWrap.find("input", "select", "textarea").each(function() {
        var $this = $(this);
        var $parent = $this.parents(".ai-form-field");
        if (unsupportedSettings.indexOf($this.attr("name")) > -1) {
          $parent.hide();
        } else {
          $parent.show();
        }
      });
    }

    filterSettings();
    $typeSelect.on("change", filterSettings);

    /**
     * Shortcode select on click
     */
    el.$shortcodeInputField.on("click", function() {
      $(this).select();
    });

    /**
     * Export public methods and variables
     */
    return {
      elements: el,
      uuid: uuid,
      collapseField: collapseField,
      expandField: expandField,
      isFieldCollapsed: isFieldCollapsed,
      isTrackFieldEmpty: isTrackFieldEmpty,
      resetField: resetField,
      resetCoverImage: resetCoverImage,
      getNewTrackField: getNewTrackField,
      removeElement: removeElement,
      populateTrackField: populateTrackField,
      setTrackFieldCover: setTrackFieldCover,
      wpMediaInit: wpMediaInit
    };
  })();

  // Expose the AudioIgniter instance as a global
  if (!window.AudioIgniter) {
    window.AudioIgniter = AudioIgniter;
  }
});
