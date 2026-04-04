import "../css/GameCard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function GameCard({ selectedGame }) {
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  const pegiConfiguration = {
    1: "pegi_7.png",
    2: "pegi_12.png",
    3: "pegi_16.png",
    4: "pegi_18.png",
    5: "pegi_18.png",
  };
  const length = 244;
  const isLong = selectedGame.description_raw.length > length;
  const handleClick = () => {
    navigate("/");
  };
  return (
    <>
      <div id="overlay" onClick={handleClick}>
        <div id="popup" onClick={(e) => e.stopPropagation()}>
          <div id="image-column">
            <h2 id="expanded-title">{selectedGame.name}</h2>
            <img id="expanded-image" src={selectedGame.background_image} />
            <img
              id="pegi-image"
              src={"/" + pegiConfiguration[selectedGame.esrb_rating.id]}
            />
          </div>
          <div id="info-column">
            <div id="date">
              <h3>{selectedGame.released.split("-").reverse().join("-")}</h3>
            </div>
            <div class="titles">
              <h3>Genres:</h3>
            </div>
            <div id="genres">
              {selectedGame.genres.map((genre) => (
                <p class="genre-text">{genre.name}</p>
              ))}
            </div>
            <div id="rating"></div>
            <div class="titles">
              <h3>Description:</h3>
            </div>
            <div id="description-text">
              {more
                ? selectedGame.description_raw
                : selectedGame.description_raw.slice(0, length)}
              {!more && isLong ? "... " : " "}
              <a id="see-more-less" onClick={() => setMore(!more)} href="#">
                {more ? "See less" : "See more"}
              </a>
            </div>
            <div class="titles">
              <h3>Platforms:</h3>
            </div>
            <div id="platforms">
              {selectedGame.platforms.map((platform) => (
                <p class="platform-text">{platform.platform.name}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameCard;
