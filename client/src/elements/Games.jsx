import "../css/Games.css";

function Games({ games }) {
  return (
    <>
      <div>
        {games.map((game) => (
          <div>
            <p>{game.name}</p>
            <img width="100px" src={game.background_image} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Games;
