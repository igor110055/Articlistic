import StoryCard from "../../homepage/story-card/story-card";
import './user-stories.css';
import {useState} from "react";
import { useSelector } from "react-redux";
const headdata = ["My Stories", "Found Meaningful", "Stories Funded"];

const Userstories = () => {
    const [clickedclass,setclickedclass]=useState("My Stories")
    
    const data=useSelector(state=>state.profile)
    console.log(data)
    const makeUrlForArticle = (article) => {
     
      let pubName = "article";
      let name = article.public.title.split(" ");
      let urlName = name.join("-");
      return `/${pubName}-by-${article.public.writerName}/${urlName}+${article.articleId}`;
    };
  return (
    <div className="story-user-list">
      <div className="user-stories-nav">
        {headdata.map((data, idx) => (
          <div onClick={()=>{setclickedclass(data)}} className={`user-stories-nav-items ${clickedclass==data?'active-stories-class':''}`}>
            <p>{data}</p>
            {clickedclass === data && (
              <div className="blue-line-container"></div>
            )}
          </div>
        ))}
      </div>
      <hr />
      <div className="stories-list">
        {data.articles.map((data, idx) => (
          <StoryCard article={data} url={makeUrlForArticle(data)} />
        ))}
      </div>
    </div>
  );
};

export default Userstories;
