

export class UnexpectedError {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
        this.name = "UnexpectedError"
    }

    static create(errorMessage) {
        return new UnexpectedError(errorMessage);
    }
}

export class InternalServerError {
    constructor() {
        this.errorMessage = "internal server error"
        this.errorMessage = "InternalServerError"
    }

    static create() {
        return new InternalServerError()
    }
}

// infra error
export class ConnectioDataBaseError {
    constructor() {
        this.errorMessage = "Um erro de Conexão com banco de dados ocorreu";
        this.name = "ConnectioDataBaseError";
    }

    static create() {
        return new ConnectioDataBaseError();
    }
}

export class RepositoryOperationError {
    constructor() {
        this.errorMessage = `Um erro ocorreu ao realizar a operação`;
        this.name = "RepositoryOperationError";
    }

    static create() {
        return new RepositoryOperationError();
    }
}