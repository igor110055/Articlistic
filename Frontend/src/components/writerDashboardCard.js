import { makeStyles } from "@mui/styles";
import image from "./../Images/icon_only.png";
import { useNavigate } from "react-router";
import placeholderImage from "../Images/placeholder_image.png";
const WriterDashboardCard = ({ status, title, subtitle, pic, articleId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClickArticle = () => {
    localStorage.setItem("articleId", articleId);
    navigate("/story");
  };
  return (
    <div className={classes.card} onClick={handleClickArticle}>
      <div className={classes.cardImageContainer}>
        {pic === "" ? (
          <img
            src={placeholderImage}
            className={classes.cardImage}
            alt="card"
          />
        ) : (
          <img src={pic} className={classes.cardImage} alt="card" />
        )}
      </div>
      <div>
        {status === "PUBLISHED" && (
          <div className={classes.cardStatusP}>{status.toLowerCase()}</div>
        )}
        {status === "DRAFT" && (
          <div className={classes.cardStatus}>{status.toLowerCase()}</div>
        )}
        {title !== undefined && (
          <div>
            <div
              style={{
                fontSize: "14px",
                wordWrap: "break-word",
                textOverflow: "ellipsis",
                width: "20rem"
              }}
            >
              {title.substring(0, 50)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  card: {
    borderRadius: "5px",
    border: "1px solid #E1E1E1",
    display: "flex",
    padding: "3%",
    backgroundColor: "white",
    marginBottom: "2%",
    height: "3.8rem",
    maxHeight: "3.8rem",
    boxShadow: "0px 2px 12px #EDEDED",
    cursor: "pointer"
  },

  cardImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    overflow: "hidden",
    minWidth: "85px",
    maxWidth: "85px",
    height: "62px",
    marginRight: "3%"
  },

  cardImage: {
    minWidth: "85px",
    maxWidth: "85px",
    minHeight: "62px",
    maxHeight: "62px",
    objectFit: "cover"
  },

  cardStatus: {
    backgroundColor: "#FFA700",
    padding: "1px 5px",
    fontSize: "13.5px",
    borderRadius: "6px",
    width: "fit-content",
    lineHeight: "21px",
    letterSpacing: "-0.05px",
    marginBottom: "5px",
    color: "white",
    fontWeight: "500",
    textTransform: "capitalize"
  },

  cardStatusP: {
    backgroundColor: "#59C995",
    padding: "1px 5px",
    fontSize: "14px",
    letterSpacing: "-0.05px",
    marginBottom: "5px",
    borderRadius: "6px",
    width: "fit-content",
    color: "white",
    fontWeight: "400",
    textTransform: "capitalize"
  },

  cardDescription: {
    fontSize: "12px"
  }
});

export default WriterDashboardCard;
