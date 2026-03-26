import "../css/Games.css";

function Games({ games }) {
  return (
    <>
      <div class="main-page">
        <div id="filter-container">
          <div class="filters">
            <label for="order"></label>
            <select class="filter-input" name="order">
              <option value="mejor-valorados">Mejor valorados</option>
              <option value="peor-valorados">Peor valorados</option>
              <option value="mas-recientes">Más recientes</option>
              <option value="mas-antiguos">Más antiguos</option>
            </select>
          </div>
          <div class="filters">
            <label for="genre"></label>
            <select class="filter-input" name="genre">
              <option value="accion">Acción</option>
              <option value="plataformas">Plataformas</option>
              <option value="rpg">RPG</option>
            </select>
          </div>
          <div class="filters">
            <label for="platform"></label>
            <select class="filter-input" name="platform">
              <option value="playstation-5">Playstation 5</option>
              <option value="switch">Switch</option>
              <option value="xbox-series-x">Xbox series X</option>
            </select>
          </div>
        </div>
        <div class="games">
          {games.map((game) => (
            <div class="game-card">
              <h2 class="game-name">{game.name}</h2>
              <img class="game-image" src={game.background_image} />
              <div class="game-details">
                <p class="details-text">
                  <span class="details-bold">Puntuación: </span>
                  {game.metacritic}
                </p>
                <p class="details-text">
                  <span class="details-bold">Fecha de lanzamiento: </span>
                  {game.released.slice(0, 4)}{" "}
                  {/*La función slice elimina los caracteres no incluidos (en este caso solo deja los 5 primeros, el año) */}
                </p>
                <button class="game-button">Ver ficha</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Games;
