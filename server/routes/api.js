//Archivo con todo lo relacionado con request y response de la API utilizada
const express = require("express");
const router = express.Router();
require("dotenv").config();
const API_KEY = process.env.API_KEY;
let page = 1;

//Esta ruta se utilizará cuando queramos volver a la página principal.
router.get("/all", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

router.get("/details", async (req, res) => {
  try {
    const id = req.query.id;
    const response = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${API_KEY}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

//Endpoint para ordenar los videojuegos mejor a peor, peor/mejor, más nuevo/más viejo y más viejo/más nuevo.

router.get("/order-filter", async (req, res) => {
  try {
    const genre = req.query.genre;
    const platform = req.query.platform;
    const order = req.query.order;
    let selectedOrder;
    let genreQuery = "";
    let platformQuery = "";

    const orderConfiguration = {
      "elige-una-opcion": {
        ordering: "",
        filter: "",
      },
      "best-to-worst": {
        ordering: "&ordering=-metacritic",
        filter: "&metacritic=1,100",
      },
      "worst-to-best": {
        ordering: "&ordering=metacritic",
        filter: "&metacritic=1,100",
      },
      "newest-to-oldest": {
        ordering: "&ordering=-released",
        filter: "&dates=1958-10-18,3000-02-22",
      },
      "oldest-to-newest": {
        ordering: "&ordering=released",
        filter: "&dates=1958-10-18,3000-02-22",
      },
    };
    selectedOrder = orderConfiguration[order] || { ordering: "", filter: "" };
    if (genre && genre !== "999") {
      genreQuery = `&genres=${genre}`;
    }
    if (platform && platform !== "999") {
      platformQuery = `&platforms=${platform}`;
    }
    const endpoint = `https://api.rawg.io/api/games?key=${API_KEY}${genreQuery}${platformQuery}${selectedOrder.filter}${selectedOrder.ordering}&page=${page}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

//Endpoint para la barra de búsqueda
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

//Endpoint para el filtro genres (género)
router.get("/genres", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/genres?key=${API_KEY}&ordering=name`,
    );
    const data = await response.json();
    const genres = data.results.map((genre) => ({
      id: genre.id,
      name: genre.name,
    }));

    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

//Endpoint para el filtro platforms (plataforma donde está disponible)
router.get("/platforms", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/platforms?key=${API_KEY}&ordering=-games_count`,
    );
    const data = await response.json();
    const platforms = data.results.map((platform) => ({
      id: platform.id,
      name: platform.name,
    }));

    res.json(platforms);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

//Endpoint para que genre y platform se acumulen y no se sustituyan.
router.get("/filter", async (req, res) => {
  try {
    const genre = req.query.genre;
    const platform = req.query.platform;
    let genreQuery = "";
    let platformQuery = "";
    if (genre && genre !== "999") {
      genreQuery = `&genres=${genre}`;
    }
    if (platform && platform !== "999") {
      platformQuery = `&platforms=${platform}`;
    }
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}${genreQuery}${platformQuery}&page=${page}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
