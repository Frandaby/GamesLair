import "../css/Header.css";
import Button from "../components/Button.jsx";
import signUp from "../assets/sign-up.png";
import logIn from "../assets/log-in.png";
import logo from "../assets/games-lair-logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ setQuery }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); //setSearch cambia el valor de la variable
  const handleSignUp = () => {
    alert("Sign Up");
  };
  const handleLogIn = () => {
    alert("Log In");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuery(search);
    }
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
              navigate("/");
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
        <div id="user-buttons">
          <Button text="Sign up" image={signUp} onClick={handleSignUp} />
          {/*En React escribimos los parámetros dentro de la etiqueta*/}
          <Button text="Log in" image={logIn} onClick={handleLogIn} />
        </div>
      </header>
    </>
  );
}

export default Header;
