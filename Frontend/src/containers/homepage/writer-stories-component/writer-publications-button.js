import React,{useState} from "react";

import { ReactComponent as AttentiounLogo } from "../../../Images/HomepagePublicationSVG.svg";
const Writerpublicationsbutton = (props) => {
  const [activePublication, setActivePublication] = useState("");
  return (
    <>
      {props.publicationData.map((publication, idx) => (
        <button
          key={idx}
          className={`publication-button ${
            activePublication === publication ? "active-publication" : ""
          }`}
          onClick={() => {
            if(activePublication === publication){
              setActivePublication("");
              return;
            }  
            setActivePublication(publication)}}
        >
          <AttentiounLogo />
          <span className="publication-span">{publication}</span>
        </button>
      ))}
    </>
  );
};

export default Writerpublicationsbutton;
