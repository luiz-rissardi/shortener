import Redis from "ioredis";

export class RedisClient {
    #client;
    static #instance = null;

    constructor() {
        // Proteção opcional caso tentem dar `new` diretamente fora da hora
        if (RedisClient.#instance) {
            return RedisClient.#instance;
        }

        this.#client = new Redis({
            sentinels: [
                { host: 'sentinel-1', port: 26379 },
                { host: 'sentinel-2', port: 26379 },
                { host: 'sentinel-3', port: 26379 }
            ],
            name: 'mymaster',
            password: 'redispassword',
            lazyConnect: true,
            retryStrategy: (times) => Math.min(times * 200, 3000),
            maxRetriesPerRequest: 10
        });

        this.#client.on('connect', () => {
            console.log('✅ Conectado ao Sentinel');
        });

        this.#client.on('ready', () => {
            console.log('✅ Redis pronto');
        });

        this.#client.on('reconnecting', () => {
            console.log('🔄 Reconectando...');
        });

        this.#client.on('error', (err) => {
            console.error('❌ Redis:', err.message);
        });

        RedisClient.#instance = this;
    }

    // Método estático para obter a única instância global
    static getInstance() {
        if (!RedisClient.#instance) {
            console.log("apenas uma vez");
            RedisClient.#instance = new RedisClient();
        }
        return RedisClient.#instance;
    }

    static init() {
        return new RedisClient();
    }

    getClient() {
        return this.#client;
    }
}