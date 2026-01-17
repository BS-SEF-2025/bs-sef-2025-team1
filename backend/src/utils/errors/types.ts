import { StatusCodes } from "http-status-codes";
import { Service } from "../../services/types";

export class ServiceError extends Error {
    constructor(service: Service, msg: string) {
        super(`error with service ${service}: ${msg}`);
    }
}

export class ServiceNotInitializedError extends ServiceError {
    constructor(service: Service) {
        super(service, 'service not initialized');
    }
}

export class HttpError extends Error {
    constructor(public readonly code: StatusCodes, public readonly message: string) {
        super(message);
    }
}