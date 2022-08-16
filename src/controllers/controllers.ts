import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma";
import { ApiError } from "../errors/ApiError";
import { createHash } from "crypto";
import jwt from 'jsonwebtoken';
import config from "../config";
const axios = require('axios').default;

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await prisma.user.findFirst({ where: { username: req.body.username } });
        if (user == null) throw new ApiError(403, `Invalid username: ${req.body.username}.`);
        const password = createHash('sha256').update(req.body.password).digest('hex')
        if (user.password != password) throw new ApiError(403, 'Invalid password')
        jwt.sign(user, config.app.jwtPrivateKey, (error: object | null, token: string | undefined) => {
            if (error) next(new ApiError(500, 'token sign failure'));
            return res.json(token);
        });
    } catch (error) {
        next(error)
    }
}

export async function breweries(req: Request, res: Response, next: NextFunction) {
    try {
        let url = 'https://api.openbrewerydb.org/breweries';
        if (req.query['query']) {
            url = url.concat(`/search?query=${req.query['query']}`);
        }
        const response = await axios.get(url);
        return res.send(response.data)
    } catch (error) {
        next(error);
    }
}