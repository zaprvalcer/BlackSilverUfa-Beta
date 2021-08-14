import { useCallback, useState } from 'react';

export const useToggleState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const toggleValue = useCallback(() => setValue((current) => !current), []);
  return [value, toggleValue];
};
