import { Fragment } from 'wp.element';
import PropTypes from 'prop-types';
import { __ } from 'wp.i18n';
import { MediaUpload } from 'wp.blockEditor';
import {
  SelectControl,
  Button,
  ToggleControl,
  RangeControl,
} from 'wp.components';

const propTypes = {
  setAttributes: PropTypes.func.isRequired,
  attributeKey: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  label: PropTypes.string,
  supportsParallax: PropTypes.bool,
};

const BackgroundControl = ({
  setAttributes,
  attributeKey,
  attributes,
  label = __('Background'),
  supportsParallax,
}) => {
  const backgroundImage = attributes[attributeKey];
  const setBackgroundSetting = setting => {
    setAttributes({
      backgroundImage: {
        ...backgroundImage,
        ...setting,
      },
    });
  };

  const {
    url,
    repeat,
    size,
    position,
    attachment,
    parallax,
    parallaxSpeed,
  } = backgroundImage;

  return (
    <div className="ci-control-background">
      <p className="ci-control-background-label">{label}</p>

      <div className="ci-control-background-image-wrap">
        {!url ? (
          <MediaUpload
            onSelect={image => {
              setBackgroundSetting({
                url: image.url,
                image,
              });
            }}
            allowedTypes={['image']}
            render={({ open }) => {
              return (
                <div className="ci-control-background-image-actions">
                  <Button isDefault onClick={open}>
                    {__('Choose Image')}
                  </Button>
                </div>
              );
            }}
          />
        ) : (
          <Fragment>
            <MediaUpload
              onSelect={image => {
                setBackgroundSetting({
                  url: image.url,
                  image,
                });
              }}
              allowedTypes={['image']}
              render={({ open }) => {
                return (
                  <Fragment>
                    <a
                      href="#"
                      className="ci-control-background-image-placeholder"
                      onClick={open}
                    >
                      <img src={url} alt="" />
                    </a>

                    <div className="ci-control-background-image-actions">
                      <Button isDefault onClick={open}>
                        {__('Change')}
                      </Button>

                      <Button
                        isDefault
                        onClick={() =>
                          setBackgroundSetting({ url: '', image: null })
                        }
                      >
                        {__('Remove')}
                      </Button>
                    </div>
                  </Fragment>
                );
              }}
            />
          </Fragment>
        )}
      </div>

      <div className="ci-split-field">
        <SelectControl
          label={__('Image Repeat')}
          value={repeat}
          options={[
            { value: 'no-repeat', label: __('No repeat') },
            { value: 'repeat', label: __('Tile') },
            { value: 'repeat-x', label: __('Tile Horizontally') },
            { value: 'repeat-y', label: __('Tile Vertically') },
          ]}
          onChange={value => setBackgroundSetting({ repeat: value })}
        />

        <SelectControl
          label={__('Image Position')}
          value={position}
          options={[
            { value: 'left top', label: __('Top left') },
            { value: 'center top', label: __('Top center') },
            { value: 'right top', label: __('Top right') },
            { value: 'left center', label: __('Center left') },
            { value: 'center center', label: __('Center') },
            { value: 'right center', label: __('Center right') },
            { value: 'left bottom', label: __('Bottom left') },
            { value: 'center bottom', label: __('Bottom center') },
            { value: 'right bottom', label: __('Bottom right') },
          ]}
          onChange={value => setBackgroundSetting({ position: value })}
        />
      </div>

      <div className="ci-split-field">
        <SelectControl
          label={__('Image Attachment')}
          value={attachment}
          options={[
            { value: 'scroll', label: __('Scroll') },
            { value: 'fixed', label: __('Fixed') },
          ]}
          onChange={value => setBackgroundSetting({ attachment: value })}
        />

        <SelectControl
          label={__('Image Size')}
          value={size}
          options={[
            { value: 'cover', label: __('Cover') },
            { value: 'contain', label: __('Contain') },
            { value: 'auto', label: __('Auto') },
          ]}
          onChange={value => setBackgroundSetting({ size: value })}
        />
      </div>

      {supportsParallax && !!url && (
        <Fragment>
          <ToggleControl
            label={__('Enable Parallax')}
            checked={parallax}
            onChange={value => setBackgroundSetting({ parallax: value })}
          />

          <RangeControl
            label={__('Parallax Speed')}
            value={parallaxSpeed}
            min={0}
            max={1}
            step={0.1}
            onChange={value => setBackgroundSetting({ parallaxSpeed: value })}
          />
        </Fragment>
      )}
    </div>
  );
};

BackgroundControl.propTypes = propTypes;

export default BackgroundControl;
