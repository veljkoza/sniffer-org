import { useState, useEffect } from 'react';
const formatTime = (elapsedTime: number) => {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};
const useTimer = () => {
  const [hasTimerStarted, setHasTimerStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!hasTimerStarted) return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Cleanup function to stop the timer when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [hasTimerStarted]);

  const start = () => setHasTimerStarted(true);
  const stop = () => {
    setHasTimerStarted(false);
    setElapsedTime(0);
  };

  const formattedTime = formatTime(elapsedTime);

  return { hasTimerStarted, elapsedTime, formattedTime, start, stop };
};
export { useTimer };
