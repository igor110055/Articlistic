import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";

const Spotify = ({ onDataChange, data, readOnly }) => {
  const [search, setSearch] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [placeholder, setPlaceholder] = useState("Enter Spotify URL");
  const [error, setError] = useState(false);
  const handleEnter = () => {
    if (isValidSpotifyURL(search)) {
      setSubmited(true);
      onDataChange(search);
      setPlaceholder("Enter Spotify URL");
      setError(false);
    } else {
      setPlaceholder("Please enter correct Spotify URL");
      setError(true);
    }
  };

  const isValidSpotifyURL = (url) => {
    const regex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist|episode)\/|\?uri=spotify:track:)((\w|-){22})/;
    return regex.test(url);
  };


  const classes = useStyles();

  if(data.url && !submited) {
      return (
        <div>
        <div>
          <iframe
            src={`https://embed.spotify.com/?uri=${search || data.url}`}
            width="100%"
            height="155"
            style={{marginBottom: '0'}}
            frameBorder="0"
            allowtransparency="true"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
          {/* <iframe src="https://open.spotify.com/embed/episode/1mWmPaLDeCZAtQwPmjwB1k?utm_source=generator" width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> */}
        </div>
      </div>
      )
  } else if(!data.url && readOnly){
    return <div></div>
  }


  return (
    <div className={classes.spotifyEmbed}>
      {!submited && data.url  === "" ? (
        <div>
          <TextField
            variant="standard"
            fullWidth
            label={placeholder}
            error={error}
            onKeyDown={(e) => {
              if (e.keyCode == 13) {
                handleEnter();
              }
            }}
            onChange={(e) => {
              // setUrl(search);
              setSearch(e.target.value);
            }}
            id="he"
          />
          {/* <Button onClick={handleEnter}>Search</Button> */}
        </div>
      ) : (
        <div>
          <div>
            <iframe
              src={`https://embed.spotify.com/?uri=${search || data.url}`}
              width="100%"
              height="155"
              frameBorder="0"
              allowtransparency="true"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
            {/* <iframe src="https://open.spotify.com/embed/episode/1mWmPaLDeCZAtQwPmjwB1k?utm_source=generator" width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> */}
          </div>
        </div>
      )}

    
    </div>
  );
};
const useStyles = makeStyles({
  spotifyEmbed: {
    marginBottom: "3%",
    paddingTop: "2%",
  },
});

export default Spotify;
