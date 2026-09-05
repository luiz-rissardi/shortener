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
}