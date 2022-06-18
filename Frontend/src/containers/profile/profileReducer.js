import {
  GET_ARTICLES_SUCCESS,
  GET_ARTICLE_INIT,
  GET_USER_DATA_FAILURE,
  GET_USER_DATA_INIT,
  GET_USER_DATA_SUCCESS,
} from "../../utils/actionTypes";

const initialError = "Some error happened. Please Try again.";
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
const initialState = {
  articles:[] ,
  // followers:[],following:[],
  isGettinglist: false,
  listError: false,
  listErrorMsg: initialError,
};

const homepage = (state = initialState, action) => {
  const { data } = action;
  console.log(action);
  switch (action.type) {
    case GET_ARTICLE_INIT:

    case GET_USER_DATA_INIT:
      return {
        ...state,
        isGettinglist: true,
        listError: false,
      };
    case GET_ARTICLES_SUCCESS:
      return {
        ...state,
        articles: [ ...data ],
        isGettinglist: false,
        listError: false,
      };
    case GET_USER_DATA_SUCCESS:
      return {
        ...state,
        ...data,
      
        isGettinglist: false,
        listError: false,
      };

    case GET_USER_DATA_FAILURE:
      return {
        ...state,
        listError: true,
        isGettinglist: false,
        listErrorMsg: action.error,
      };
    default:
      return state;
  }
};

export default homepage;
