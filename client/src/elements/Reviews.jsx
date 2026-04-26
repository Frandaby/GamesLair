//En Reviews.jsx manejaremos la opción reviews de la sidebar (gestión de reviews propias, update/delete)

import "../css/Reviews.css";
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
// https://www.youtube.com/watch?v=vOftV4_roOQ&t=104s

function Reviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [editID, setEditID] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({
    score: "",
    text: "",
    tags: [],
  });
  const [tags, setTags] = useState([]);

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

    fetch("http://localhost:5000/data/tags")
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
    setUpdatedReview({
      ...review,
      tags: review.tags ? review.tags.map((tag) => tag.id) : [],
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const endpoint = "http://localhost:5000/data/reviews";
      await putRequest(endpoint, {
        reviewID: editID,
        score: updatedReview.score,
        text: updatedReview.text,
        tags: updatedReview.tags,
      });
      setEditID(null);
      setUpdatedReview({});
      getReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTag = (tagID) => {
    setUpdatedReview((prev) => {
      const isSelected = prev.tags.includes(tagID);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter((id) => id !== tagID)
          : [...prev.tags, tagID],
      };
    });
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
            <div className="review-div" key={review.id}>
              {/*ADDED UNIQUE KEY*/}
              {editID === review.id ? (
                <>
                  <div className="date-name-div">
                    <h3 className="title">{review.game}</h3>
                    <h3 className="date">
                      {(review?.updatedDate || review?.date)
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") +
                        " at " +
                        (review?.updatedDate || review?.date)?.slice(11, 19)}
                    </h3>
                  </div>
                  <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="edit-form-div">
                      <input
                        className="edit-score"
                        value={updatedReview.score}
                        onChange={(e) =>
                          setUpdatedReview({
                            ...updatedReview,
                            score: e.target.value,
                          })
                        }
                      />
                      <TextareaAutosize
                        className="edit-text"
                        value={updatedReview.text}
                        onChange={(e) =>
                          setUpdatedReview({
                            ...updatedReview,
                            text: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div id="tags-div">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTag(tag.id)}
                          className={
                            updatedReview.tags.includes(tag.id)
                              ? "tag tag-selected"
                              : "tag"
                          }
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    <button className="edit-button" type="submit">
                      Save
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="icon-div">
                    <i
                      className="edit-icons fas fa-pen-fancy"
                      onClick={() => handleEdit(review)}
                    />
                    <i
                      className="edit-icons fas fa-trash-alt"
                      onClick={() => handleDelete(review.id)}
                    />
                  </div>
                  <div className="date-name-div">
                    <h3 className="title">{review.game}</h3>
                    <h3 className="date">
                      {(review?.updatedDate || review?.date)
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-") +
                        " at " +
                        (review?.updatedDate || review?.date)?.slice(11, 19)}
                    </h3>
                  </div>
                  <div className="score-text-div">
                    <p
                      className="score"
                      style={{ color: getColour(review.score) }}
                    >
                      {review.score}
                    </p>
                    <p className="text">{review.text}</p>
                  </div>
                  <div className="review-tags">
                    {review?.tags?.map((tag) => (
                      <p className="review-tag" key={tag.id}>
                        {tag.name}
                        {/*ADDED UNIQUE KEY*/}
                      </p>
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
