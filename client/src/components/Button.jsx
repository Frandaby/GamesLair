//Archivo para exportar todas las características de Button cada vez que lo tengamos que utilizar
import "../css/Button.css";

function Button({ text, image, onClick }) {
  return (
    <>
      <div className="user-buttons" onClick={onClick}>
        <img className="user-images" src={image} alt={text} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default Button;
