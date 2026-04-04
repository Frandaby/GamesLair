import "./css/App.css";
import Header from "./elements/Header.jsx";
import Games from "./elements/Games.jsx";
import GameCard from "./elements/GameCard.jsx";
import { useState, useEffect } from "react";
import Sidebar from "./elements/Sidebar.jsx";
import Registration from "./components/Registration.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [toggle, setToggle] = useState(true);
  const [selectedGame, setSelectedGame] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const isAuthenticated = function () {
    return !!localStorage.getItem("token");
  };

  return (
    <>
      <Router>
        <Header
          setQuery={setQuery}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />
        <div id="main-body">
          <Sidebar toggle={toggle} setToggle={setToggle} />
          <Routes>
            <Route
              path="/"
              element={
                <Games
                  setSelectedGame={setSelectedGame}
                  query={query}
                  toggle={toggle}
                  loggedIn={loggedIn}
                />
              }
            >
              <Route
                path=":slug"
                element={<GameCard selectedGame={selectedGame} />}
              />
              <Route
                path="/log-in"
                element={<Registration setLoggedIn={setLoggedIn} />}
              />
              <Route
                path="/sign-up"
                element={<Registration setLoggedIn={""} />}
              />
            </Route>
            <Route
              path="/reviews"
              element={loggedIn ? <p>test</p> : <Navigate to="/log-in" />}
            />
            <Route
              path="/rankings"
              element={loggedIn ? <p>test</p> : <Navigate to="/log-in" />}
            />
            <Route
              path="/favoritos"
              element={loggedIn ? <p>test</p> : <Navigate to="/log-in" />}
            />
            <Route
              path="/foro"
              element={loggedIn ? <p>test</p> : <Navigate to="/log-in" />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
