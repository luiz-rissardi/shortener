import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { UrlRoutes } from "./routers-express.js";
import { RedisClient } from "../cache/redisClient.js";
import { InternalServerError } from "../AppExceptions/appErrors.js";
import { UrlRepository } from "../../domains/URL/url-repository.js";
import { UrlCacheRepository } from "../../domains/URL/cache/url-cacheRepository.js";

dotenv.config();

async function bootstrap() {
    const redis = RedisClient.getInstance();
    
    const urlRepository = new UrlRepository();
    const urlCacheRepository = new UrlCacheRepository(redis.getClient());

    const maxId = await urlRepository.findLastedSequenceId();
    await urlCacheRepository.recoverCounter(maxId ?? 0);

    const app = express();

    app.use(express.json());
    app.use(helmet());
    app.use(cors({ origin: "*" }));

    const { urlRoutes } = setupRoutes();
    app.use(urlRoutes.getRoutes());

    app.use(errorHandler);

    app.listen(3000, () => {
        console.log("Server is running at port 3000, sequence counter recovered.");
    });
}

function setupRoutes() {
    const urlRoutes = new UrlRoutes();
    return {
        urlRoutes
    };
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    console.log(err);
    res.status(500).json(InternalServerError.create());
}

bootstrap().catch((err) => {
    console.error("Failed to start application:", err);
    process.exit(1);
});