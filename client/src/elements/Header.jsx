//Header de la página y su funcionalidad
import "../css/Header.css";
import Button from "../components/Button.jsx";
import signUp from "../assets/sign-up.png";
import logIn from "../assets/log-in.png";
import logo from "../assets/games-lair-logo.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/*Hooks de React (librerías):
  useEffect() -> Obtiene data del servidor para conectarlo con el
  useState() -> Permite cambiar valores con interacciones de la página 
  e insertar valores iniciales de los elementos.
  useNavigate() -> Cambia de página o ruta desde el código
  useLocation() -> Lee información de la URL actual */

function Header({ setQuery, loggedIn, setLoggedIn, setUser }) {
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
      navigate("/");
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser({});
    if (location.pathname == "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

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
          <h1>Share your geek side with new friends!</h1>
          <input
            value={search}
            id="search-input"
            type="search"
            placeholder="Search games..."
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
