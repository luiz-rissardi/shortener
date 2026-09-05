

export class SequenceException{
    constructor(){
        this.message = "erro para gerar a url encurtada com sequencia numérica";
        this.name = "SequenceException";
    }

    static create(){
        return new SequenceException()
    }
}

export class UrlInvalidException{
    constructor(){
        this.message = "url inválida não pode ser gerada";
        this.name = "UrlInvalidException";
    }

    static create(){
        return new UrlInvalidException()
    }
}