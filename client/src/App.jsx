import "./css/App.css";
import Header from "./elements/Header.jsx";
import Games from "./elements/Games.jsx";
import { useState, useEffect } from "react";

function App() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let endpoint = "";
    if (query) {
      endpoint = `http://localhost:5000/api/search?query=${query}`;
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
  }, [query]);
  return (
    <>
      <Header setQuery={setQuery} />
      <Games games={games} />
    </>
  );
}

export default App;
