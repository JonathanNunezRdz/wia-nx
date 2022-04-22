import connectRedis from 'connect-redis';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import session from 'express-session';
import { createServer } from 'http';
import Redis from 'ioredis';
import routes from './app/routes';
import { COOKIE_NAME, __prod__ } from './app/utils/constants';

// TODO: remove dotenv-safe

declare module 'express-session' {
	interface SessionData {
		userId: number;
	}
}

const main = async () => {
	const app = express();

	console.log('connecting to redis');

	const RedisStore = connectRedis(session);
	const redis = new Redis(process.env.REDIS_URL);

	console.log('connected to redis');

	const allowedOrigins = [process.env.CORS_ORIGIN];

	const corsOptions: cors.CorsOptions = {
		origin: (requestOrigin, callback) => {
			if (!requestOrigin) return callback(null, true);
			if (allowedOrigins.indexOf(requestOrigin) === -1)
				return callback(
					new Error(
						'The CORS policy for this site does not allow access from the specified Origin.'
					),
					false
				);
			return callback(null, true);
		},
		credentials: true,
	};

	app.use(cors(corsOptions));
	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
				httpOnly: true,
				sameSite: 'lax', // csrf
				secure: false, // cookie only works in https when in production
				domain: __prod__ ? '.the-wia.xyz' : undefined,
			},
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET,
			resave: false,
		})
	);

	routes(app);

	app.all('*', (req, res, next) => {
		const origin = req.get('origin');
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});

	const httpServer = createServer(app);
	await new Promise<void>((resolve) => {
		httpServer.listen({ port: parseInt(process.env.PORT) }, resolve);
	});
	console.log(
		`🚀 Server ready at http://localhost:${process.env.PORT} in ${
			__prod__ ? 'production' : 'development'
		}`
	);
};

main().catch((error) => console.error(error));
