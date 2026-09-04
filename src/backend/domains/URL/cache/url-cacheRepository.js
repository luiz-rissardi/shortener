import Redis from "ioredis";

export class UrlCacheRepository {

    #urlCacheKey = "url:chached";
    #sequenceKey = "url:sequence";
    #cacheTTLSeconds = 300; // 5 mins

    /**
     * @type {Redis}
     */
    #redisClient = null;

    constructor(redisClient) {
        if (this.#redisClient == null) {
            this.#redisClient = redisClient
        }
        // set inicial para um alto valor de incremento (2 elevado á 13)
        this.#setCounter(2**13)
    }

    // incr é atomico portando não sofremos com concorrencia, é tratado como fila pelo redis
    async getNextSequenceId() {
        return this.#redisClient.incr(this.#sequenceKey);
    }

    async #setCounter(value) {
        return this.#redisClient.set(this.#sequenceKey, value);
    }

    async getCachedUrl(shortCode) {
        return this.#redisClient.get(`${this.#urlCacheKey}:${shortCode}`);
    }

    async cacheUrl(shortCode, targetUrl) {
        return this.#redisClient.set(`${this.#urlCacheKey}:${shortCode}`, targetUrl, {
            EX: this.#cacheTTLSeconds,
        });
    }
}