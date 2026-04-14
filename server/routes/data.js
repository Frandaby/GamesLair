//Archivo que conecta con la base de datos local. Por ahora añade/quita favoritos
const database = require("../database");
const express = require("express");
const router = express.Router();

async function createFavourite(userID, gameID) {
  const [result] = await database.execute(
    "INSERT IGNORE INTO favourites (user_id, game_id) VALUES (?, ?)",
    [userID, gameID],
  );
  return result;
}

async function deleteFavourite(userID, gameID) {
  const [result] = await database.execute(
    "DELETE FROM favourites WHERE user_id = ? AND game_id = ?",
    [userID, gameID],
  );
  return result;
}

async function getFavourites(email) {
  const [rows] = await database.execute(
    "SELECT g.* FROM favourites f JOIN users u ON f.user_id = u.id JOIN games g ON f.game_id = g.id WHERE u.email = ?",
    [email],
  );
  return rows;
}

async function getGame(apiID) {
  const [rows] = await database.execute(
    "SELECT * FROM games WHERE api_id = ? LIMIT 1",
    [apiID],
  );
  return rows[0];
}

async function createGame(
  apiID,
  name,
  imageURL,
  releaseDate,
  metacriticRating,
) {
  const [result] = await database.execute(
    "INSERT INTO games (api_id, name, image_url, release_date, metacritic_rating) VALUES (?, ?, ?, ?, ?)",
    [apiID, name, imageURL, releaseDate, metacriticRating],
  );
  return result;
}
//Ruta para obtener los favoritos
router.get("/favourites", async (req, res) => {
  try {
    const email = req.query.email;
    const favouritesData = await getFavourites(email);
    res.status(200).json(
      favouritesData.map((game) => ({
        id: game.api_id,
        name: game.name,
        background_image: game.image_url,
        released: game.release_date,
        metacritic: game.metacritic_rating,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para postear favoritos
router.post("/favourites", async (req, res) => {
  try {
    const { game, userID } = req.body;
    let gameID;

    const existingGame = await getGame(game.id); // Esta propiedad del id viene directamente del API...

    if (existingGame) {
      gameID = existingGame.id; // ...pero cuando mencionamos id aquí se refiere al campo id de nuestra tabla de nuestra BBDD. Son dos id distintos.
    } else {
      const result = await createGame(
        game.id,
        game.name,
        game.background_image,
        game.released,
        game.metacritic,
      );
      gameID = result.insertId; //Esta propiedad es devuelta por mysql después de crear una entrada en la tabla local (no de la API)
    }
    await createFavourite(userID, gameID);
    res.status(200).json({ message: "Favourite created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para borrar favoritos
router.delete("/favourites", async (req, res) => {
  try {
    const { userID, apiID } = req.body;
    const existingGame = await getGame(apiID);
    const gameID = existingGame.id;
    await deleteFavourite(userID, gameID);
    res.status(200).json({ message: "Favourite deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
