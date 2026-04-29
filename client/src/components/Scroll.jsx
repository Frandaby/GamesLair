//Componente para manejar el botón "Scroll to top" que vuelve al principio de la página.
//Se reusa en Reviews, Games, Rankings, Favourites y Forum.
import "../css/Scroll.css";
import { useState, useEffect } from "react";

function Scroll({}) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <button
        id="scroll-top"
        className={showScroll ? "show" : ""}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-angle-double-up"></i>
      </button>
    </>
  );
}

export default Scroll;
