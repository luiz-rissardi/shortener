import Hashids from "hashids"
import { DateFormat } from "../../shared/utils/dateFormat.js";


export class UrlModel {

    shortCode;
    targetUrl;
    createdAt;
    accessCount;
    sequenceId;

    #hashService = new Hashids("Tester_de_Salt", 7)

    constructor(targetUrl, sequenceId) {
        this.sequenceId = sequenceId;
        this.targetUrl = targetUrl;
        this.accessCount = 0;
        this.shortCode = this.#hashService.encode(sequenceId);
        this.createdAt = DateFormat(new Date().toISOString());
    }

    changeShortCode(sequenceId) {
        this.sequenceId = sequenceId;
        this.shortCode = this.#hashService.encode(sequenceId);
        return this
    }

    static isValid(targetUrl) {
        try {
            const strictUrlRegex = /^https?:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/]*)?(?:\?[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?(?:#[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/;
            return strictUrlRegex.test(targetUrl);
        } catch (error) {
            return false;
        }
    }
}