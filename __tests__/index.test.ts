import app from "../src/app";
import request from 'supertest';
import jwt from 'jsonwebtoken';
import config from "../src/config";

describe('POST /login', () => {
    test('return signed JWT token on correct username/password.', async () => {
        const credentials = {
            username: 'tester',
            password: 'senhatester'
        }
        const response = await request(app).post('/login').send(credentials);
        const decodedToken = jwt.verify(response.body, config.app.jwtPrivateKey)
        expect(credentials.username).toEqual((decodedToken as jwt.JwtPayload).username)
    })
    test('Return 403 if wrong username', async () => {
        const credentials = {
            username: 'NotAtester',
            password: 'senhatester'
        }
        const response = await request(app).post('/login').send(credentials);
        expect(response.status).toEqual(403)
    })
    test('Return 403 if wrong password', async () => {
        const credentials = {
            username: 'tester',
            password: 'NotAsenhatester'
        }
        const response = await request(app).post('/login').send(credentials);
        expect(response.status).toEqual(403)
    })
    test('Return 400 if invalid body request', async () => {
        const credentials = {
            username: 'tester',
        }
        const response = await request(app).post('/login').send(credentials);
        expect(response.status).toEqual(400)
    })
})

describe('GET /breweries', () => {
    test('Return complete list if Authenticated user, no query param', async () => {
        const token = jwt.sign({
            id: '1',
            username: 'tester',
            password: 'd015a69ae87e3f0e08fa89ab541b3fd9f253327e636a42a053184071f9f5f6c8'
        }, config.app.jwtPrivateKey)
        const response = await request(app).get('/breweries').set({ Authorization: token });
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: "banjo-brewing-fayetteville",
                name: "Banjo Brewing",
            })
        ]));
    });
    test('Return query list if Authenticated user, query fat-orange-cat', async () => {
        const token = jwt.sign({
            id: '1',
            username: 'tester',
            password: 'd015a69ae87e3f0e08fa89ab541b3fd9f253327e636a42a053184071f9f5f6c8'
        }, config.app.jwtPrivateKey)
        const response = await request(app).get('/breweries?query=fat-orange-cat').set({ Authorization: token });
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: "fat-orange-cat-brew-co-east-hampton",
                name: "Fat Orange Cat Brew Co",
            })
        ]));
    });
    test('Return 401 if no token', async () => {
        const response = await request(app).get('/breweries');
        expect(response.status).toEqual(401)
    });
    test('Return 401 if invalid token', async () => {
        const token = jwt.sign({
            id: '1',
            username: 'tester',
            password: 'd015a69ae87e3f0e08fa89ab541b3fd9f253327e636a42a053184071f9f5f6c8'
        }, 'jinx')
        const response = await request(app).get('/breweries').set({ Authorization: token });
    });
    test('Return 401 if invalid user', async () => {
        const token = jwt.sign({
            id: '1',
            username: 'NotAtester',
            password: 'd015a69ae87e3f0e08fa89ab541b3fd9f253327e636a42a053184071f9f5f6c8'
        }, config.app.jwtPrivateKey);
        const response = await request(app).get('/breweries').set({ Authorization: token });
    })
})

describe('Return Not Found to other endpoints', () => {
    test('GET /brew', async () => {
        const response = await request(app).get('/brew');
        expect(response.status).toEqual(404);
    })
    test('POST /brew', async () => {
        const response = await request(app).post('/brew');
        expect(response.status).toEqual(404);
    })
})