import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialSeconds = 0, countDown = false) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;}
    return `${pad(minutes)}:${pad(seconds)}`;
  }


  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (countDown) {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);

    // Limpieza obligatoria al pausar o desmontar el componente
    return () => clearInterval(interval);
  }, [isRunning, countDown]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return { seconds, isRunning, start, pause, reset, formatTime };
}