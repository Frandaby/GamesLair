const express = require("express");
const router = express.Router();
require("dotenv").config();
const API_KEY = process.env.API_KEY;
let id = "292842";
let page = 1;

//Para contactar con la API utilizaremos el método HTTP GET. Esta es la ruta que se usará.
router.get("/all", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&creators=shigeru-miyamoto&page=${page}`,
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

//Rutas para ordenar los videojuegos mejor a peor, peor/mejor, más nuevo/más viejo y más viejo/más nuevo.

//INCLUIR MEJOR/PEOR Y PEOR/MEJOR CON NOTAS DE USUARIOS CUANDO TENGA LA BBDD.

router.get("/best-to-worst", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&metacritic=1,100&ordering=-metacritic&page=${page}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

router.get("/worst-to-best", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&metacritic=1,100&ordering=metacritic&page=${page}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

router.get("/newest-to-oldest", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&dates=1958-10-18,3000-02-22&ordering=-released&page=${page}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

router.get("/oldest-to-newest", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&dates=1958-10-18,3000-02-22&ordering=released&page=${page}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
