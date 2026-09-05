

export class UnexpectedError {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
        this.errorName = "UnexpectedError"
    }

    static create(errorMessage) {
        return new UnexpectedError(errorMessage);
    }
}

export class InternalServerError {
    constructor() {
        this.errorMessage = "internal server error"
        this.errorName = "InternalServerError"
    }

    static create() {
        return new InternalServerError()
    }
}

export class RepositoryOperationError {
    constructor() {
        this.errorMessage = `Um erro ocorreu ao realizar a operação`;
        this.errorName = "RepositoryOperationError";
    }

    static create() {
        return new RepositoryOperationError();
    }
}

export class UrlNotFound {
    constructor() {
        this.errorMessage = `url não encontrada`;
        this.errorName = "UrlNotFound";
    }

    static create() {
        return new UrlNotFound();
    }
}