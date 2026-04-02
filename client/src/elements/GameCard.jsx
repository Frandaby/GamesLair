import "../css/GameCard.css";
import { useNavigate } from "react-router-dom";

function GameCard({ selectedGame }) {
  const navigate = useNavigate();
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
          </div>
          <div id="info-column">
            <div id="date">
              <h3>{selectedGame.released}</h3>
            </div>
            <div id="genres">
              {selectedGame.genres.map((genre) => (
                <p class="genre-text">{genre.name}</p>
              ))}
            </div>
            <div id="rating"></div>
            <div id="description-title">
              <h3>Description:</h3>
            </div>
            <div id="description-text">
              {selectedGame.description_raw.slice(0, 1014)}
              {selectedGame.description_raw.length > 1014 ? "..." : ""}
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
