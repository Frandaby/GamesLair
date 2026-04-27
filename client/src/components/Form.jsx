import "../css/Form.css";
import { postReviewRequest } from "../utilities";

function Form({
  setReviewData,
  reviewData,
  tags,
  user,
  selectedGame,
  getReviews,
}) {
  const mainEndpoint = `http://localhost:5000/`;

  const handleTag = (tagID) => {
    setReviewData((prev) => {
      const isSelected = prev.tags.includes(tagID);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter((id) => id !== tagID)
          : [...prev.tags, tagID],
      };
    });
  };

  const handleReview = async (e) => {
    const endpoint = mainEndpoint + `data/reviews`;
    e.preventDefault();
    const data = await postReviewRequest(endpoint, reviewData, selectedGame);
    setTimeout(() => {
      setReviewData({
        text: "",
        score: 50,
        tags: [],
        userID: user?.id || "",
      });
      e.target.reset();
    }, 300);
    getReviews();
  };

  return (
    <>
      <form id="review-form" onSubmit={handleReview}>
        <textarea
          id="review-input"
          onChange={(e) =>
            setReviewData((prev) => ({
              ...prev,
              text: e.target.value.trim(),
            }))
          }
          placeholder="What did you think of the game?"
        />
        <div id="review-score">
          <label>
            Your Score: <strong>{reviewData.score}</strong>/100
          </label>
          <input
            id="score-range"
            type="range"
            min="1"
            max="100"
            style={{ "--value": `${reviewData.score}%` }}
            onChange={(e) => {
              const value = e.target.value;
              setReviewData((prev) => ({
                ...prev,
                score: Number(value),
              }));
              e.target.style.setProperty("--value", `${value}%`);
            }}
          />
        </div>
        <div id="tags-div">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTag(tag.id)}
              className={
                reviewData.tags.includes(tag.id) ? "tag tag-selected" : "tag"
              }
            >
              {tag.name}
            </button>
          ))}
        </div>
        <button id="review-button" type="submit">
          Post Review
        </button>
      </form>
    </>
  );
}

export default Form;
