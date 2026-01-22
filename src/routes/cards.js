import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";
import fileUpload from 'express-fileupload';
import { randomUUID } from "node:crypto";
import awsS3 from '../clients/awsS3.ts';

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

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
    const success = db.updateCard(cardId, data.name, data.description, data.contactInfo, data.colour, data.textColour);
    console.log(success);
    res.status(200).json({ message: 'Card updated', user: "success" });
    console.log("Card updated for "+cardId);
  }
});


router.post('/:id/updateImage', async(req, res) => {
  try{
    const image = req.files.image;
    const card_id = req.params.id;
    const card = await db.getCard(card_id);
    if (card == null){
      res.status(400).json({ message: 'Card does not exist', user: req.body });
      console.log("Card does not exist");
    }else{
      if (card.image_url) await awsS3.deleteObject(awsS3.getKeyFromUrl(card.image_url));
      const id = randomUUID();
      const file_name = `images/${card_id}/logo-${id}`;
      const putObjectResult = await awsS3.putObject(image.data, file_name);
      const image_url = putObjectResult.url;
      const success = db.updateCardImage(card_id, image_url);
      console.log(success);
      res.status(200).json({ message: 'Card image updated', user: "success" });
      console.log("Card image updated");
    }
  }catch(err){
    console.error(err);
    res.status(400).json({ message: 'Card image not updated', user: req.body })
  }
});

export default router;