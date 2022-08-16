import express from "express";
import morgan from "morgan";
import { login, breweries } from './controllers/controllers'
import { apiErrorHandler } from "./errors/ApiErrorHandler";
import { validateDto, loginReqBodySchema } from "./middleware/dto";
import { validateToken } from "./middleware/validateToken";
import notFound from "./notFound/notFound";
import fs from 'fs';

const app = express();
const route = express.Router();

const log = fs.createWriteStream('./log.log', { flags: 'a' });
app.use(morgan('combined', { stream: log }));
app.use(express.json());

route.post('/login', validateDto(loginReqBodySchema), login);
route.get('/breweries', validateToken(), breweries);

app.use(route);
app.use(notFound);
app.use(apiErrorHandler);

export default app;