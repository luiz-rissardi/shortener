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
    }

    async recoverCounter(maxIdFromDb) {
        const safeStart = Math.max(maxIdFromDb, 62**6); // seu valor inicial de 8192 vira o piso

        // Script Lua garante que o Redis fará a checagem e a atualização de uma vez só (Atômico)
        const luaScript = `
            local current = redis.call('GET', KEYS[1])
            local nextVal = tonumber(ARGV[1])
            if not current or tonumber(current) < nextVal then
                redis.call('SET', KEYS[1], nextVal)
                return nextVal
            end
            return tonumber(current)
        `;

        const finalValue = await this.#redisClient.eval(luaScript, 1, this.#sequenceKey, safeStart);
        console.log(`[Redis] Contador sincronizado de forma atômica. Piso atual: ${finalValue}`);
    }

    // incr é atomico portando não sofremos com concorrencia, é tratado como fila pelo redis
    async getNextSequenceId() {
        return this.#redisClient.incr(this.#sequenceKey);
    }

    async setCounter(value) {
        return this.#redisClient.set(this.#sequenceKey, value);
    }

    async getCachedUrl(shortCode) {
        return this.#redisClient.get(`${this.#urlCacheKey}:${shortCode}`);
    }

    async cacheUrl(shortCode, targetUrl) {
        return this.#redisClient.set(`${this.#urlCacheKey}:${shortCode}`, targetUrl, "EX", this.#cacheTTLSeconds);
    }
}