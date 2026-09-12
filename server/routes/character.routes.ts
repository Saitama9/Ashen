import { Router } from 'express';
import { CharacterController } from '../controllers/character.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', CharacterController.getCharacter);
router.post('/switch-class', CharacterController.switchClass);
router.post('/unlock-class', CharacterController.unlockClass);
router.post('/rest-bonfire', CharacterController.restBonfire);

export default router;
