import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import { UrlRoutes } from "./routers-express.js";
import { RedisClient } from "../cache/redisClient.js";


RedisClient.init()

const app = express();

dotenv.config()
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: "*"
}));

//rotas
const { urlRoutes } = setupRoutes()

app.use(urlRoutes.getRoutes());

app.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port 3000`);
    })

function setupRoutes() {

    const urlRoutes = new UrlRoutes()

    return {
       urlRoutes
    }
}