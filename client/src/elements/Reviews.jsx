//En Reviews.jsx manejaremos la opción reviews de la sidebar (gestión de reviews propias, update/delete)
import "../css/Reviews.css";
import Review from "../components/Review.jsx";
import Scroll from "../components/Scroll.jsx";
import { useState, useEffect } from "react";

function Reviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [tags, setTags] = useState([]);
  const mainEndpoint = `http://localhost:5000/`;

  const getReviews = () => {
    fetch(mainEndpoint + `data/reviews?userID=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getReviews();

    fetch(mainEndpoint + "data/tags")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div id="main-review-div">
        <h2 id="reviews-header">
          {reviews.length > 0
            ? "Manage your reviews here!"
            : "Once you create a review, you'll be able to manage them here."}
        </h2>
        <div id="parent-review-div">
          {reviews.map((review) => (
            <Review
              key={review.id}
              getReviews={getReviews}
              review={review}
              tags={tags}
            />
          ))}
        </div>
        <Scroll />
      </div>
    </>
  );
}

export default Reviews;
