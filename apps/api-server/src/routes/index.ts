import { Router, type IRouter } from 'express';
import healthRouter from './health';
import reservationsRouter from './reservations';
import giftCardsRouter from './gift-cards';
import contactRouter from './contact';

const router: IRouter = Router();

router.use(healthRouter);
router.use(reservationsRouter);
router.use(giftCardsRouter);
router.use(contactRouter);

export default router;
