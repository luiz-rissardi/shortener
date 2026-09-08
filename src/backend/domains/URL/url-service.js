import { UrlModel } from "./url-model.js";
import { UrlRepository } from "./url-repository.js";
import { UrlCacheRepository } from "./cache/url-cacheRepository.js";
import { Result } from "../../shared/utils/result.js";
import { UnexpectedError, UrlNotFound } from "../../shared/AppExceptions/appErrors.js";
import { SequenceException, UrlInvalidException } from "../../shared/AppExceptions/domainError.js";


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
        let connection = null;

        try {

            //antes de iniciar transação varifica se a targetUrl é valida
            if (UrlModel.isValid(targetUrl) == false) {
                return Result.fail(UrlInvalidException.create())
            }

            const sequenceId = await this.#urlCacheRepository.getNextSequenceId();
            const model = new UrlModel(targetUrl, sequenceId);

            connection = await this.#urlRepository.getConnection();
            await connection.beginTransaction();
            // inserir no banco o modelo de dados
            const wasCreated = await this.#urlRepository.insertOne(model, connection);
            // esse caso é para quando ele vai inserir e já existe um registro com aquele shortCode
            // apenas 1 vez
            if (!wasCreated) {
                const newSequenceId = await this.#urlRepository.findLastedSequenceId(connection) + 1;
                model.changeShortCode(newSequenceId);
                this.#urlCacheRepository.setCounter(newSequenceId)
                const test = await this.#urlRepository.insertOne(model, connection);
                if (!test) {
                    await connection.rollback();
                    return Result.fail(SequenceException.create())
                }
            }

            await connection.commit();
            return Result.ok({ shortCode: model.shortCode });
        } catch (error) {
            console.log(error);
            await connection.rollback();
            return Result.fail(UnexpectedError.create(`Erro ao encurtar URL`));
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    // um detalhe importante, caso ocorrer qualquer erro de atualização do contador da url,
    // caso a url existir deve retornar ela mesmo assim, 
    // pois para esse app, encurtar e redirecionar a url é mais importante
    async getTargetUrl(shortCode) {
        let connection = null;

        try {
            connection = await this.#urlRepository.getConnection();

            // verificar se existe no cache, se não vai para o banco de dados, depois seta o cache
            const cache = await this.#urlCacheRepository.getCachedUrl(shortCode);
            if (cache) {
                this.#addViewInUrl(shortCode, connection);
                return Result.ok({ targetUrl: cache })
            }

            const data = await this.#urlRepository.getOne(shortCode, connection);
            this.#urlCacheRepository.cacheUrl(shortCode, data[0].targetUrl)

            // se data for tamanho 0 significa que não pegou nenhum registro, portanto ele não existe
            if (data.length == 0) {
                return Result.fail(UrlNotFound.create())
            }

            this.#addViewInUrl(shortCode);
            // retorna o objeto UrlModel
            return Result.ok(data[0])

        } catch (error) {
            return Result.fail(UnexpectedError.create(`não foi possível pegar url, tente novamente mais tarde`));
        } finally {
            if (connection) {
                connection.release()
            }
        }
    }

    async getAllUrls() {

        let connection;

        try {
            connection = await this.#urlRepository.getConnection();
            const result = await this.#urlRepository.getAll(connection);
            return Result.ok(result);

        } catch (error) {
            return Result.fail(UnexpectedError.create(`não foi possível pegar url, tente novamente mais tarde`));
        } finally {
            connection.release()
        }
    }

    async deleteTargetUrl(shortCode) {
        let connection;

        try {
            connection = await this.#urlRepository.getConnection();
            const result = await this.#urlRepository.deleteOne(shortCode, connection);
            await this.#urlCacheRepository.deleteCacheUrl(shortCode);
            return result;

        } catch (error) {
            return Result.fail(UnexpectedError.create(`não foi possível deletar a url, tente novamente mais tarde`));
        } finally {
            connection.release()
        }
    }

    async #addViewInUrl(shortCode, connection) {

        try {
            await this.#urlRepository.putOne(shortCode, connection);

        } catch (error) {
            console.log("não foi possivel atualizar contador da url");
        }
    }
}