import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', InventoryController.getInventory);
router.post('/buy', InventoryController.buyItem);
router.post('/equip', InventoryController.equipItem);

export default router;
