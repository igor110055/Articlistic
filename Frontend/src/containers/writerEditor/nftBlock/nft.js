import { Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNFT } from "./nftActions";
import axios from "axios";

const Nft = ({ onDataChange, data, readOnly }) => {
  const [search, setSearch] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);
  const [already, setAlready] = useState(false);
  const [respData, setRespData] = useState({});
  const [placeholder, setPlaceholder] = useState("Enter OpenSea URL");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { isGettingNFT, getNFTError } = useSelector((state) => ({
    isGettingNFT: state.nft.isGettingNFT,
    getNFTError: state.nft.getNFTError,
  }));

  // useEffect(() => {
  //     dispatch(getNFT(data.url.slice(data.url.search('assets/') + 7,)));
  //     setAlready(true);
  // }, [data.url]);

  // useEffect(() => {
  //     if (getNFTError) {
  //         setSubmited(false);
  //         setDataReceived(false);
  //         setAlready(false);
  //     } else {
  //         if (!isGettingNFT && (submited || already)) {
  //             setDataReceived(true);
  //         }
  //     }
  // }, [isGettingNFT]);

  const getData = async (token) => {
    const dataR = await axios
      .get(`https://api.opensea.io/api/v1/asset/${token}`)
      .then((resp) => resp.data)
      .catch((err) => {
        // console.log(err)
      });
    setRespData(dataR);
    setDataReceived(true);
  };

  useEffect(() => {
    if (data !== "") {
      getData(data.url.slice(data.url.search("assets/") + 7));
    }
  }, [data]);

  const classes = useStyles();
  const isValidNFTURL = () => {
    const regex = /https?:\/\/(?:opensea\.io\/)(?:assets\/)(0)([a-zA-Z]+([0-9]+[a-zA-Z]+)+)\/([0-9]+)/;
    return regex.test(search);
  };
  const handleEnter = () => {
    if (isValidNFTURL(search)) {
      setDataReceived(false);
      setSubmited(true);
      onDataChange(search);
      setPlaceholder("Enter OpenSea URL");
      setError(false);
      // const token = search.slice(search.search('assets/') + 7,);
      getData(search.slice(search.search("assets/") + 7));
    } else {
      setSubmited(false);
      setPlaceholder("Please enter correct OpenSea URL");
      setError(true);
    }
  };

  if (!data.url && readOnly) {
    return <></>;
  }

  return (
    <div>
      {!submited && data.url === "" ? (
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
          />
          {/* <Button onClick={handleEnter}>Search</Button> */}
        </div>
      ) : (
        <div>
          {dataReceived ? (
            <div className={classes.nftContainer}>
              <div className={classes.nft}>
                <div className={classes.nftHeader}>
                  <div>
                    <div className={classes.nftHeaderLeftTitle}>
                      {respData.collection.slug}
                    </div>
                    <div className={classes.nftSubtitle}>
                      {respData.name} NFTs
                    </div>
                  </div>
                  <div>NFT</div>
                </div>
                <div className={classes.nftImage}>
                  {respData.animation_url !== null ? (
                    <video width="100%" controls autoPlay>
                      <source src={respData.animation_url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={respData.image_original_url || respData.image_url}
                      className={classes.nftImage}
                    />
                  )}
                </div>
                <div className={classes.nftFooter}>
                  <div>
                    {/* <div>{respData.collection.description}</div> */}
                    <div className={classes.nftSubtitle}>
                      Created by {respData.asset_contract.name}
                    </div>
                  </div>
                  <a
                    href={respData.permalink}
                    target="_blank"
                    className={classes.nftButton}
                  >
                    <div>View on OpenSea</div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading</div>
          )}
          {/* <iframe src="https://open.spotify.com/embed/episode/1mWmPaLDeCZAtQwPmjwB1k?utm_source=generator" width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> */}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  nftContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "3%",
  },

  nft: {
    marginBottom: "5%",
    border: "2px solid #F7F7F7",
    width: "60%",
    fontSize: "12px",
  },

  nftHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "2%",
  },

  nftHeaderLeftTitle: {
    fontWeight: "bold",
  },

  nftSubtitle: {
    color: "#6B6B6B",
    marginTop: "2%",
  },

  nftImage: {
    width: "100%",
    // height: '50px',
  },

  nftFooter: {
    padding: "2%",
  },

  nftButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F7F7F7",
    fontWeight: "bold",
    padding: "2% 0% 2% 0%",
    margin: "2% 0% 0% 0%",
    textDecoration: "none !important",
    color: "#6B6B6B",
  },
});

export default Nft;
