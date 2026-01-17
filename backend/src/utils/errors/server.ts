import { StatusCodes } from "http-status-codes";
import { HttpError } from "./types";

export class ServerError extends HttpError {
    constructor(message: string, code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(code, message);
    }
}