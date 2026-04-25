//Para gestionar la pestaña de los rankings

import "../css/Rankings.css";
import { useState, useEffect } from "react";

function Rankings({ toggle }) {
  const [toggleRanking, setToggleRanking] = useState(null);
  //Esta función cambia el nombre en el frontend de los tags para que los muestre en mayúscula y con espacio.
  function formatTag(tag) {
    return tag
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const [rankings, setRankings] = useState([]);
  useEffect(() => {
    const endpoint = `http://localhost:5000/data/rankings`;
    fetch(endpoint)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRankings(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClick = (ranking) => {
    setToggleRanking((prev) => (prev === ranking ? null : ranking));
  };

  return (
    <>
      <div id="main-ranking-div" class={toggle ? "" : "expanded"}>
        <div id="ranking-container">
          <h2 id="ranking-header">Rankings</h2>
          {rankings.map((ranking) => (
            <div class="ranking">
              <h3
                class="tag-header"
                onClick={() => handleClick(ranking.tag_name)}
              >
                {formatTag(ranking.tag_name)}
              </h3>
              {/*Relacionamos toggleRanking con ranking.tag_name para que solo muestre la tabla del ranking en el que hacemos click. */}
              {toggleRanking === ranking.tag_name && (
                <table class="ranking-table">
                  <tbody>
                    {ranking.top_games.map((game) => (
                      <tr>
                        <td class="rank">{game.rank}</td>
                        <td>
                          <div class="image-container">
                            <img src={game.image_url} class="game-image" />
                          </div>
                        </td>
                        <td>{game.game_name}</td>
                        <td>({game.tag_count})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Rankings;
