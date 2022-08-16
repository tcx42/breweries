import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";
export function apiErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ApiError) {
        return res.status(error.code).json(error.message);
    }
    console.log(error)
    return res.status(500).json('Internal server error.');
}