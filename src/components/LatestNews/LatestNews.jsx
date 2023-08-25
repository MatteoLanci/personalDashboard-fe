import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, newsState } from "../../state/Reducers/newsSlice";

const LatestNews = () => {
  const dispatch = useDispatch();
  const newsData = useSelector(newsState);

  useEffect(() => {
    // dispatch(fetchNews());
  }, [dispatch]);

  const articlesToShow = newsData.slice(0, 5);
  const noImage =
    "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg";

  return (
    <div>
      <h2>Latest News: </h2>
      {articlesToShow.map((article, index) => (
        <div key={article.title} className="border p-2 rounded">
          <h5>{article.title}</h5>
          <a href={article.url} target="_blank" rel="noreferrer">
            Read full article here...
          </a>
          <div>
            <img
              src={article.urlToImage || noImage}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
              alt={index}
            />
          </div>
        </div>
      ))}
      <p>
        remove comment from dispatch in useEffect @row10 in LatestNews.jsx to see articles (daily
        request limit: 100)
      </p>
    </div>
  );
};

export default LatestNews;
