import { useEffect, useState } from "react";

export const Timer = ({ time }) => {
  const [timer, setTime] = useState(time);
  useEffect(() => {
    if (timer > 0) {
      const a = setTimeout(() => {
        setTime(timer - 1);
      }, 1000);
    }
  });

  return <span className="get-code-text">Resend in {timer}s</span>;
};
