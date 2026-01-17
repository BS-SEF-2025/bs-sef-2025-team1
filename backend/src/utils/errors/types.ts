import { Service } from "../../services/types.js";

export class ValidationError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class EntityNotFoundError extends Error {
    constructor(id: string) {
        super(`entity with id '${id}' not found`);
    }
}

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