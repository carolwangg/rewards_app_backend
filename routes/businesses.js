import { Router, json, urlencoded } from 'express';
import db from "../database.js";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  const businesses = await db.getBusinesses();
  res.status(201).statusMessage("All business profiles").send(businesses);
});

router.get('/:id', async (req, res) => {
  const business = await db.getBusiness(req.params.id);
  res.status(201).statusMessage(`Business profile for ID: ${req.params.id}`).send(business);
});

export default router;