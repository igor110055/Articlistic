import StoryCard from "../story-card/story-card";
import './user-stories.css';
import {useState} from "react";
const headdata = ["My Stories", "Found Meaningful", "Stories Funded"];
const storiesdata = [
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
  {
    title: "What Next for ‘Buy Now, Pay Later’ Companies?",
    body: "BNPL solutions allow customers to spread out the cost of their purchases...",
    articlePic:"https://attentioun-article-data.s3.us-east-2.amazonaws.com/images/c97c3257-0113-4906-9c3a-ed2dd7466b58/ionVelocity_1654864758797.png",
    readingTime: "1 min",
    date: 1649771892446,
    writer: "John Doe",
  },
];
const Userstories = () => {
    const [clickedclass,setclickedclass]=useState("Found Meaningful")
  return (
    <div className="story-user-list">
      <div className="user-stories-nav">
        {headdata.map((data, idx) => (
          <div onClick={()=>{setclickedclass(data)}} className={`user-stories-nav-items ${clickedclass==data?'active-stories-class':''}`}>
            <p>{data}</p>
            {clickedclass===data && (
                <div className="blue-line-container"></div>
            )}
          </div>
        ))}
      </div>
      <hr/>
      <div className="stories-list">
        {storiesdata.map((data, idx) => (
          <StoryCard article={data} />
        ))}
      </div>
    </div>
  );
};

export default Userstories;
