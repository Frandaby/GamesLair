//El documento principal donde añadimos la mayoría de funciones y rutas creadas.

import "./css/App.css";
import Header from "./elements/Header.jsx";
import Games from "./elements/Games.jsx";
import GameCard from "./elements/GameCard.jsx";
import Forum from "./elements/Forum.jsx";
import Sidebar from "./elements/Sidebar.jsx";
import Reviews from "./elements/Reviews.jsx";
import Rankings from "./elements/Rankings.jsx";
import Registration from "./components/Registration.jsx";
import Footer from "./elements/Footer.jsx";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [toggle, setToggle] = useState(true);
  const [selectedGame, setSelectedGame] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <>
      <Router>
        <Header
          setQuery={setQuery}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          setUser={setUser}
        />
        <div id="main-body">
          <Sidebar toggle={toggle} setToggle={setToggle} />
          <div id="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Games
                    user={user}
                    setSelectedGame={setSelectedGame}
                    query={query}
                    loggedIn={loggedIn}
                  />
                }
              >
                <Route
                  path=":slug"
                  element={
                    <GameCard
                      selectedGame={selectedGame}
                      user={user}
                      loggedIn={loggedIn}
                    />
                  }
                />
                <Route
                  path="/log-in"
                  element={
                    <Registration setUser={setUser} setLoggedIn={setLoggedIn} />
                  }
                />
                <Route
                  path="/sign-up"
                  element={<Registration setUser={setUser} setLoggedIn={""} />}
                />
              </Route>
              <Route
                path="/reviews"
                element={
                  loggedIn ? <Reviews user={user} /> : <Navigate to="/log-in" />
                }
              />
              <Route
                path="/rankings"
                element={loggedIn ? <Rankings /> : <Navigate to="/log-in" />}
              />
              <Route
                path="/favourites"
                element={
                  loggedIn ? (
                    <Games
                      user={user}
                      setSelectedGame={setSelectedGame}
                      query={query}
                      loggedIn={loggedIn}
                    />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route
                path="/forum"
                element={
                  loggedIn ? <Forum user={user} /> : <Navigate to="/log-in" />
                }
              />
            </Routes>
            <Footer />
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
