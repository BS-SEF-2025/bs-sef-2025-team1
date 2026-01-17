import { StatusCodes } from "http-status-codes";
import { HttpError } from "./types.js";

export class ClientError extends HttpError {
    constructor(message: string, code: StatusCodes = StatusCodes.BAD_REQUEST) {
        super(code, message);
    }
}

export class ValidationError extends ClientError {
    constructor(msg: string) {
        super(msg, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

export class NotFoundError extends ClientError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export class EntityNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`entity with id '${id}' not found`);
    }
}