//Archivo donde llamaremos a todas las rutas y funciones relacionadas con juegos, así como la estructura HTML
import "../css/Games.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Game from "./Game.jsx";
import Scroll from "./Scroll.jsx";

function Games({
  order,
  setOrder,
  platform,
  setPlatform,
  genre,
  setGenre,
  setSearch,
  query,
  setQuery,
  setSelectedGame,
  loggedIn,
  user,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);
  const [searchedUser, setSearchedUser] = useState("");
  const [faves, setFaves] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const mainEndpoint = `http://localhost:5000/`;

  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
  }, [order, genre, platform, query, path, searchedUser]);

  useEffect(() => {
    setLoading(true);
    if (user?.email && !searchedUser) {
      setSearchedUser(user.email); // Con este endpoint determinamos que el primer
      //usuario que salga por defecto seamos nosotros mismos, aunque luego busquemos al que sea.
    }

    if (path !== "/favourites") {
      fetch(mainEndpoint + "api/genres")
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
      fetch(mainEndpoint + "api/platforms")
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
    }
    let endpoint = "";
    if (path === "/favourites") {
      endpoint = mainEndpoint + `data/favourites?email=${searchedUser}`; // searchedUser cambia según lo que busquemos.
    } else if (query) {
      endpoint = mainEndpoint + `api/search?query=${query}`;
    } else if (order || platform || genre) {
      endpoint =
        mainEndpoint +
        `api/order-filter?platform=${platform}&genre=${genre}&order=${order}&page=${page}`;
    } else {
      endpoint = mainEndpoint + `api/all?page=${page}`;
    }

    fetch(endpoint)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setGames((prev) => {
          if (page === 1) {
            return data;
          }
          return [...prev, ...data];
        });

        if (data.length < 20) {
          setHasMore(false);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    fetch(mainEndpoint + `data/favourites?email=${user?.email}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const favourites = data?.reduce((acc, game) => {
          acc[game.id] = true;
          return acc;
        }, {});

        //Con este fetch siempre veremos los favoritos que tenemos guardado en nuestro usuario,
        //y otros usuarios podrán verlos también cuando busquen nuestro perfil, al permanecer marcados.
        setFaves(favourites);
      })
      .catch((error) => {
        console.error(error);
      }); // Esto cambia según quién esté logueado
  }, [page, searchedUser, user, path, query, order, platform, genre]);

  const ordersArray = [
    {
      value: "elige-una-opcion",
      text: "Choose an option...",
    },
    {
      value: "best-to-worst",
      text: "Best to worst",
    },
    {
      value: "worst-to-best",
      text: "Worst to best",
    },
    {
      value: "newest-to-oldest",
      text: "Newest to oldest",
    },
    {
      value: "oldest-to-newest",
      text: "Oldest to newest",
    },
  ];

  const handleOrder = (e) => {
    const orderValue = e.target.value;
    setQuery("");
    setSearch("");
    setOrder(orderValue);
  };

  const handleGenre = (e) => {
    const genreValue = e.target.value;
    setQuery("");
    setSearch("");
    setGenre(genreValue);
  };

  const handlePlatform = (e) => {
    const platformValue = e.target.value;
    setQuery("");
    setSearch("");
    setPlatform(platformValue);
  };

  const handleUserSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchedUser(e.target.value);
    }
  };
  return (
    <>
      <div id="main-page">
        {path !== "/favourites" && (
          <div id="filter-container">
            <div className="filters">
              <label className="filter-label" htmlFor="order">
                Order by:
              </label>
              <select
                value={order}
                onChange={handleOrder}
                className="filter-input"
                name="order"
              >
                {ordersArray.map((order) => (
                  <option key={order.value} value={order.value}>
                    {order.text}
                    {/*ADDED UNIQUE KEY */}
                  </option>
                ))}
              </select>
            </div>
            <div className="filters">
              <label className="filter-label" htmlFor="genre">
                Genre:
              </label>
              <select
                value={genre}
                onChange={handleGenre}
                className="filter-input"
                name="genre"
              >
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                    {/*ADDED UNIQUE KEY */}
                  </option>
                ))}
              </select>
            </div>
            <div className="filters">
              <label className="filter-label" htmlFor="platform">
                Platform:
              </label>
              <select
                value={platform}
                onChange={handlePlatform}
                className="filter-input"
                name="platform"
              >
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                    {/*ADDED UNIQUE KEY */}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {path === "/favourites" && (
          <div id="user-search-div">
            <h2 id="favourites-header">Favourites</h2>
            <input
              id="user-search-input"
              type="search"
              placeholder="Write user's email..."
              onKeyDown={handleUserSearch}
            ></input>
          </div>
        )}
        {games.length > 0 && (
          <div className="games">
            {games.map((game) => (
              <Game
                key={game.id}
                game={game}
                loggedIn={loggedIn}
                faves={faves}
                setFaves={setFaves}
                user={user}
                setSelectedGame={setSelectedGame}
              />
            ))}
          </div>
        )}{" "}
        {!loading && games.length === 0 && (
          <h2 id="no-games-msg">No games found!</h2>
        )}
        {!loading && hasMore && (
          <div className="see-more-div">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="see-more"
            >
              See more
            </button>
          </div>
        )}
        <Scroll />
      </div>
      <Outlet />
    </>
  );
}

export default Games;
