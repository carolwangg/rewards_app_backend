import { Router, json, urlencoded } from 'express';
import db from "../clients/database.js";

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