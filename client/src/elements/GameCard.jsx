//Archivo para la ficha individual de cada juego (al pulsar "ver ficha")
import "../css/GameCard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "../components/Form.jsx";
import { getColour, getAverageScore, formatDate } from "../utilities.js";

function GameCard({ selectedGame, user, loggedIn }) {
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [tags, setTags] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    text: "",
    score: 50,
    tags: [],
    userID: "",
  });
  const mainEndpoint = `http://localhost:5000/`;
  const pegiConfiguration = {
    1: "pegi_7.png",
    2: "pegi_12.png",
    3: "pegi_16.png",
    4: "pegi_18.png",
    5: "pegi_18.png",
  };

  const length = 244;
  const isLong = selectedGame?.description_raw?.length > length;

  const getReviews = () => {
    fetch(mainEndpoint + `data/reviews?gameID=${selectedGame.id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setHasReview(data?.some((review) => review.user_id === user?.id));
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (user?.id) {
      setReviewData((prev) => ({
        ...prev,
        userID: user.id,
      }));
    }

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

    getReviews();
  }, [selectedGame.id]);

  const handleClick = () => {
    navigate(-1); //Con esta funcionalidad React vuelve a la página anterior a la acción sin tener que hacer una ruta.
  };

  return (
    <>
      <div id="overlay" onClick={handleClick}>
        <div id="popup" onClick={(e) => e.stopPropagation()}>
          <div id="image-column">
            <h2 id="expanded-title">{selectedGame?.name}</h2>
            {selectedGame?.background_image && (
              <img id="expanded-image" src={selectedGame?.background_image} />
            )}
            {selectedGame?.esrb_rating?.id && (
              <img
                id="pegi-image"
                src={"/" + pegiConfiguration[selectedGame?.esrb_rating?.id]}
              />
            )}
          </div>
          <div id="info-column">
            <div id="date">
              <h3>{selectedGame?.released?.split("-").reverse().join("-")}</h3>
            </div>
            <div className="titles">
              <h3>Genres:</h3>
            </div>
            <div id="genres">
              {selectedGame?.genres?.map((genre) => (
                <p className="genre-text" key={genre.id}>
                  {" "}
                  {/*ADDED UNIQUE KEY*/}
                  {genre.name}
                </p>
              ))}
            </div>
            <div id="rating"></div>
            <div className="titles">
              <h3>Description:</h3>
            </div>
            <div id="description-text">
              {more
                ? selectedGame?.description_raw
                : selectedGame?.description_raw?.slice(0, length)}
              {!more && isLong ? "... " : " "}
              <a id="see-more-less" onClick={() => setMore(!more)} href="#">
                {more ? "See less" : "See more"}
              </a>
            </div>
            <div className="titles">
              <h3>Platforms:</h3>
            </div>
            <div id="platforms">
              {selectedGame?.platforms?.map((platform) => (
                <p className="platform-text" key={platform.platform.id}>
                  {" "}
                  {/*ADDED UNIQUE KEY*/}
                  {platform.platform.name}
                </p>
              ))}
            </div>
            <div id="rating">
              {reviews.length > 0 && (
                <>
                  <div className="titles">
                    <h3>Average Score:</h3>
                  </div>
                  <h3
                    className="average-score"
                    style={{ color: getColour(getAverageScore(reviews)) }}
                  >
                    {getAverageScore(reviews)}/100
                  </h3>
                </>
              )}
            </div>
            {loggedIn && !hasReview && (
              <div className="titles">
                <h3>Write a review:</h3>
              </div>
            )}
            {loggedIn && (
              <div>
                {!hasReview && (
                  <Form
                    getReviews={getReviews}
                    setReviewData={setReviewData}
                    reviewData={reviewData}
                    tags={tags}
                    user={user}
                    selectedGame={selectedGame}
                  />
                )}
                {reviews.length > 0 && (
                  <div className="titles">
                    <h3>Reviews:</h3>
                  </div>
                )}
                {reviews.length > 0 && (
                  <div>
                    {reviews.map((review) => (
                      <div className="review-body" key={review.id}>
                        {/*ADDED UNIQUE KEY*/}
                        <div className="review-data">
                          <p>{review.email}</p>
                          <p>
                            {formatDate(
                              review?.updated_at || review?.created_at,
                            )}
                          </p>
                        </div>
                        <div className="game-card-review">
                          {" "}
                          <p
                            className="game-card-score"
                            style={{ color: getColour(review.score) }}
                          >
                            {review.score}
                          </p>
                          <p className="review-text">{review.review_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GameCard;

{
  /* Debido a que en América usan ESRB y en Europa PEGI, he descargado imágenes
     de calificación por edad PEGI y las he relacionado para que salgan según su 
     correspondiente americano, que es el que usa la API */
}

{
  /*Con split resverse join (en h3) ordenaremos la fecha en formato DD/MM/AAAA */
}

{
  /* Al llamar a length y usar slice cuando tenga más de 244 caracteres aparecerá "See more" 
  en vez de todo el texto de golpe*/
}
