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

async function getPosts() {
  const [rows] = await database.execute(
    `SELECT p.*, u.email
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC;`,
  );
  return rows;
}

async function createPost(userID, post) {
  const [result] = await database.execute(
    "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
    [userID, post.title, post.content],
  );
  return result;
}

async function getComments() {
  const [rows] = await database.execute(
    "SELECT replies.*, users.email FROM replies JOIN users ON replies.user_id = users.id;",
  );
  return rows;
}

async function createComment(userID, comment) {
  const [result] = await database.execute(
    "INSERT INTO replies (user_id, post_id, content) VALUES (?, ?, ?)",
    [userID, comment.postID, comment.content],
  );
  return result;
}

async function getTags() {
  const [rows] = await database.execute("SELECT * FROM tags");
  return rows;
}

async function createReview(text, score, gameID, userID) {
  const [result] = await database.execute(
    "INSERT INTO reviews (user_id, game_id, review_text, score) VALUES (?, ?, ?, ?)",
    [userID, gameID, text, score],
  );
  return result.insertId;
}

//Con esta funcion relacionamos las tablas reviews y tags en una intermedia review_tags, ya que es relacion N:M
async function createReviewTags(reviewID, tags) {
  const placeholders = tags.map(() => "(?, ?)").join(", ");
  const values = tags.flatMap((tagID) => [reviewID, tagID]);

  const [result] = await database.execute(
    `INSERT INTO review_tags (review_id, tag_id) VALUES ${placeholders}`,
    values,
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

router.get("/forum", async (req, res) => {
  try {
    const data = await getPosts();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forum", async (req, res) => {
  try {
    const { data, userID } = req.body;
    await createPost(userID, data);
    res.status(200).json({ message: "Post created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/forum/comments", async (req, res) => {
  try {
    const data = await getComments();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forum/comments", async (req, res) => {
  try {
    const { data, userID } = req.body;
    await createComment(userID, data);
    res.status(200).json({ message: "Comment created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tags", async (req, res) => {
  try {
    const data = await getTags();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const { data, game } = req.body;
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
    const reviewID = await createReview(
      data.text,
      data.score,
      gameID,
      data.userID,
    );
    await createReviewTags(reviewID, data.tags);
    await res.status(200).json({ message: "Review created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
