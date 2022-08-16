import { Request, Response, NextFunction } from "express";

export default function (req: Request, Res: Response, Next: NextFunction) {
    return Res.status(404).send(`${req.url} Not found, try /login or /breweries`)
}