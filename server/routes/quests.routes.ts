import { Router } from 'express';
import { QuestsController } from '../controllers/quests.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', QuestsController.getQuests);
router.post('/', QuestsController.createQuest);
router.put('/:id', QuestsController.updateQuest);
router.patch('/:id/toggle', QuestsController.toggleQuest);
router.delete('/:id', QuestsController.deleteQuest);

export default router;
