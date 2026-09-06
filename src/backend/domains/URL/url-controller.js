import { Result } from "../../shared/utils/result.js";
import { UrlService } from "./url-service.js";

export class UrlController {

    /**
     * @type {UrlService}
     */
    #service;

    constructor(urlService) {
        this.#service = urlService;
    }

    async createShortUrl({ targetUrl }) {
        const result = await this.#service.createUrlShorted(targetUrl)
        if (result.isSuccess) {
            result.setStatusCode(201);
        } else {
            result.setStatusCode(400);
        }
        return result
    }

    async getTargetUrl({ shortCode }) {
        const result = await this.#service.getTargetUrl(shortCode);

        if (result.isSuccess) {
            result.setStatusCode(302)
        } else if (result.getValue().errorName = "UrlNotFound") {
            result.setStatusCode(404)
        } else {
            result.setStatusCode(400)
        }
        return result;
    }

    async getAllUrls() {
        const result = await this.#service.getAllUrls();

        if (result.isSuccess) {
            result.setStatusCode(200)
        } else {
            result.setStatusCode(400)
        }
        return result;
    }
}