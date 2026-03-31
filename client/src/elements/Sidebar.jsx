import "../css/Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar({ toggle, setToggle }) {
  const navigate = useNavigate();
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <>
      <div id="sidebar" class={toggle ? "" : "collapsed"}>
        <i
          onClick={handleToggle}
          class={
            toggle
              ? "fas fa-angle-double-left fas-fa-angle-double"
              : "fas fa-angle-double-right fas-fa-angle-double"
          }
        ></i>
        <ul id="nav-list" class={toggle ? "" : "collapsed"}>
          <li
            class={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/reviews");
            }}
          >
            Reviews
          </li>
          <li
            class={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/rankings");
            }}
          >
            Rankings
          </li>
          <li
            class={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/favoritos");
            }}
          >
            Favoritos
          </li>
          <li
            class={`nav-element ${toggle ? "" : "element-collapsed"}`}
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
