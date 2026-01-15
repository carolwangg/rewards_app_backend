import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";
import clerk from '../clients/clerk.ts';

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  const users = await db.getUsers();
  res.status(200).json({message: `Users`, user: users});
});

router.get('/:id', async (req, res) => {
  const user = await db.getUserType(req.params.id);
  res.status(200).json({message: `User ${user} type`, user: user});
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await clerk.deleteUser(userId);
        res.status(200).json({message: `User ${userId} deleted`, user: result});
        console.log(`User ${userId} deleted`);
        console.log(result);
    } catch (err) {
        res.status(err.status).json({message: `User deletion error`, user: err.errors[0].longMessage});
    }
});

export default router;