import { useEffect, useState } from 'react';

export function useTouchDetection() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      try {
        document.createEvent('TouchEvent');
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    };
    setIsTouch(checkTouch());
  }, []);

  return isTouch;
}
