import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";
import awsS3 from '../clients/awsS3.ts';
import { generateIdenticon } from "../helpers/jidenticon.ts";
import { randomUUID } from "node:crypto";
import fileUpload from 'express-fileupload';

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Define routes
router.get('/', async (req, res) => {
  const customers = await db.getCustomers();
  res.status(200).json({message: `Customer`, user: customers});
});

router.get('/:id', async (req, res) => {
  const customer = await db.getCustomer(req.params.id);
  res.status(200).json({message: `Customer ${customer}`, user: customer});
});

router.get('/:id/cards/', async(req, res) => {
  const id = req.params.id;
  const cards = await db.getCustomerCards(id);
  if (cards.length===0){
    res.status(200).json({message: `Customer ${id} cards do not exist`, user: cards});
    console.log("Cards DNE");
  }else{
    console.log(cards);
    res.status(200).json({message: `Customer ${id} cards`, user: cards});
    console.log("Cards fetched");
  }
});

router.get('/:id/cards/:card_id', async(req, res) => {
  const id = req.params.id;
  const card_id = req.params.card_id;
  const card = await db.getCustomerCard(id, card_id);
  if (card == null){
    res.status(400).json({message: `Card with id ${card_id} does not exist`, user: card});
    console.log(`Card with id ${card_id} does not exist`);
  }else{
    console.log(card);
    res.status(200).json({message: `Card with id ${card_id} from custoner ${id}`, user: card});
    console.log(`Card with id ${card_id} fetched`);
  }
});

router.get('/:id/cards/:card_id/rewards', async (req, res) => {
    //get rewards that this card can redeem
    //aka all rewards where card.points >= points needed
    const rewards = [];
    const customer_id = req.params.id;
    const card_id = req.params.card_id;
    const card = await db.getCustomerCard(customer_id, card_id);
    const business_rewards = await db.getBusinessRewards(card_id);
    for (const reward of business_rewards){
      if (reward.points <= card.points){
        rewards.push(reward);
      }
    }
    res.json({message: `Reward fetched from csutomer ${customer_id}`, user: rewards});
});

router.get('/:id/rewards', async (req, res) => {
    const rewards = [];
    //get all redeemable rewards from this customer
    const id = req.params.id;
    const cards = await db.getCustomerCards(id);
    for (const card of cards){
      const card_id = card.id;
      const business_rewards = await db.getBusinessRewards(card_id);
      for (const reward of business_rewards){
        if (reward.points <= card.points){
          rewards.push(reward);
        }
      }
    }
    res.json({message: `All rewards fetched from csutomer ${customer_id}`, user: rewards});
});


router.get('/create', (req, res) => {
  res.status(200).send('Create customers');
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "id", "description": "User's unique id"},
 *   {"type": "String", "name": "email", "description": "User's email"},
 *   {"type": "String", "name": "country", "description": "User's country two-digit code"}
 * ]
 */
router.post('/create', async(req, res) => {
  const data = req.body;
  try{
    const id = randomUUID();
    const image = generateIdenticon(data.email);
    const file_name = `images/${data.id}/pfp-${id}`;
    const folder_name = `images/${data.id}`;
    const makeDirResult = await awsS3.makeFolder(folder_name);
    const putObjectResult = await awsS3.putObject(image, file_name);
    const image_url = putObjectResult.url;

    const db_result = await db.addCustomer(data.id, data.email, data.country, image_url);
    const db_userType_result = await db.addUser(data.id, "customer", data.email);
    res.status(201).json({message: `Customer ${data.id} created`, user: "success"});
    console.log("Customer created");
    console.log("MySQL:"+db_result);
    console.log("UserType:"+db_userType_result);
  }catch(err){
    res.status(401).json({message: `Customer ${data.id} creation error`, user: err});
    console.log("Customer creation error"+err);
  }  
});
/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "email", "description": "Customer's email"},
 *   {"type": "String", "name": "country", "description": "Customer's country"},
 *   {"type": "String", "name": "name", "description": "Customer's name"},
 *   {"type": "Number", "name": "longitude", "description": "Customer's longitude"},
 *   {"type": "Number", "name": "latitude", "description": "Customer's latitude"},
 *   {"type": "String", "name": "street_address", "description": "Customer's street address"},
 * ]
 */router.get('/:id/update', async(req, res) => {
  res.status(200).json({ message: 'customer update endpoint', user: "success" });
});

router.post('/:id/update', async(req, res) => {
  const data = req.body;
  const customerId = req.params.id;
  try{
    const getCustomer = await db.getCustomer(customerId);
      if (!getCustomer){
        throw new Error("Customer does not exist");
    }
    const result = await db.updateCustomer(customerId, data.email, data.country, data.name, data.longitude, data.latitude, data.street_address);
    res.status(200).json({message: `Customer ${customerId} updated`, user: "success"});
    console.log("Customer updated");
    console.log(result);
  }catch(err){
    res.status(401).json({message: `Customer ${customerId} update error`, user: err});
    console.log("Customer update error"+err);
  }  
});

router.post('/:id/updateLocation', async(req, res) => {
  const data = req.body;
  const customerId = req.params.id;
  try{
    const getCustomer = await db.getCustomer(customerId);
      if (!getCustomer){
        throw new Error("Customer does not exist");
    }
    const result = await db.updateCustomerLocation(customerId, data.latitude, data.longitude, data.street_address);
    res.status(200).json({message: `Customer ${customerId} location updated`, user: "success"});
    console.log("Customer location updated");
    console.log(result);
  }catch(err){
    res.status(401).json({message: `Customer ${customerId} update error`, user: err});
    console.log("Customer location update error"+err);
  }  
});

router.post('/:id/updateImage', async(req, res) => {
  const image = req.files.image;
  const customer_id = req.params.id;
  const customer = await db.getCustomer(customer_id);
  if (customer == null){
    res.status(400).json({ message: 'Customer does not exist', user: req.body });
    console.log("Customer does not exist");
  }else{
    if (customer.image_url) await awsS3.deleteObject(awsS3.getKeyFromUrl(customer.image_url));
    const id = randomUUID();
    const file_name = `images/${customer_id}/pfp-${id}`;
    const putObjectResult = await awsS3.putObject(image.data, file_name);
    const image_url = putObjectResult.url;
    const success = db.updateCustomerImage(customer_id, image_url);
    console.log(success);
    res.status(200).json({ message: 'Customer image updated', user: "success" });
    console.log("Customer image updated");
  }
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "businessId", "description": "Business ID"}
 * ]
 */
router.post('/:id/cards/create', async(req, res) => {
  console.log(req);
  const data = req.body;
  console.log(data);
  const customer_id = req.params.id;
  const business_id = data.businessId;
  try{
    const result = await db.addCustomerCard(customer_id, business_id);
    res.status(200).json({ message: 'Card created', user: "success" });
    console.log("Card created: "+result);
  }catch (err){
    res.status(501).json({ message: 'Error creating card', user: req.body });
  }
});

/**
 * @apiQueryGroup [
 *   {"type": "Number", "name": "points", "description": "Points to add to the card"}
 * ]
 */
router.post('/:id/cards/:card_id/add-points', async(req, res) => {
  const customer_id = req.params.id;
  const card_id = req.params.card_id;
  const toAdd = req.body.points;
  const customerCard = await db.getCustomerCard(customer_id, card_id);
  if (customerCard == null){
    console.log("Updating customer card with points");
    db.addCustomerCard(customer_id, card_id);
  }
  //redeem
  try{
    const result = await db.updateCustomerCard(customer_id, card_id, customerCard.points + toAdd);
    res.status(200).json({ message: 'Points rewarded', user: "success" });
    console.log("Points rewarded:"+ toAdd);
    console.log(result);
  }catch (err){
    res.status(501).json({ message: 'Error rewarding points', user: req.body });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const customer_id = req.params.id;
    const customer = await db.getCustomer(customer_id);
    if (customer == null){
      res.status(400).json({message: `Customer ${customer_id} does not exist`, user: req.body});
      console.log(`Customer ${customer_id} does not exist`);
      return;
    }
    const customer_cards = await db.getCustomerCards(customer_id);
    for (const card in customer_cards){
      await db.removeCustomerCard(customer_id, card.id);
    }
    const db_result = await db.deleteCustomer(customer_id);
    const aws_result = await awsS3.deleteObject(awsS3.getKeyFromUrl(customer.image_url));
    console.log("db_result:"+db_result);
    console.log("aws_result:"+aws_result);
    res.status(200).json({message: `Customer ${customer_id} deleted`, user: "success"});
    console.log(`Customer ${customer_id} deleted`);
  } catch (err) {
    res.status(err.status).json({message: `Customer deletion error`, user: err.errors[0].longMessage});
  }
});

export default router;