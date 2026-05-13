import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './shared/config/env.js';
import { errorHandler } from './shared/middleware/error-handler.js';
import { notFound } from './shared/middleware/not-found.js';
import { v1Router } from './v1/routes.js';

const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
const wildcardOrigins = allowedOrigins
	.filter((origin) => origin.includes('*'))
	.map((origin) => {
		const escaped = origin.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
		const pattern = `^${escaped.replace(/\*/g, '.*')}$`;
		return new RegExp(pattern);
	});

const corsOptions: cors.CorsOptions = {
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		if (wildcardOrigins.some((regex) => regex.test(origin))) return callback(null, true);
		return callback(new Error(`Not allowed by CORS: ${origin}`));
	},
	credentials: true
};

export const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api/v1', v1Router);
app.use(notFound);
app.use(errorHandler);
