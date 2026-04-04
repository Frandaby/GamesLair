import "../css/Games.css";
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function Games({ query, toggle, setSelectedGame, loggedIn }) {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);
  const [order, setOrder] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [faves, setFaves] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/genres")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.unshift({ id: "999", name: "-----" });
        setGenres(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/api/platforms")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.unshift({ id: "999", name: "-----" });
        setPlatforms(data);
      })
      .catch((error) => {
        console.error(error);
      });
    let endpoint = "";
    if (query) {
      endpoint = `http://localhost:5000/api/search?query=${query}`;
    } else if (order || platform || genre) {
      endpoint = `http://localhost:5000/api/order-filter?platform=${platform}&genre=${genre}&order=${order}`;
    } else {
      endpoint = "http://localhost:5000/api/all";
    }

    fetch(endpoint)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setGames(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [query, order, platform, genre]);

  const ordersArray = [
    {
      value: "elige-una-opcion",
      text: "Elige una opción...",
    },
    {
      value: "best-to-worst",
      text: "Mejor valorados",
    },
    {
      value: "worst-to-best",
      text: "Peor valorados",
    },
    {
      value: "newest-to-oldest",
      text: "Más recientes",
    },
    {
      value: "oldest-to-newest",
      text: "Más antiguos",
    },
  ];
  // TO DO: Simplify these functions into one:
  const handleOrder = (e) => {
    const orderValue = e.target.value;
    setOrder(orderValue);
  };
  const handleGenre = (e) => {
    const genreValue = e.target.value;
    setGenre(genreValue);
  };
  const handlePlatform = (e) => {
    const platformValue = e.target.value;
    setPlatform(platformValue);
  };
  const handleFav = (fav) => {
    if (loggedIn) {
      setFaves((currentState) => ({
        ...currentState,
        [fav]: !currentState[fav],
      }));
    } else {
      navigate("/log-in");
    }
  };

  const handleSelectedGame = (id, slug) => {
    fetch(`http://localhost:5000/api/details?id=${id}`)
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
      <div id="main-page" class={toggle ? "" : "expanded"}>
        <div id="filter-container">
          <div class="filters">
            <label class="filter-label" for="order">
              Ordernar por:
            </label>
            <select onChange={handleOrder} class="filter-input" name="order">
              {ordersArray.map((order) => (
                <option value={order.value}>{order.text}</option>
              ))}
            </select>
          </div>
          <div class="filters">
            <label class="filter-label" for="genre">
              Género:
            </label>
            <select onChange={handleGenre} class="filter-input" name="genre">
              {genres.map((genre) => (
                <option value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          <div class="filters">
            <label class="filter-label" for="platform">
              Plataforma:
            </label>
            <select
              onChange={handlePlatform}
              class="filter-input"
              name="platform"
            >
              {platforms.map((platform) => (
                <option value={platform.id}>{platform.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div class="games">
          {games.map((game) => (
            <div class="game-card">
              <div class="game-name-div">
                <h2 class="game-name">{game.name}</h2>
              </div>
              <img class="game-image" src={game.background_image} />
              <div class="game-details">
                <p class="details-text">
                  <span class="details-bold">Puntuación: </span>
                  {game.metacritic}
                </p>
                <p class="details-text">
                  <span class="details-bold">Fecha de lanzamiento: </span>
                  {game.released.slice(0, 4)}{" "}
                  {/*La función slice elimina los caracteres no incluidos (en este caso solo deja los 5 primeros, el año) */}
                </p>
                <button
                  onClick={() => handleSelectedGame(game.id, game.slug)}
                  class="game-button"
                >
                  Ver ficha
                </button>
                <i
                  key={game.id}
                  onClick={() => handleFav(game.id)}
                  class={
                    faves[game.id]
                      ? "fas fa-heart fas-fa-heart"
                      : "far fa-heart far-fa-heart"
                  }
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Games;
