import styled from "styled-components";
import { Button, TextField } from "@mui/material";
import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const handleMouseOver = (e) => {
  e.target.style.cursor = "pointer";
};

export const ATextField = styled(TextField)`
  fieldset {
    border-radius: 10px;
  }
  & label.Mui-focused {
    color: #0fc7fc;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #0fc7fc;
    }
  }
  & .MuiFormHelperText-root {
    /*font-family: Poppins;*/
  }
`;

/* Common BlueTextField for every component(for example => These are being used in Login) */
export const BlueTextField = styled(TextField)`
  fieldset {
    border-radius: 10px;
    /*font-family: Poppins;*/
  }
  & label.Mui-focused {
    color: #0fc7fc;
    /*font-family: Poppins;*/
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #0fc7fc;
      /*font-family: Poppins;*/
    }
  }
  & .MuiFormHelperText-root {
    /*font-family: Poppins;*/
  }
`;

export const PublicationTextField = styled(TextField)`

fieldset {
  border-radius: 10px;
}

& label.Mui-focused {
  color: #FF7500;
}
'& .MuiOutlinedInput-root': {
  '& fieldset': {
    border-radius: "16px 16px 16px 16px",
  },
},
& .MuiOutlinedInput-root {
  &.Mui-focused fieldset {
    border-color: #FF7500;
  }
`;

export const AButton = styled(Button)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 1,
  borderRadius: 3,
  // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  fontFamily: "Poppins",
  color: "white",
  height: 48,
  // padding: '0 30px',
});

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (number) => {
  // eslint-disable-next-line
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(number);
};

export const validateURL = (link) => {
  // eslint-disable-next-line
  const regx =
    /^(?:https:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
  return regx.test(link);
};

export const validatePassword = (password) => {
  // eslint-disable-next-line
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}/;
  return regex.test(password);
};

export const validateUserName = (uName) => {
  const regex = /^[a-zA-Z][A-Za-z0-9-]*[a-zA-Z0-9]+$/;
  if (uName.length < 3 || uName.length > 25) return false;
  return regex.test(uName);
};



export const publicationAboutDefault = {
  time: 1643888103531,
  blocks: [
    {
      id: "hg0c4YP-Ks",
      type: "header",
      data: {
        text: "Why follow?",
        level: 1,
      },
    },
    {
      id: "vTHArw8I86",
      type: "paragraph",
      data: {
        text: 'Follow to get full access to the newsletter and <a href="https://www.attentioun.com">website</a>. Never miss an update.',
      },
    },
    {
      id: "tZ4OGRXPb4",
      type: "header",
      data: {
        text: "Stay up-to-date",
        level: 2,
      },
    },
    {
      id: "XoVRideYLU",
      type: "paragraph",
      data: {
        text: "You won’t have to worry about missing anything. Every new edition of the newsletter goes directly to your inbox and your homepage.",
      },
    },
    {
      id: "0FshJSsJao",
      type: "header",
      data: {
        text: "Join the crew",
        level: 2,
      },
    },
    {
      id: "HfwJlwuvzk",
      type: "paragraph",
      data: {
        text: 'Be part of a community of people who share your interests. To find out more about the company that provides the tech for this newsletter, visit <a href="https://www.attentioun.com">Attentioun.com</a>',
      },
    },
  ],
  version: "2.22.2",
};
