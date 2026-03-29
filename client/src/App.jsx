import "./css/App.css";
import Header from "./elements/Header.jsx";
import Games from "./elements/Games.jsx";
import { useState, useEffect } from "react";

function App() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    let endpoint = "";
    if (query) {
      endpoint = `http://localhost:5000/api/search?query=${query}`;
    } else if (order && order !== "elige-una-opcion") {
      endpoint = `http://localhost:5000/api/order?order=${order}`;
    } else if (platform || genre) {
      endpoint = `http://localhost:5000/api/filter?platform=${platform}&genre=${genre}`;
    } else {
      endpoint = "http://localhost:5000/api/all";
    }

    fetch(endpoint)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setGames(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [query, order, platform, genre]);
  return (
    <>
      <Header setQuery={setQuery} />
      <Games
        setOrder={setOrder}
        setGenre={setGenre}
        setPlatform={setPlatform}
        games={games}
      />
    </>
  );
}

export default App;
