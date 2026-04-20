//Archivo para la ficha individual de cada juego (al pulsar "ver ficha")
import "../css/GameCard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function GameCard({ selectedGame, user, loggedIn }) {
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  const [tags, setTags] = useState([]);
  const [reviewData, setReviewData] = useState({
    text: "",
    score: 50,
    tags: [],
    userID: "",
  });
  const pegiConfiguration = {
    1: "pegi_7.png",
    2: "pegi_12.png",
    3: "pegi_16.png",
    4: "pegi_18.png",
    5: "pegi_18.png",
  };

  const length = 244;
  const isLong = selectedGame?.description_raw?.length > length;

  async function postRequest(endpoint, data) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: data,
        game: selectedGame,
      }),
    });
    return res.json();
  }

  useEffect(() => {
    if (user?.id) {
      setReviewData((prev) => ({
        ...prev,
        userID: user.id,
      }));
    }

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
  const handleClick = () => {
    navigate(-1); //Con esta funcionalidad React vuelve a la página anterior a la acción sin tener que hacer una ruta.
  };

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
    const endpoint = `http://localhost:5000/data/reviews`;
    e.preventDefault();
    const data = await postRequest(endpoint, reviewData);
    setTimeout(() => {
      setReviewData({
        text: "",
        score: 50,
        tags: [],
        userID: user?.id || "",
      });
      e.target.reset();
    }, 300);
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
            <div class="titles">
              <h3>Genres:</h3>
            </div>
            <div id="genres">
              {selectedGame?.genres?.map((genre) => (
                <p class="genre-text">{genre.name}</p>
              ))}
            </div>
            <div id="rating"></div>
            <div class="titles">
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
            <div class="titles">
              <h3>Platforms:</h3>
            </div>
            <div id="platforms">
              {selectedGame?.platforms?.map((platform) => (
                <p class="platform-text">{platform.platform.name}</p>
              ))}
            </div>
            <div class="titles">
              <h3>Reviews:</h3>
            </div>
            <div>
              <form id="review-form" onSubmit={handleReview}>
                <textarea
                  id="review-input"
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      text: e.target.value,
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
                      class={
                        reviewData.tags.includes(tag.id)
                          ? "tag tag-selected"
                          : "tag"
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
              <div></div>
            </div>
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
