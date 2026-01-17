import { ErrorRequestHandler, Request, Response } from "express";
import logger from "./logger.js";
import { StatusCodes } from "http-status-codes";
import { EntityNotFoundError, ValidationError } from "./errors/types.js";

const getErrorHttpCode = (error: unknown) => {
    let code = StatusCodes.INTERNAL_SERVER_ERROR;
    
    if (error instanceof ValidationError) {
        code = StatusCodes.UNPROCESSABLE_ENTITY;
    } else if (error instanceof EntityNotFoundError) {
        code = StatusCodes.NOT_FOUND;
    }

    return code;
}

export const errorMiddleware: ErrorRequestHandler = (err: unknown, req: Request, res: Response) => {
    const error = err as Error;
    
    logger.error(error.message, {req});

    res.status(getErrorHttpCode(err)).json({message: error.message });
}