import { UrlModel } from "./url-model.js";
import { UrlRepository } from "./url-repository.js";
import { UrlCacheRepository } from "./cache/url-cacheRepository.js";
import { Result } from "../../shared/utils/result.js";


export class UrlService {

    #urlCacheRepository
    #urlRepository
    /**
     * 
     * @param {UrlRepository} urlRepository 
     * @param {UrlCacheRepository} urlCacheRepository 
     */
    constructor(urlRepository, urlCacheRepository) {
        this.#urlCacheRepository = urlCacheRepository;
        this.#urlRepository = urlRepository;
    }

    /**
     * 
     * @param {string} targetUrl 
     * @description essa função deve pegar e inscrementar a sequencia via incr do redis e inserir
     * no banco de dados o modelo de dados.
     */
    async createUrlShorted(targetUrl) {

        const connection = await this.#urlRepository.getConnection();

        try {
            await connection.beginTransaction();
            const sequenceId = await this.#urlCacheRepository.getNextSequenceId();
            const model = new UrlModel(targetUrl, sequenceId);

            // inserir no banco o modelo de dados
            const wasCreated = await this.#urlRepository.insertOne(model, connection);
            // esse caso é para quando ele vai inserir e já existe um registro com aquele shortCode
            // apenas 1 vez
            if (!wasCreated) {
                const newSequenceId = await this.#urlRepository.findLastedSequenceId(connection) + 1;
                model.changeShortCode(newSequenceId);
                const test = await this.#urlRepository.insertOne(model, connection);
                if (!test) {
                    await connection.rollback();
                    return Result.fail("não foi possivel inserir com sequenceId atualizado !")
                }
            }

            await connection.commit();
            return Result.ok({shortCode:model.shortCode});
        } catch (error) {
            console.log(error);
            await connection.rollback();
            return Result.fail(`Erro ao encurtar URL`);
        } finally{
            connection.release()
        }
    }
}