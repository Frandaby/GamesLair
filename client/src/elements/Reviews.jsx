//En Reviews.jsx manejaremos la opción reviews de la sidebar (gestión de reviews propias, update/delete)

import "../css/Reviews.css";
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
// https://www.youtube.com/watch?v=vOftV4_roOQ&t=104s

function Reviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [editID, setEditID] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({});

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

  async function deleteRequest(endpoint, data) {
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function putRequest(endpoint, data) {
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  const handleDelete = (id) => {
    // Primero tenemos que especificar cuál review borrar
    const endpoint = `http://localhost:5000/data/reviews`;
    deleteRequest(endpoint, { reviewID: id });
    // Segundo hay que usar una query para borrar los datos de la BBDD
    getReviews();
    // Tercero hay que mostrar la nueva actualización
  };

  const handleEdit = (review) => {
    setEditID(review.id);
    setUpdatedReview(review);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const endpoint = "http://localhost:5000/data/reviews";
      await putRequest(endpoint, {
        reviewID: editID,
        score: updatedReview.score,
        text: updatedReview.text,
      });
      setEditID(null);
      setUpdatedReview({});
      getReviews();
    } catch (error) {
      console.error(error);
    }
  };

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
            <div class="review-div">
              {editID === review.id ? (
                <>
                  <div class="date-name-div">
                    <h3 class="title">{review.game}</h3>
                    <h3 class="date">
                      {review?.date
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") +
                        " at " +
                        review?.date
                          ?.slice(11, 19)
                          .split("-")
                          .reverse()
                          .join("-")}
                    </h3>
                  </div>
                  <form class="edit-form" onSubmit={handleSubmit}>
                    <div class="edit-form-div">
                      <input
                        class="edit-score"
                        value={updatedReview.score}
                        onChange={(e) =>
                          setUpdatedReview({
                            ...updatedReview,
                            score: e.target.value,
                          })
                        }
                      />
                      <TextareaAutosize
                        class="edit-text"
                        value={updatedReview.text}
                        onChange={(e) =>
                          setUpdatedReview({
                            ...updatedReview,
                            text: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button class="edit-button" type="submit">
                      Save
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div class="icon-div">
                    <i
                      class="edit-icons fas fa-pen-fancy"
                      onClick={() => handleEdit(review)}
                    />
                    <i
                      class="edit-icons fas fa-trash-alt"
                      onClick={() => handleDelete(review.id)}
                    />
                  </div>
                  <div class="date-name-div">
                    <h3 class="title">{review.game}</h3>
                    <h3 class="date">
                      {review?.date
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") +
                        " at " +
                        review?.date
                          ?.slice(11, 19)
                          .split("-")
                          .reverse()
                          .join("-")}
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
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Reviews;
