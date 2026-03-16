import "../css/Header.css";
import Button from "../components/Button.jsx";
import signUp from "../assets/sign-up.png";
import logIn from "../assets/log-in.png";
import logo from "../assets/games-lair-logo.png";

function Header() {
  const handleSignUp = () => {
    alert("Sign Up");
  };
  const handleLogIn = () => {
    alert("Log In");
  };
  return (
    <>
      <header id="header">
        <div id="logo-div">
          <img id="logo" src={logo} />
        </div>
        <div id="search-bar">
          <h1>¡Comparte tu frikismo con nuevos amigos!</h1>
          <input
            id="search-input"
            type="search"
            placeholder="Buscar juegos..."
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
