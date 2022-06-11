import axios from "axios";
import { useState, useEffect } from "react";
import { getAuthToken } from "../../common/commonFunctions";
import { baseURL, endPoints } from "../../../utils/apiEndPoints";
import MainLoader from "../../../components/mainLoader";
import TopStoriesCard from "../../writerContent/topStoriesCard";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./moreFromWriter.css";
function MoreFromWriter({ articleId, writerName }) {
  const [articles, setArticles] = useState([]);
  const [isGettingArticles, setIsGettingArticles] = useState(false);
  const [sliderRef, setSliderRef] = useState(null);

  useEffect(() => {
    setIsGettingArticles(true);
    const temp = getAuthToken();
    const params = new URLSearchParams({
      skip: 0,
      filters: "PUBLISHED"
    });
    axios
      .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
        headers: {
          Authorization: temp
        }
      })
      .then(res => {
        // console.log(res);
        setArticles(
          res.data.articles.filter(article => article.articleId !== articleId)
        );
        setIsGettingArticles(false);
      });
  }, []);

  const sliderSettings = {
    arrows: false,
    // dots: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false
  };

  return (
    <div className="more-from-writer-container">
      {isGettingArticles ? (
        <MainLoader />
      ) : (
        <div className="content">
          <div className="more-from-writer-heading-container">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.159552"
                cx="25"
                cy="25"
                r="23"
                stroke="#979797"
                strokeWidth="4"
              />
            </svg>
            <h3 className="more-from-writer-heading">More from the writer</h3>
          </div>
          <Slider ref={c => setSliderRef(c)} {...sliderSettings}>
            {articles.map(article => (
              <TopStoriesCard
                article={article}
                writer={writerName}
                key={article.articleId}
              />
            ))}
          </Slider>
          <div className="more-from-writer-buttons-container">
            <div className="slider-controls">
              <div className="more-from-writer-next-prev-buttons">
                <button
                  className="left-slide"
                  onClick={() => sliderRef.slickPrev()}
                >
                  <svg
                    width="13"
                    height="22"
                    viewBox="0 0 13 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.6387 22C11.29 22 10.9413 21.873 10.6724 21.6223L0.395948 11.9121C0.14167 11.6683 0 11.3421 0 10.9987C0 10.6588 0.14167 10.3326 0.395948 10.0888L10.6724 0.378556C11.2064 -0.126185 12.071 -0.126185 12.605 0.378556C13.1317 0.879863 13.1317 1.69363 12.605 2.19837L3.28746 10.9987L12.605 19.8025C13.1317 20.3038 13.1317 21.121 12.605 21.6223C12.3362 21.873 11.9874 22 11.6387 22Z"
                      fill="#666666"
                    />
                  </svg>
                </button>

                <button
                  className="right-slide"
                  onClick={() => sliderRef.slickNext()}
                >
                  <svg
                    width="13"
                    height="22"
                    viewBox="0 0 13 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.3613 22C1.71002 22 2.05875 21.873 2.32756 21.6223L12.6041 11.9121C12.8583 11.6683 13 11.3421 13 10.9987C13 10.6588 12.8583 10.3326 12.6041 10.0888L2.32756 0.378556C1.79357 -0.126185 0.929026 -0.126185 0.395041 0.378556C-0.13168 0.879863 -0.13168 1.69363 0.395041 2.19837L9.71254 10.9987L0.395041 19.8025C-0.13168 20.3038 -0.13168 21.121 0.395041 21.6223C0.66385 21.873 1.01257 22 1.3613 22Z"
                      fill="#666666"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button className="more-from-writer-see-more-button">
              See More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoreFromWriter;
