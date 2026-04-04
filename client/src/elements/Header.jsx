import "../css/Header.css";
import Button from "../components/Button.jsx";
import signUp from "../assets/sign-up.png";
import logIn from "../assets/log-in.png";
import logo from "../assets/games-lair-logo.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Header({ setQuery, loggedIn, setLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState(""); //setSearch cambia el valor de la variable
  const handleRegistration = (type) => {
    navigate(`/${type}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuery(search);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  //useEffect -> Fetch data from the server (to connect it to it)
  //useState  -> Allows to change values with interactions of the page and to set starting values of elements in the page.

  return (
    <>
      <header id="header">
        <div id="logo-div">
          <img
            id="logo"
            src={logo}
            onClick={() => {
              if (location.pathname == "/") {
                window.location.reload();
              } else {
                navigate("/");
              }
            }}
          />
        </div>
        <div id="search-bar">
          <h1>¡Comparte tu frikismo con nuevos amigos!</h1>
          <input
            value={search}
            id="search-input"
            type="search"
            placeholder="Buscar juegos..."
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {!loggedIn && (
          <div id="user-buttons">
            <Button
              text="Sign up"
              image={signUp}
              onClick={() => handleRegistration("sign-up")}
            />
            {/*En React escribimos los parámetros dentro de la etiqueta*/}
            <Button
              text="Log in"
              image={logIn}
              onClick={() => handleRegistration("log-in")}
            />
          </div>
        )}
        {loggedIn && (
          <div id="log-out-button">
            <Button
              text="Log out"
              image={logIn}
              onClick={() => handleLogOut()}
            />
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
