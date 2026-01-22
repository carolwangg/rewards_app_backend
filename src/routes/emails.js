import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  const users = await db.getUsers();
  res.status(200).json({message: `Emails`, user: users});
});

router.get('/:email', async (req, res) => {
  const email = req.params.email
  const user = await db.getUserTypeEmail(email);
  res.status(200).json({message: `Email ${email} type`, user: user});
});

export default router;