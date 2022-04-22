import { Router } from 'express';
import mediaController from '../controllers/media';

const mediaRouter = Router();

mediaRouter.post('/', mediaController.postMedia);
mediaRouter.get('/', mediaController.getMedias);
mediaRouter.put('/', mediaController.updateMedia);

export default mediaRouter;
