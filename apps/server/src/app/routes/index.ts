import { Application } from 'express';
import isAuth from '../middleware/isAuth';
import { BASE_URL } from '../utils/constants';
import authRouter from './auth';
import mediaRouter from './media';
import waifuRouter from './waifu';

const routes = (app: Application) => {
	app.use(`${BASE_URL}/auth`, authRouter);
	app.use(`${BASE_URL}/media`, isAuth, mediaRouter);
	app.use(`${BASE_URL}/waifu`, isAuth, waifuRouter);
};

export default routes;
