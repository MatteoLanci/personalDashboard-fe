import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, newsState } from "../../state/Reducers/newsSlice";

const LatestNews = () => {
  const dispatch = useDispatch();
  const newsData = useSelector(newsState);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div>
      {newsData.map((article) => (
        <div key={article.title} className="border">
          <h5>{article.title}</h5>
          <a href={article.url}>Read full article here...</a>
        </div>
      ))}
    </div>
  );
};

export default LatestNews;
