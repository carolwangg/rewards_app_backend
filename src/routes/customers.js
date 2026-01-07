import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

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

router.post('/create', async(req, res) => {
  const data = req.body;
  try{
    const db_result = await db.addCustomer(data.id, data.email, data.country);
    const db_userType_result = await db.addUser(data.id, "customer");
    res.status(201).json({message: `Customer ${data.id} created`, user: "success"});
    console.log("Customer created");
    console.log("MySQL:"+db_result);
    console.log("UserType:"+db_userType_result);
  }catch(err){
    res.status(401).json({message: `Customer ${data.id} creation error`, user: err});
    console.log("Customer creation error"+err);
  }  
});

router.get('/:id/update', async(req, res) => {
  res.status(200).json({ message: 'customer update endpoint', user: "success" });
});

router.post('/:id/update', async(req, res) => {
  console.log("updating customer")
  const data = req.body;
  const customerId = req.params.id;
  try{
    const result = await db.updateCustomer(customerId, data.email, data.country, data.name, data.longitude, data.latitude, data.street_address, data.image_url);
    res.status(200).json({message: `Customer ${customerId} updated`, user: "success"});
    console.log("Customer updated");
    console.log(result);
  }catch(err){
    res.status(401).json({message: `Customer ${customerId} update error`, user: err});
    console.log("Customer update error"+err);
  }  
});

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

router.post('/:id/cards/:card_id/add-points', async(req, res) => {
  const data = req.body;
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

export default router;