import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, newsState } from "../../state/Reducers/newsSlice";
import "./latestNews.css";
import { nanoid } from "nanoid";
import { Container, Row } from "react-bootstrap";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const LatestNews = () => {
  const dispatch = useDispatch();
  const newsData = useSelector(newsState);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const articlesToShow = newsData.slice(0, 15);

  const noImage =
    "https://static.vecteezy.com/system/resources/thumbnails/006/299/370/original/world-breaking-news-digital-earth-hud-rotating-globe-rotating-free-video.jpg";

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <h2>Latest News: </h2>
      <Container className="newsWrapper">
        <Row className="galleryWrapper">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            className="customCarousel"
            removeArrowOnDeviceType={["desktop", "tablet", "mobile"]}
          >
            {articlesToShow.slice(0, 8).map((article, index) => (
              <figure className="galleryItem me-3" key={nanoid()}>
                <img src={article.img || noImage} alt={article.title} className="itemImage" />
                <figcaption className="itemDescription">
                  <h2 className="articleTitle">{article.title}</h2>
                  <a href={article.link} className="articleLink" target="_blank" rel="noreferrer">
                    read full article...
                  </a>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </Row>
      </Container>
    </>
  );
};

export default LatestNews;
