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
        result.setStatusCode(201);
        return result
    }
}