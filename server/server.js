import express from "express";
import cors from "cors"; //CORS se utiliza más para permisos. Necesitamos su permiso para acceder
import apiRoutes from "./routes/api.js";
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

const app = express();

//Middleware entre "request" y "response"
app.use(cors());
app.use(express.json());

//Aquí se definen a qué endpoints apuntamos cuando usamos las rutas API definidas en api.js
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

//Ruta de acceso al servidor.
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
