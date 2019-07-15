const multiSoundDisabled = () => {
  return (
    window.ai_pro_front_scripts &&
    !!window.ai_pro_front_scripts.multi_sound_disabled
  );
};

export default multiSoundDisabled;
