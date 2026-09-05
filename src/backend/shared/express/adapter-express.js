import { InternalServerError } from "../AppExceptions/appErrors.js";



export class ExpressAdapter {

    /**
     * 
     * @param {Function} action 
     */
    static adapt(action) {
        return async (request, response) => {
            try {
                const { params, body, query } = request;

                // passa params, query, e body com operadores spread como se fosse um "DTO"
                // (não é essencialmente um DTO mas se comporta como um objeto para transferencia de dados)
                const result = await action({ ...params, ...query, ...body });
                
                // se deu erro o Result pattern vai retornar o erro ao inves de "dados de sucesso"
                const data = result.getValue()
                response.status(result.statusCode).json(data)

            } catch (error) {
                response.status(500).json(
                    InternalServerError.create()
                )

            }
        }
    }
}