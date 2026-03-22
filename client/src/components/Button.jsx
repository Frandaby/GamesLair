import "../css/Button.css";

function Button({ text, image, onClick }) {
  return (
    <>
      <div class="user-buttons" onClick={onClick}>
        <img class="user-images" src={image} alt={text} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default Button;
