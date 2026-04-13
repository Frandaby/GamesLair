//Archivo para todo lo relacionado con el registro de usuario (log in y sign up)
import "../css/Registration.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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

  async function postRequest(endpoint, data) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
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
      const endpoint = `http://localhost:5000/auth${path}`;
      const data = await postRequest(endpoint, userData);
      console.log(data.message || data.error);
      if (path == "/log-in" && data.token) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setUser({ id: data.user.id, email: data.user.email });
        navigate("/");
      } else if (path == "/log-in" && !data.token) {
        console.log(data.message || data.error);
      } else if (
        path == "/sign-up" &&
        data.message == "User created successfully."
      ) {
        navigate("/log-in");
      } else {
        console.log(data.message || data.error);
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
              <h2 id="form-title">
                {path == "/sign-up" ? "Sign up" : "Log in"}
              </h2>
              {path == "/sign-up" && (
                <div class="label-input-div">
                  <label class="form-label" for="name">
                    <b>Name</b>
                  </label>
                  <input
                    onChange={handleUserData}
                    class="form-input"
                    name="firstName"
                    type="text"
                    placeholder="Paco"
                    required
                  />
                </div>
              )}
              {path == "/sign-up" && (
                <div class="label-input-div">
                  <label class="form-label" for="surmane">
                    <b>Surname</b>
                  </label>
                  <input
                    onChange={handleUserData}
                    class="form-input"
                    name="lastName"
                    type="text"
                    placeholder="Paquez"
                    required
                  />
                </div>
              )}
              <div class="label-input-div">
                <label class="form-label" for="email">
                  <b>Email</b>
                </label>
                <input
                  onChange={handleUserData}
                  class="form-input"
                  name="email"
                  type="email"
                  placeholder="paco@paco.com"
                  required
                />
              </div>
              <div class="label-input-div">
                <label class="form-label" for="password">
                  <b>Password</b>
                </label>
                <input
                  onChange={handleUserData}
                  class="form-input"
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  minLength="8"
                  required
                />
              </div>
              {path == "/sign-up" && (
                <div class="label-input-div">
                  <label
                    style={{
                      color: passwordError ? "red" : "#22d3ee",
                    }}
                    class="form-label"
                    for="repeat-password"
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
                    class="form-input"
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
