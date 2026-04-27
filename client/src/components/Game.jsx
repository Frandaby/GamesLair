import "../css/Game.css";
import { useNavigate } from "react-router-dom";
import { postFavRequest, deleteRequest } from "../utilities";

function Game({ game, loggedIn, faves, setFaves, user, setSelectedGame }) {
  const navigate = useNavigate();
  const mainEndpoint = `http://localhost:5000/`;

  const handleFav = (fav) => {
    if (loggedIn) {
      const currentFav = !!faves[fav.id]; // Estado actual de favourite
      const newFav = !currentFav; // Estado cambiado de favourite

      setFaves((current) => ({
        ...current,
        [fav.id]: newFav,
      }));

      const endpoint = mainEndpoint + `data/favourites`;

      if (newFav) {
        postFavRequest(endpoint, fav, user.id);
      } else {
        deleteRequest(endpoint, { userID: user.id, apiID: fav.id });
      }
    } else {
      navigate("/log-in");
    }
  };

  const handleSelectedGame = (id, slug) => {
    fetch(mainEndpoint + `api/details?id=${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSelectedGame(data);
        navigate(`/${slug}`);
      });
  };
  return (
    <>
      <div className="game-card" key={game.id}>
        {/*ADDED UNIQUE KEY */}
        <div className="game-name-div">
          <h2 className="game-name">{game.name}</h2>
        </div>
        {game.background_image && (
          <img className="game-image" src={game.background_image} />
        )}
        <div className="game-details">
          <p className="details-text">
            <span className="details-bold">Score: </span>
            {game.metacritic}
          </p>
          <p className="details-text">
            <span className="details-bold">Release data: </span>
            {game?.released?.slice(0, 4)}{" "}
            {/*La función slice elimina los caracteres no incluidos 
                  (en este caso solo deja los 5 primeros, el año)
                  La ? en React actúa del mismo modo que IF NOT EXISTs de MySQL */}
          </p>
          <button
            onClick={() => handleSelectedGame(game.id, game.slug)}
            className="game-button"
          >
            Game details
          </button>
          <i
            key={game.id}
            onClick={() => handleFav(game)}
            className={
              faves[game.id]
                ? "fas fa-heart fas-fa-heart"
                : "far fa-heart far-fa-heart"
            }
          ></i>
        </div>
      </div>
    </>
  );
}

export default Game;
