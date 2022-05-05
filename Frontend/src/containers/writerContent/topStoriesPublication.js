// import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../../utils/apiEndPoints";
import { getAuthToken } from "../common/commonFunctions";
import TopStoriesCard from "./topStoriesCard";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const TopStoriesPublication = ({ publication, writerName }) => {
  //we change here
  const [Items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
  const [page, setPage] = useState(0);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);

  const classes = useStyles();

  //on initial mount
  useEffect(() => {
    loadMoreItems();
  }, []);

  /**
   * It fetches the articles for the publication and adds them to the items array.
   */
  function loadMoreItems() {
    setIsFetching(true);
    const token = getAuthToken();
    //using axios to access the third party API
    axios({
      method: "GET",
      url: `${baseURL}/articles/getArticlesForPublication`,
      headers: { Authorization: token },
      params: {
        skip: page,
        limit: 10,
        publicationId: publication.publicationId
      }
    })
      .then(res => {
        let temp;
        setItems(prevTitles => {
          temp = prevTitles
            .concat(res.data.articles)
            .filter(article => !article.deleteAt);
          return temp;
        });
        setPage(prevPageNumber => prevPageNumber + 10);
        setHasMore(temp > 0);
        setIsFetching(false);
      })
      .catch(e => {});
  }

  useEffect(() => {}, [Items]);

  return (
    <div
      style={{
        width: "100%"
        // minHeight: "100vh"
      }}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        justifyContent="start"
        columnGap="70px"
        // gridTemplateColumns="repeat(4, minimax(auto, 250px))"
      >
        {Items &&
          Items.map((item, index) => {
            if (!item.deleteAt)
              return (
                <Grid item xs={12} md={6} lg={3} xl={2.3}>
                  <div key={index}>
                    <TopStoriesCard article={item} writer={writerName} />
                  </div>
                </Grid>
              );
          })}
      </Grid>
      {Items.length === 0 && !isFetching && (
        <div className={classes.loader}>
          {" "}
          Coming Soon... Meanwhile follow the Writer to receive the latest
          stories in your inbox ✍🏽{" "}
        </div>
      )}
      {isFetching && (
        <Box className={classes.loader}>
          <CircularProgress size={20} style={{ color: "#0095FF" }} />{" "}
        </Box>
      )}
      {!isFetching && HasMore && (
        <Box className={classes.loader}>
          <Button
            sx={{
              "&.MuiButton-text": { color: "white" },
              width: "25%",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "0.9em",
              textTransform: "capitalize",
              background:
                "linear-gradient(128.16deg, #2B56FF 0%, #1395FD 90.57%)",
              borderRadius: "10px"
            }}
            style={{ marginRight: "4%", width: "8rem" }}
            onClick={loadMoreItems}
          >
            Show more
          </Button>
        </Box>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  loader: {
    display: "flex",
    height: "10vh",
    alignItems: "center",
    marginTop: "35px",
    justifyContent: "center",
    fontFamily: "Poppins"
  }
});

export default TopStoriesPublication;
