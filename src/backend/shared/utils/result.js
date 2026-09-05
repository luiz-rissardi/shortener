
/*
uma pequena variação do padrão RESULT foi escolhido para a manipulação de erros de 
aplicação e exceções par evitar o uso exesivo de TryCatch, foi preferido no lugar do Either 
pois ele é mais simple e mais 'claro' em questão de namoclatura, mas ambos resolvem 
o mesmo problema.
*/
export class Result {
    isSuccess;
    statusCode;
    #error; 
    #value;

    constructor(isSuccess,error,value) {
        this.isSuccess = isSuccess;
        this.#error = error;
        this.statusCode = 200;
        this.#value = value;

    }
    
    getValue(){
        Object.freeze(this)
        if(this.isSuccess == false){
            return this.#error;
        }
        return this.#value
    }

    setStatusCode(statusCode){
        this.statusCode = statusCode;
    }

    static ok(value){
        return new Result(true,null,value);
    }

    static fail(error){
        return new Result(false,error);
    }
}