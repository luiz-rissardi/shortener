import { createPool, PoolConnection } from "mysql2/promise";
import { UrlModel } from "./url-model.js";
import { RepositoryOperationError } from "../../shared/AppExceptions/appErrors.js";
import { Result } from "../../shared/utils/result.js";

export class UrlRepository {
    #PoolConnection;
    static #instance = null;

    constructor() {
        if (UrlRepository.#instance) {
            return UrlRepository.#instance;
        }

        this.#PoolConnection = createPool({
            host: 'proxysql',
            port: 6033,
            user: 'app_user',
            password: 'app_password',
            database: 'myapp',
        });

        UrlRepository.#instance = this;
    }

    static getInstance() {
        if (!UrlRepository.#instance) {
            UrlRepository.#instance = new UrlRepository();
        }
        return UrlRepository.#instance;
    }

    async getConnection() {
        const conn = await this.#PoolConnection.getConnection();
        return conn;
    }

    async putOne(shortCode, connection = null) {
        try {
            const executor = connection || this.#PoolConnection;
            await executor.query("UPDATE urls SET accessCount = accessCount + 1 WHERE shortCode = ?", [shortCode]);
        } catch (error) {
            throw RepositoryOperationError.create();
        }
    }

    /**
     * @param {string} shortCode 
     * @param {PoolConnection} connection 
     */
    async getOne(shortCode, connection = null) {
        try {
            const executor = connection || this.#PoolConnection;
            const [result] = await executor.query("SELECT * FROM urls WHERE shortCode = ?", [shortCode]);
            return result;
        } catch (error) {
            throw RepositoryOperationError.create();
        }
    }

    /**
     * @param {PoolConnection} connection 
     */
    async getAll(connection = null) {
        try {
            const executor = connection || this.#PoolConnection;
            const [result] = await executor.query("SELECT * FROM urls ");
            return result;
        } catch (error) {
            throw RepositoryOperationError.create();
        }
    }

    async deleteOne(shortCode, connection = null){
        try {
            const executor = connection || this.#PoolConnection;
            await executor.query("DELETE FROM urls WHERE shortCode = ?",[shortCode]);
            return Result.ok("url deletada")
        } catch (error) {
            throw RepositoryOperationError.create()
        }
    }

    /**
     * @param {UrlModel} urlModel 
     * @param {PoolConnection} connection 
     * @returns {Promise<Boolean>} true for insert if is successfully 
     */
    async insertOne(urlModel, connection = null) {
        const executor = connection || this.#PoolConnection;
        try {
            await executor.query(`
            INSERT INTO urls(shortCode,targetUrl,createdAt,accessCount,sequenceId)
            VALUES (?,?,?,?,?)`,
                [
                    urlModel.shortCode,
                    urlModel.targetUrl,
                    urlModel.createdAt,
                    urlModel.accessCount,
                    urlModel.sequenceId
                ]
            );
            return true;
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                console.warn(`⚠️ Colisão evitada/detectada para o shortCode: ${urlModel.shortCode}`);
                return false; // colisão de verdade, esperado
            }

            console.error("❌ Erro inesperado no repositório MySQL:", error);
            throw RepositoryOperationError.create();
        }
    }

    // usado apenas para exceções de colisão ex: Redis caiu e não salvou no disco porém foi criado no banco
    async findLastedSequenceId(connection) {
        const executor = connection || this.#PoolConnection;
        // CAST garante precisão matemática para não ler texto sem querer e atrasar o Redis
        const [result] = await executor.query("SELECT MAX(CAST(sequenceId AS UNSIGNED)) AS last_id FROM urls;");
        return result[0].last_id || 0;
    }
}