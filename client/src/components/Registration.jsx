//Archivo para todo lo relacionado con el registro de usuario (log in y sign up)
import "../css/Registration.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { postRequest } from "../utilities";

function Registration({ setLoggedIn, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const mainEndpoint = `http://localhost:5000/`;

  const handleClick = () => {
    navigate("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (path == "/sign-up" && userData.password !== repeatedPassword) {
      setPasswordError("Passwords don't match!");
      return;
    } else {
      setPasswordError("");
      const endpoint = mainEndpoint + `auth${path}`;
      const data = await postRequest(endpoint, userData);
      console.log(data.message || data.error);
      if (path == "/log-in" && data.token) {
        setErrorMessage("");
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.user.id, email: data.user.email }),
        );
        setLoggedIn(true);
        setUser({ id: data.user.id, email: data.user.email });
        navigate("/");
      } else if (path == "/log-in" && !data.token) {
        setErrorMessage(data.message || data.error);
      } else if (
        path == "/sign-up" &&
        data.message == "User created successfully."
      ) {
        setErrorMessage("");
        navigate("/log-in");
      } else {
        setErrorMessage(data.message || data.error);
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setRepeatedPassword(value);
    if (
      userData.password !== value &&
      value.length >= userData.password.length
    ) {
      setPasswordError("Passwords don't match!");
    } else {
      setPasswordError("");
    }
  };

  const handleUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div id="registration-overlay" onClick={handleClick}>
        <div
          style={{
            height: path == "/log-in" ? "40%" : "70%",
          }}
          id="registration-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <form id="form" onSubmit={handleSubmit}>
            <div id="form-div">
              {errorMessage.length > 0 && (
                <p id="error-message">
                  Authentication failed, please try again.
                </p>
              )}
              <h2 id="form-title">
                {path == "/sign-up" ? "Sign up" : "Log in"}
              </h2>
              {path == "/sign-up" && (
                <div className="label-input-div">
                  <label className="form-label" htmlFor="name">
                    <b>Name</b>
                  </label>
                  <input
                    onChange={handleUserData}
                    className="form-input"
                    name="firstName"
                    type="text"
                    placeholder="Paco"
                    required
                  />
                </div>
              )}
              {path == "/sign-up" && (
                <div className="label-input-div">
                  <label className="form-label" htmlFor="surmane">
                    <b>Surname</b>
                  </label>
                  <input
                    onChange={handleUserData}
                    className="form-input"
                    name="lastName"
                    type="text"
                    placeholder="Paquez"
                    required
                  />
                </div>
              )}
              <div className="label-input-div">
                <label className="form-label" htmlFor="email">
                  <b>Email</b>
                </label>
                <input
                  onChange={handleUserData}
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="paco@paco.com"
                  required
                />
              </div>
              <div className="label-input-div">
                <label className="form-label" htmlFor="password">
                  <b>Password</b>
                </label>
                <input
                  onChange={handleUserData}
                  className="form-input"
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  minLength="8"
                  required
                />
              </div>
              {path == "/sign-up" && (
                <div className="label-input-div">
                  <label
                    style={{
                      color: passwordError ? "red" : "#22d3ee",
                    }}
                    className="form-label"
                    htmlFor="repeat-password"
                  >
                    <b>{passwordError ? passwordError : "Repeat Password"}</b>
                  </label>
                  <input
                    style={{
                      border: passwordError
                        ? "1px solid red"
                        : "1px solid #22d3ee",
                    }}
                    onChange={(e) => handleChange(e)}
                    className="form-input"
                    name="repeat-password"
                    type="password"
                    placeholder="Repeat your password here..."
                    minlength="8"
                    required
                  />
                </div>
              )}
              <button id="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Registration;
