import { useEffect, useRef } from 'react';

export const useDebounce = <T>(
  fn: (val: T) => void,
  delay: number,
  value: T,
) => {
  const fnRef = useRef(fn);
  
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fnRef.current(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);
};
