import { useEffect } from 'wp.element';

// Keep a list of existing ids here
// so that when we duplicate a block we can generate a new uniqueId.
const ids = [];

const useUniqueId = ({ attributes, setAttributes, clientId }) => {
  const { uniqueId } = attributes;

  useEffect(() => {
    if (!uniqueId || ids.includes(uniqueId)) {
      const newId = clientId.substr(2, 9);
      ids.push(newId);
      setAttributes({ uniqueId: newId });
      return;
    }

    if (uniqueId && !ids.includes(uniqueId)) {
      ids.push(uniqueId);
    }
  }, []);
};

export default useUniqueId;
