/* eslint-disable max-classes-per-file */
class CustomError extends Error {
    private _: string;
    public i18n?: string;
    public details: CustomError[] | null | undefined;

    constructor(
        code: string,
        message: string | null = null,
        details: CustomError[] | null = null,
        i18n?: string,
    ) {
        super(message || code);
        this._ = code;
        this.details = details;
        this.i18n = i18n;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidProperties extends CustomError {
    constructor(message: string, details: unknown) {
        super("INVALID_PROPERTIES", message, details as CustomError[]);
    }
}

export class InternalServer extends CustomError {
    constructor(message: string, details: null | any[] = null) {
        super("INTERNAL_SERVER_ERROR", message, details);
    }
}

export class BadRequest extends CustomError {
    constructor(message: string, details: null | any[] = null) {
        super("BAD_REQUEST", message, details);
    }
}

export class NotFound extends CustomError {
    constructor(message: string, details: null | any[] = null) {
        super("NOT_FOUND_ERROR", message, details);
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