import { Router } from "express";
import { ExpressAdapter } from "./adapter-express.js";
import { UrlFactory } from "../../domains/URL/url-factory.js";


export class UrlRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = UrlFactory.createController();

    }

    getRoutes() {

        this.#router.route("/api/shortUrl")
            .post(
                ExpressAdapter.adapt(
                    this.#controller.createShortUrl.bind(this.#controller)
                )
            )

        this.#router.route("/api/getAll")
            .get(
                ExpressAdapter.adapt(
                    this.#controller.getAllUrls.bind(this.#controller)
                )
            )

        this.#router.route("/:shortCode")
            .get(
                ExpressAdapter.adaptRedirect(
                    this.#controller.getTargetUrl.bind(this.#controller)
                )
            )

        return this.#router
    }

}