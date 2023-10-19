/* eslint-disable max-classes-per-file  */
/* eslint-disable @typescript-eslint/no-explicit-any  */
class CustomError extends Error {
    private _: string;
    public i18n: string | null | undefined;
    public details: CustomError[] | null | undefined;

    constructor(
        code: string,
        message: string | null = null,
        details: CustomError[] | null = null,
        i18n: string | null = null,
    ) {
        super(message || code);
        this._ = code;
        this.details = details;
        this.i18n = i18n;
        Error.captureStackTrace(this, this.constructor);
    }
}

export interface ErrorParams {
    code: string
    message: string
}

export class InvalidProperties extends CustomError {
    constructor(message: string, details: unknown) {
        super("INVALID_PROPERTIES", message, details as CustomError[]);
    }
}

export class InternalServer extends CustomError {
    constructor(message: string, details: null | any[] = null) {
        super("INTERNAL_SERVER", message, details);
    }
}

export class BadRequest extends CustomError {
    constructor({message, code}: Partial<ErrorParams>, details: null | any[] = null) {
        super("BAD_REQUEST", message, details, code);
    }
}

export class NotFound extends CustomError {
    constructor(message: string, details: null | any[] = null) {
        super("NOT_FOUND", message, details);
    }
}

export class FailedSQL extends CustomError {
    constructor(msg: string, details: null | any[] = null, i18n?: string) {
        super("FAILED_SQL", msg, details, i18n);
    }
}

export class AlreadyExists extends CustomError {
    constructor(msg: string) {
        super("ALREADY_EXISTS", msg);
    }
}

export class OutOfCuttingTime extends CustomError {
    constructor(msg: string) {
        super("OUT_OF_CUTTING_TIME", msg);
    }
}

export class ServiceUnavailable extends CustomError {
    constructor(i18n: string) {
        super("SERVICE_UNAVAILABLE", null, null, i18n);
    }
}

export class Brapi extends CustomError {
    constructor(msg: string){
        super("BRAPI_API", msg);
    }
}