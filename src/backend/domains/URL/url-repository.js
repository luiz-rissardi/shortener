import { createPool, PoolConnection } from "mysql2/promise";
import { UrlModel } from "./url-model.js";


export class UrlRepository {


    #PoolConnection;

    constructor() {

        this.#PoolConnection = createPool({
            host: 'proxysql',
            port: 6033,
            user: 'app_user',
            password: 'app_password',
            database: 'myapp'
        })
    }

    async getConnection() {
        const conn = await this.#PoolConnection.getConnection();
        return conn
    }

    /**
     * 
     * @param {UrlModel} urlModel 
     * @param {PoolConnection} connection 
     * @returns {Promise<Boolean>} true for insert if is successfully 
     */
    async insertOne(urlModel, connection) {
        const executor = connection || this.#PoolConnection
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
            )
            return true;
        } catch (error) {
            
            if (error.code === "ER_DUP_ENTRY") {
                return false; // colisão de verdade, esperado
            }
            
            throw error
        }
    }

    // usado apenas para exessões de colisão ex: Redis caiu e não salvou no disco porém foi criado no banco
    async findLastedSequenceId(connection) {
        const executor = connection || this.#PoolConnection;
        const [result] = await executor.query("SELECT MAX(sequenceId) AS last_id FROM urls;");
        return result[0].last_id
    }
}