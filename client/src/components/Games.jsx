//Archivo donde llamaremos a todas las rutas y funciones relacionadas con juegos, así como la estructura HTML
import "../css/Games.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

function Games({ query, setSelectedGame, loggedIn, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);
  const [order, setOrder] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [faves, setFaves] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
  }, [order, genre, platform, query, path, searchedUser]);

  useEffect(() => {
    if (user?.email && !searchedUser) {
      setSearchedUser(user.email); // Con este endpoint determinamos que el primer usuario que salga por defecto seamos nosotros mismos, aunque luego busquemos al que sea.
    }
    if (path !== "/favourites") {
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
    }
    let endpoint = "";
    if (path === "/favourites") {
      endpoint = `http://localhost:5000/data/favourites?email=${searchedUser}`; // searchedUser cambia según lo que busquemos.
    } else if (query) {
      endpoint = `http://localhost:5000/api/search?query=${query}`;
    } else if (order || platform || genre) {
      endpoint = `http://localhost:5000/api/order-filter?platform=${platform}&genre=${genre}&order=${order}&page=${page}`;
    } else {
      endpoint = `http://localhost:5000/api/all?page=${page}`;
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
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://localhost:5000/data/favourites?email=${user.email}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const favourites = data?.reduce((acc, game) => {
          acc[game.id] = true;
          return acc;
        }, {});
        //Con este fetch siempre veremos los favoritos que tenemos guardado en nuestro usuario, y otros usuarios podrán verlos también cuando busquen nuestro perfil, al permanecer marcados.

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
  async function postRequest(endpoint, data, userID) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: {
          id: data.id,
          name: data.name,
          background_image: data.background_image,
          released: data.released,
          metacritic: data.metacritic,
        },
        userID: userID,
      }),
    });
    return res.json();
  }

  //Función para borrar requests
  async function deleteRequest(endpoint, data) {
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

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
      const currentFav = !!faves[fav.id]; // Estado actual de favourite
      const newFav = !currentFav; // Estado cambiado de favourite

      setFaves((current) => ({
        ...current,
        [fav.id]: newFav,
      }));

      const endpoint = `http://localhost:5000/data/favourites`;

      if (newFav) {
        postRequest(endpoint, fav, user.id);
      } else {
        deleteRequest(endpoint, { userID: user.id, apiID: fav.id });
      }
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
        <div className="games">
          {games.map((game) => (
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
          ))}
        </div>
        {hasMore && (
          <div className="see-more-div">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="see-more"
            >
              See more
            </button>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
}

export default Games;
