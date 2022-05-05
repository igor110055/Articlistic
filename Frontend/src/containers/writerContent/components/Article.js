import { useNavigate } from "react-router-dom";
import "./Article.css";

const Article = ({ data }) => {


  const navigate = useNavigate()
  const { articleId } = data 

  const onMakeChanges = () => {
    localStorage.setItem("articleId", articleId);
    navigate("/story");
  }

  return (
    <div className="article-container">
      <div className="article-img-div">
        <img className="article-img" src={data.public.articlePic} />
      </div>
      <div className="detail-div">
        <div className="title">{data.public.title}</div>
        <div className="sub-title">{data.public.body}</div>
      </div>
      <div className="manage-btn-div">
        <div className="button-div">
          <button style={{cursor: "pointer"}} onClick={onMakeChanges} className="manage-btn">Make Changes</button>
        </div>
      </div>
    </div>
  );
};
export default Article;
