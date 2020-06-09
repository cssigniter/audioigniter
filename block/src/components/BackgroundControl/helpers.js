export const getBackgroundImageStyle = settings => {
  const { url, repeat, size, position, attachment } = settings;

  return {
    backgroundImage: url ? `url(${url})` : undefined,
    backgroundRepeat: repeat ? repeat : undefined,
    backgroundSize: size ? size : undefined,
    backgroundPosition: position ? position : undefined,
    backgroundAttachment: attachment ? attachment : undefined,
  };
};

export const getDefaultBackgroundImageValue = () => ({
  url: '',
  image: null,
  repeat: 'no-repeat',
  size: 'cover',
  position: 'top center',
  attachment: 'scroll',
  parallax: false,
  parallaxSpeed: 0.3,
});
