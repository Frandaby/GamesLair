//Archivo que conecta con la base de datos local.
import express from "express";
const router = express.Router();
import {
  getFavourites,
  createFavourite,
  deleteFavourite,
  getGame,
  createGame,
  getPosts,
  createPost,
  getComments,
  createComment,
  getTags,
  getGameReviews,
  getUserReviews,
  createReview,
  deleteReview,
  updateReview,
  createReviewTags,
  updateReviewTags,
  getRankings,
} from "../controllers/dataControllers.js";

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

export default router;
