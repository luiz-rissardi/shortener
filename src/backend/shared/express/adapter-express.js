import { request, response } from "express";



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

                if (result.isSuccess) {
                    const data = result.getValue()
                    response.status(result.statusCode).json(data)
                }else{
                    response.status(400).json({
                        error:result.error
                    });
                }

            } catch (error) {

                response.status(500).json(
                    {
                        error: {
                            message: "erro interno no servidor"
                        },
                        statusCode: 500
                    }
                )

            }
        }
    }
}