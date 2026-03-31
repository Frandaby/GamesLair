import "./css/App.css";
import Header from "./elements/Header.jsx";
import Games from "./elements/Games.jsx";
import { useState } from "react";
import Sidebar from "./elements/Sidebar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <Router>
        <Header setQuery={setQuery} />
        <div id="main-body">
          <Sidebar toggle={toggle} setToggle={setToggle} />
          <Routes>
            <Route path="/" element={<Games query={query} toggle={toggle} />} />
            <Route path="/reviews" element={<p>test</p>} />
            <Route path="/rankings" element={<p>test</p>} />
            <Route path="/favoritos" element={<p>test</p>} />
            <Route path="/foro" element={<p>test</p>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
