import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  res.status(200).json(await db.getCards());
});

router.get('/:id', async (req, res) => {
    //get card with given id
    const card_id = req.params.id;
    const card = await db.getCard(card_id)
    res.status(200).json({message: "Card fetched", user: card});
});

router.get('/create', (req, res) => {
  res.status(200).send('Create cards');
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "businessId", "description": "Business ID"},
 *   {"type": "String", "name": "name", "description": "Card name"}
 * ]
 */
router.post('/create', async(req, res) => {
  // req.body contains the parsed JSON data
  const data = req.body;
  const business = await db.getBusiness(data.businessId);
  if (business == null){
    res.status(400).json({ message: 'Business does not exist', user: req.body });
    console.log("Business does not exist");
  }else{
    const success = db.addCard(data.businessId, data.name);
    console.log(success); 
    res.status(201).json({ message: 'Card created', user: req.body });
    console.log("Card created");
  }
  
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "name", "description": "Card name"},
 *   {"type": "String", "name": "description", "description": "Card description"},
 *   {"type": "String", "name": "contactInfo", "description": "Card contact info"},
 *   {"type": "String", "name": "imageUrl", "description": "Card image URL"},
 *   {"type": "String", "name": "colour", "description": "Card colour"}
 * ]
 */
router.post('/:id/update', async(req, res) => {
  // req.body contains the parsed JSON data
  const cardId = req.params.id;
  const data = req.body;
  const card = await db.getCard(cardId);
  if (card == null){
    res.status(400).json({ message: 'Card does not exist', user: req.body });
    console.log("Card does not exist");
  }else{
    const success = db.updateCard(cardId, data.name, data.description, data.contactInfo, data.imageUrl, data.colour);
    console.log(success);
    res.status(200).json({ message: 'Card updated', user: "success" });
    console.log("Card updated for "+cardId);
  }
});

export default router;