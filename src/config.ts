const env = process.env.NODE_ENV || 'dev';
const dev: Config = {
    app: {
        port: process.env.PORT || 3000,
        jwtPrivateKey: process.env.ACCESS_TOKEN_KEY as string
    },
}

const test: Config = {
    app: {
        port: process.env.PORT || 3000,
        jwtPrivateKey: process.env.ACCESS_TOKEN_KEY as string
    },
}

const prod: Config = {
    app: {
        port: process.env.PORT || 8000,
        jwtPrivateKey: process.env.ACCESS_TOKEN_KEY as string
    },
}

const config: { [key: string]: Config } = {
    dev,
    test,
    prod
}

interface Config {
    app: {
        port: string | number,
        jwtPrivateKey: string
    }
}

export default config[env]

// Prisma database url must set in the environment as
// DATABASE_URL="mysql://{user}:{password}@{URL}:{PORT}/{Database_Name}"