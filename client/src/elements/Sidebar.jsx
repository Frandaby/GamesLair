//Barra lateral de la página y su funcionalidad
import "../css/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // 1. Importamos useEffect (RESPONSIVE STEPS)

//Función para crear la barra lateral colapsable
function Sidebar({ toggle, setToggle }) {
  const navigate = useNavigate();
  // 2. Lógica para cerrar el sidebar automáticamente en móviles al cargar (RESPONSIVE STEPS: Line 9 to 25)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setToggle(false); // En móvil, cerrado por defecto
      } else {
        setToggle(true); // En desktop, abierto por defecto
      }
    };

    // Ejecutamos una vez al montar el componente
    handleResize();

    // Opcional: Escuchar cambios de tamaño en tiempo real
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setToggle]); // Solo se ejecuta al inicio (END RESPONSIVE STEP)

  const handleToggle = () => {
    setToggle(!toggle);
  };

  //With RESPONSIVE (Original below)

  return (
    <>
      {/* El icono principal ahora cambia entre barras y una X (o flechas) */}
      <i
        className={
          toggle
            ? "fas fa-times hamburger-menu" // Icono de X cuando está abierto
            : "fas fa-bars hamburger-menu" // Icono de barras cuando está cerrado
        }
        onClick={handleToggle}
      ></i>
      <div id="sidebar" className={toggle ? "" : "collapsed"}>
        <i
          onClick={handleToggle}
          className={
            toggle
              ? "fas fa-angle-double-left fas-fa-angle-double hide-on-mobile"
              : "fas fa-angle-double-right fas-fa-angle-double hide-on-mobile"
          }
        ></i>
        <ul id="nav-list" className={toggle ? "" : "collapsed"}>
          <li
            className={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/reviews");
            }}
          >
            Reviews
          </li>
          <li
            className={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/rankings");
            }}
          >
            Rankings
          </li>
          <li
            className={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/favourites");
            }}
          >
            Favourites
          </li>
          <li
            className={`nav-element ${toggle ? "" : "element-collapsed"}`}
            onClick={() => {
              navigate("/forum");
            }}
          >
            Forum
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
