//En Reviews.jsx manejaremos la opción reviews de la sidebar (gestión de reviews propias, update/delete)

import "../css/Reviews.css";
import { useState, useEffect } from "react";

function Reviews({ user, toggle }) {
  const [reviews, setReviews] = useState([]);

  const getReviews = () => {
    fetch(`http://localhost:5000/data/reviews?userID=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error(error));
  };

  const getColour = (score) => {
    if (score < 50) {
      return "red";
    } else if (score <= 75) {
      return "orange";
    } else {
      return "green";
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      <div id="main-review-div" class={toggle ? "" : "expanded"}>
        <h2 id="reviews-header">
          {reviews.length > 0
            ? "Manage your reviews here!"
            : "Once you create a review, you'll be able to manage them here."}
        </h2>
        <div id="parent-review-div">
          {reviews.map((review) => (
            <div class="review-div">
              <div class="icon-div">
                <i class="edit-icons fas fa-pen-fancy" />
                <i class="edit-icons fas fa-trash-alt" />
              </div>
              <div class="date-name-div">
                <h3 class="title">{review.game}</h3>
                <h3 class="date">
                  {review?.date?.slice(0, 10).split("-").reverse().join("-") +
                    " at " +
                    review?.date?.slice(11, 19).split("-").reverse().join("-")}
                </h3>
              </div>

              <div class="score-text-div">
                <p class="score" style={{ color: getColour(review.score) }}>
                  {review.score}
                </p>
                <p class="text">{review.text}</p>
              </div>
              <div class="review-tags">
                {review?.tags?.map((tag) => (
                  <p class="review-tag">{tag.name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Reviews;
