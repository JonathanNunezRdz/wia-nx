import { Router } from 'express';
import waifuController from '../controllers/waifu';

const waifuRouter = Router();

waifuRouter.post('/', waifuController.postWaifu);
waifuRouter.delete('/:id', waifuController.deleteWaifu);
waifuRouter.get('/', waifuController.getWaifus);
waifuRouter.put('/', waifuController.updateWaifu);

export default waifuRouter;
