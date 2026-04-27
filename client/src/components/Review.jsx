import "../css/Review.css";
import TextareaAutosize from "react-textarea-autosize";
// https://www.youtube.com/watch?v=vOftV4_roOQ&t=104s
import { deleteRequest, putRequest, getColour, formatDate } from "../utilities";

function Review({
  review,
  editID,
  setEditID,
  getReviews,
  updatedReview,
  setUpdatedReview,
  tags,
}) {
  const mainEndpoint = `http://localhost:5000/`;

  const handleDelete = (id) => {
    // Primero tenemos que especificar cuál review borrar
    const endpoint = mainEndpoint + `data/reviews`;
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
      const endpoint = mainEndpoint + "data/reviews";
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
      <div className="review-div" key={review.id}>
        {/*ADDED UNIQUE KEY*/}
        {editID === review.id ? (
          <>
            <div className="date-name-div">
              <h3 className="title">{review.game}</h3>
              <h3 className="date">
                {formatDate(review?.updatedDate || review?.date)}
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
              <div className="tags-div">
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
                {formatDate(review?.updatedDate || review?.date)}
              </h3>
            </div>
            <div className="score-text-div">
              <p className="score" style={{ color: getColour(review.score) }}>
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
    </>
  );
}

export default Review;
