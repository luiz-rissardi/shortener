import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import { UrlRoutes } from "./routers-express.js";
import { RedisClient } from "../cache/redisClient.js";
import { InternalServerError } from "../AppExceptions/appErrors.js";


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

//error handler
app.use(errorHandler)

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

export function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    res.status(500).json(InternalServerError.create());
}