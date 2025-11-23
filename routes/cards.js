import { Router, json, urlencoded } from 'express';
import db from "../database.js";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  res.status(201).statusMessage("Cards list fetched").json(JSON.stringify(await db.getCards()));
});

router.get('/:id', async (req, res) => {
    //get card with given id
    const card_id = req.params.id;
    res.json(JSON.stringify(await db.getCard(card_id)));
});

router.get('/:id', async (req, res) => {
    //get all cards rewards from this customer
    const customer_id = req.params.id;
    res.json(JSON.stringify(await db.getCardsFromCustomer(customer_id)));
});

export default router;