const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const routes=require("./src/routes/index.js")


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
    console.log(`Server is listening on port:${PORT}`);
  });
