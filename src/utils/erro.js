import { StatusCodes } from "http-status-codes";

class CustomError extends Error{
    _code

    constructor(statusCode, message, code){
        super(message || statusCode);
        this.statusCode = statusCode;
        this._code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequest extends CustomError {
    constructor({code, message}){
        super(StatusCodes.BAD_REQUEST, message, code);
    }
}

export class NotFound extends CustomError {
    constructor({code, message}){
        super(StatusCodes.NOT_FOUND, message, code);
    }
}

export class InternalServer extends CustomError {
    constructor({code, message}){
        super(StatusCodes.INTERNAL_SERVER_ERROR, message, code);
    }
}

export class Brapi extends CustomError {
    constructor({statusCode, message }){
        super(statusCode, message, 'brapi');
    }
}

export class ValidadeSchema extends CustomError{
    constructor(message){
        super(StatusCodes.BAD_REQUEST, JSON.stringify(message));
    }
}