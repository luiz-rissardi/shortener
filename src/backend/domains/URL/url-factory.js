import { RedisClient } from "../../shared/cache/redisClient.js";
import { UrlCacheRepository } from "./cache/url-cacheRepository.js";
import { UrlController } from "./url-controller.js";
import { UrlRepository } from "./url-repository.js";
import { UrlService } from "./url-service.js";

export class UrlFactory{

    static createController(){

        const redis = RedisClient.getInstance()
        const urlCacheRepository = new UrlCacheRepository(redis.getClient())
        const repository = new UrlRepository();
        const service = new UrlService(repository,urlCacheRepository);
        const controller = new UrlController(service);
        return controller;
    }
}