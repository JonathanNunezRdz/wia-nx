import { NextFunction, Request, Response } from 'express';
import { Error } from '../utils/types/commonTypes';

const isAuth = async (
	req: Request,
	res: Response<Error>,
	next: NextFunction
) => {
	if (req.session.userId) {
		next();
	} else {
		res.status(401).send({ field: 'auth', message: 'Not authenticated' });
	}
};

export default isAuth;
