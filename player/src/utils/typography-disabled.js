const typographyDisabled = () => {
  return (
    window.ai_pro_front_scripts &&
    !!window.ai_pro_front_scripts.typography_disabled
  );
};

export default typographyDisabled;
