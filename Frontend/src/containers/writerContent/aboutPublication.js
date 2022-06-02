import { Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../utils/apiEndPoints";
import defaultPublication from "./../../Images/defaultPublication.jpg";
import backBtn from "./../../Images/back.png";
import TopStoriesPublication from "./topStoriesPublication";
import WriterAboutPublication from "./writerAboutPublication";

const AboutPublication = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [writerName, setWriterName] = useState("");
  const { state } = useLocation();
  const [publicationPic, setPublicationPic] = useState(
    state?.publicationPic || ""
  );
  const [publication, setPublication] = useState(state || {});
  const navigate = useNavigate();

  const user = localStorage.getItem("user");

  const userDetails = JSON.parse(user);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!state) {
      navigate("/writerDashboard");
    }
  }, []);

  useEffect(() => {
    getWriterName();
  }, []);

  const getWriterName = async () => {
    const response = await axios.get(
      `${baseURL}/users/name?username=${userDetails?.userUserName}`
    );
    setWriterName(response.data.name);
  };

  const handleBackClick = () => {
    navigate("/writerDashboard/publications");
  };

  return (
    <div>
      <div className={classes.saveBar} id="#e">
        <img
          src={backBtn}
          style={{
            alignSelf: "center",
            marginLeft: "45px",
            marginRight: "53px",
            marginTop: "8px",
            cursor: "pointer"
          }}
          height="25px"
          width="25px"
          onClick={handleBackClick}
          alt="backBtn"
        />
        <div className={classes.iconContainer}>
          {publicationPic ? (
            /* This is a trick to force the browser to reload the image as AWS uses the same URL for updated images. */
            <img
              src={`${publicationPic}?${new Date().getTime()}`}
              className={classes.publicationIcon}
              alt="publication"
            />
          ) : (
            <img
              src={defaultPublication}
              className={classes.publicationIcon}
              alt="default"
            />
          )}
        </div>

        <div className={classes.writerNameContainer}>
          <div className={classes.publicationName}>
            {publication.publicationName}{" "}
          </div>
        </div>
        <div className={classes.writerNameContainer}>
          <div className={classes.writerName}>
            <span className={classes.span}>By </span>
            {writerName}{" "}
          </div>
        </div>

        <div className={classes.saveBarRight}></div>
      </div>
      <div className={classes.outsideContainer}>
        <div className={classes.container}>
          <Box className={classes.TabContainer}>
            <Box
              sx={{
                borderBottom: 0,
                borderColor: "divider",
                marginLeft: "30px"
                // paddingTop: "10px",
              }}
            >
              <Tabs
                value={value}
                TabIndicatorProps={{ style: { background: "#1291FD" } }}
                onChange={handleChange}
                aria-label="basic tabs"
              >
                <Tab
                  label={<span className={classes.tabLabel}>Top Stories</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  label={<span className={classes.tabLabel}>About</span>}
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <TopStoriesPublication
                writerName={writerName}
                publication={publication}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <WriterAboutPublication />
            </TabPanel>
          </Box>
        </div>
      </div>
    </div>
  );
};

/**
 * The TabPanel component is a generic component that takes a value and an index and returns a tab
 * panel.
 *
 * The value is the index of the tab that is currently selected.
 *
 * The index is the index of the tab that is being rendered.
 *
 * The tab panel is hidden if the value does not equal the index.
 *
 * The tab panel is visible if the value does equal the index.
 *
 * The tab panel is given a typography of the children.
 * @param props - The props object for the TabPanel component.
 * @returns The TabPanel component is returning a div element with a role of tabpanel, a hidden
 * attribute, an id, an aria-labelledby attribute, and a style attribute.
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ visibility: value === index ? "visible" : "hidden" }}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles({
  outsideContainer: {
    backgroundColor: "#F6F6F7"
  },

  container: {
    minHeight: "100vh",
    maxWidth: "100vw",
    backgroundColor: "#F6F6F7",
    marginLeft: "151px",
    marginRight: "72px"
  },

  iconContainer: {
    boxShadow: "2px 5px 24px rgba(175, 176, 198, 0.297886)",
    alignItems: "center",
    width: "52px",
    height: "52px",

    // marginTop: '6px',
    display: "flex",
    justifyContent: "center",
    borderRadius: "50%"
  },

  saveBar: {
    width: "100%",
    // marginTop: '4rem',
    height: "3rem",
    display: "flex",
    // justifyContent: "space-between",
    flexDirection: "row",
    alginItems: "center",
    // justifyContent: 'center',
    padding: "0.5% 0% 0.5% 0%",
    color: "rgba(255, 255, 255, 1)",
    boxShadow: "0px 2px 124px rgba(199, 212, 223, 0.37612)",
    zIndex: 4,
    borderBottom: "3px solid #0FC7FC"
    // zIndex: 1,
  },

  publicationIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover"
  },

  saveBarRight: {
    display: "flex"
  },

  writerNameContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  publicationName: {
    color: "rgba(56, 56, 56, 1)",
    fontSize: "25px",
    fontWeight: "600",
    textTransform: "capitalize",
    fontFamily: "MerriWeather",
    marginLeft: "32px"
    // letterSpacing: "2px"
  },

  writerName: {
    color: "#0A2B98",
    fontSize: "22px",
    textTransform: "capitalize",
    fontWeight: "700",
    fontFamily: "Poppins",
    marginLeft: "38px",
    lineHeight: "39px"
  },

  span: {
    fontWeight: "200"
  },

  tabLabel: {
    fontFamily: "Poppins",
    fontSize: "16px",
    textTransform: "none",
    color: "black",
    fontWeight: "bold"
    // letterSpacing: "1px",
  }
});

export default AboutPublication;
