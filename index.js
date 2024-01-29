import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

//loading middlewares
app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.enable('trust proxy');

//loading routes
app.use(routes);

app.listen(PORT, () => {
    console.log(`app is listening on port:${PORT}`);
  });
