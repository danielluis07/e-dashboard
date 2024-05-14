"use client";

import { useEffect, useState } from "react";

interface ClockProps {
  date: Date;
}

export const Clock = ({ date }: ClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " ano" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + (interval > 1 ? "meses" : "mês");
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " dia" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hora" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minuto" + (interval > 1 ? "s" : "");
  }
  return seconds + " segundo" + (seconds > 1 ? "s" : "");
};
