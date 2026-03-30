import "../css/Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <>
      <div id="sidebar">
        <ul id="nav-list">
          <li
            class="nav-element"
            onClick={() => {
              navigate("/reviews");
            }}
          >
            Reviews
          </li>
          <li
            class="nav-element"
            onClick={() => {
              navigate("/rankings");
            }}
          >
            Rankings
          </li>
          <li
            class="nav-element"
            onClick={() => {
              navigate("/favoritos");
            }}
          >
            Favoritos
          </li>
          <li
            class="nav-element"
            onClick={() => {
              navigate("/foro");
            }}
          >
            Foro
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
