import React, { useEffect, useState } from "react";

const CountDown = ({ finishDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(finishDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Actualizar cada minuto

    return () => clearTimeout(timer);
  });

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div className="counterDiv">
      {timeLeft.days > 0 && (
        <h1>{` Finish on  ${timeLeft.days} 
         Days 🔥 `}</h1>
      )}
    </div>
  );
};

export default CountDown;
