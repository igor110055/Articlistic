import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  // getRequest,
  authGetRequest,
  authPostRequest,
  authPutRequest,
  authDeleteRequest,
} from "../../utils/apiRequests";
import { getWritersSuccess, getWritersFailure } from "./homepageAction";
import {
  GET_HOME_PAGE_DATA_INIT,
  GET_HOME_PAGE_DATA_FAILURE,
  GET_HOME_PAGE_DATA_SUCCESS,
} from "../../utils/actionTypes";

const INIT_DATA = {
  virenoswall: {
    articles: [
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
    ],
    count: 5,
  },
  ionVelocity: {
    articles: [
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
    ],
    count: 5,
  },
  nagar1111: {
    articles: [
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
      {
        articlePic:
          "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
        body: "BNPL solutions allow customers to spread out the cost of their purchases...",
        date: 1649771892446,
        readingTime: "1 min",
        title: "What Next for ‘Buy Now, Pay Later’ Companies?",
        writerName: "yashchaudhari",
      },
    ],
    count: 5,
  },
};

function* getWritersAndArticles(action) {
 
  try {
    const headers = {
      Authorization: action.data.token,
    };

    const url = `https://orange-news-lead-49-36-182-78.loca.lt/${endPoints.userHomePageGet}`;
    var data = yield call(authGetRequest, url, headers);
    data = INIT_DATA;
    if (!data.error) {
      yield put(getWritersSuccess(data));
    } else {
      yield put(getWritersFailure(data.message));
    }
  } catch (err) {
    yield put(getWritersFailure(err.message));
  }
}

export function* getWriterandArticlesSaga() {
  yield takeLatest(GET_HOME_PAGE_DATA_INIT, getWritersAndArticles);
}
