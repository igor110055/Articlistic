// import { makeStyles } from "@mui/material";
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

  return (
    <div style={{ marginLeft: "1em", paddingRight: "2em" }}>
      Resend in {timer}s
    </div>
  );
};
