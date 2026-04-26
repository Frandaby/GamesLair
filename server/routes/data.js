//Archivo que conecta con la base de datos local.
const database = require("../database");
const express = require("express");
const router = express.Router();

async function getFavourites(email) {
  const [rows] = await database.execute(
    "SELECT g.* FROM favourites f JOIN users u ON f.user_id = u.id JOIN games g ON f.game_id = g.id WHERE u.email = ?",
    [email],
  );
  return rows;
}

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

async function getGameReviews(gameID) {
  const [rows] = await database.execute(
    `SELECT 
      r.id,
      r.review_text,
      r.score,
      r.game_id,
      r.user_id,
      r.created_at,
      r.updated_at,
      u.email
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.game_id = ?
    ORDER BY r.created_at DESC`,
    [gameID],
  );
  return rows;
}

async function getUserReviews(userID) {
  const [rows] = await database.execute(
    `
    SELECT 
      r.id AS review_id,
      r.review_text,
      r.score,
      r.game_id,
      r.created_at,
      r.updated_at,
      g.name AS game_title,
      t.id AS tag_id,
      t.name AS tag_name
    FROM reviews r
    LEFT JOIN games g ON r.game_id = g.id
    LEFT JOIN review_tags rt ON r.id = rt.review_id
    LEFT JOIN tags t ON rt.tag_id = t.id
    WHERE r.user_id = ?
    `,
    //Con esta query unimos la tabla review_tags con reviews y tags al ser relación N:M
    [userID],
  );

  const reviews = {};

  //Con esta función hacemos un for que recorre cada review y le añade un array tags vacío al objeto.
  for (const row of rows) {
    if (!reviews[row.review_id]) {
      reviews[row.review_id] = {
        id: row.review_id,
        text: row.review_text,
        score: row.score,
        date: row.created_at,
        updatedDate: row.updated_at,
        gameID: row.game_id,
        game: row.game_title,
        tags: [],
      };
    }
    //Con esta otra función si existe un nuevo tag lo incluimos dentro del tags creado antes.
    //Sin estas dos condiciones se crearía una nueva review por cada tag, y lo que queremos es que se incluyan en la misma.
    if (row.tag_id) {
      reviews[row.review_id].tags.push({
        id: row.tag_id,
        name: row.tag_name,
      });
    }
  }

  return Object.values(reviews);
}

async function createReview(text, score, gameID, userID) {
  const [result] = await database.execute(
    "INSERT INTO reviews (user_id, game_id, review_text, score) VALUES (?, ?, ?, ?)",
    [userID, gameID, text, score],
  );
  return result.insertId;
}

async function deleteReview(reviewID) {
  const [result] = await database.execute("DELETE FROM reviews WHERE id = ?", [
    reviewID,
  ]);
  return result;
}

async function updateReview(reviewID, text, score) {
  await database.execute(
    "UPDATE reviews SET review_text = ?, score = ?, updated_at = NOW() WHERE id = ?",
    [text, score, reviewID],
  );
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

async function updateReviewTags(reviewID, tags) {
  await database.execute("DELETE FROM review_tags WHERE review_id = ?", [
    reviewID,
  ]);
  if (tags && tags.length > 0) {
    const values = tags.map((tagID) => [reviewID, tagID]);
    await database.query(
      "INSERT INTO review_tags (review_id, tag_id) VALUES ?",
      [values],
    );
  }
}

async function getRankings() {
  const [rows] = await database.execute(
    `SELECT * FROM (
    SELECT 
      t.id AS tag_id,
      t.name AS tag_name,
      g.id AS game_id,
      g.name AS game_name,
      g.image_url AS image_url,
      COUNT(rt.tag_id) AS tag_count,
      ROW_NUMBER() OVER (
        PARTITION BY t.id 
        ORDER BY COUNT(rt.tag_id) DESC
      ) AS rank_position
    FROM review_tags rt
    JOIN reviews r ON rt.review_id = r.id
    JOIN tags t ON rt.tag_id = t.id
    JOIN games g ON r.game_id = g.id
    GROUP BY t.id, g.id
    ) ranked
    WHERE rank_position <= 10;`,
  );
  const result = [];

  rows.forEach((row) => {
    let group = result.find((t) => t.tag_name === row.tag_name);

    if (!group) {
      group = {
        tag_name: row.tag_name,
        top_games: [],
      };
      result.push(group);
    }

    group.top_games.push({
      game_id: row.game_id,
      game_name: row.game_name,
      image_url: row.image_url,
      tag_count: row.tag_count,
      rank: row.rank_position,
    });
  });

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

router.get("/reviews", async (req, res) => {
  try {
    const gameID = req.query.gameID || "";
    const userID = req.query.userID || "";
    let data;
    let tags = [];
    if (gameID) {
      const existingGame = await getGame(gameID);
      data = await getGameReviews(existingGame.id);
    } else {
      data = await getUserReviews(userID);
    }
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

router.delete("/reviews", async (req, res) => {
  try {
    const { reviewID } = req.body;
    await deleteReview(reviewID);
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/reviews", async (req, res) => {
  try {
    const { reviewID, text, score, tags } = req.body;
    await updateReview(reviewID, text, score);
    await updateReviewTags(reviewID, tags);
    res.status(200).json({ message: "Review updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/rankings", async (req, res) => {
  try {
    const data = await getRankings();
    // Para ordenar los rankings por orden alfabético
    data.sort((a, b) => a.tag_name.localeCompare(b.tag_name));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
