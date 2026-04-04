const express = require("express");
const cors = require("cors"); //CORS se utiliza más para permisos. Necesitamos su permiso para acceder
const apiRoutes = require("./routes/api.js");
const authRoutes = require("./routes/auth.js");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();

//Middleware between the request and response
app.use(cors());
app.use(express.json());

// Here I define what endpoint to target when using the API Routes defines in api.js
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

// This is a route. If I access this route I will get this response.
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(5000, () => {
  console.log(`Server is running at http://localhost:${PORT} !`);
  // console.log("Server is running at " + PORT);
});

/*En estos dos console.log estamos utilizando una variable ya definida (PORT) de dos maneras
distintas: una es con los backticks `---`y el $ dentro de un string, y la otra 
con el símbolo + . */
