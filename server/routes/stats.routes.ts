import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/logs', StatsController.getActivityLogs);
router.get('/summary', StatsController.getSummary);

export default router;
