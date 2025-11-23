import { Router, json, urlencoded } from 'express';
import db from "../database.js";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  const customers = await db.getCustomers();
  res.status(201).statusMessage("All customer profiles").send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await db.getCustomer(req.params.id);
  res.status(201).statusMessage(`Customer profile for ID: ${req.params.id}`).send(customer);
});

router.get('/:id/cards/', async(req, res) => {
  const id = req.params.id;
  const cards = await db.getCardsFromCustomer(id);
    if (cards.length===0){
      res.status(400).json(JSON.stringify(cards));
      console.log("Cards DNE");
    }else{
      console.log(cards);
      res.status(201).json(JSON.stringify(cards));
      console.log("Cards fetched");
    }
});

router.get('/:id/cards/:card_id', async(req, res) => {
  const id = req.params.id;
  const card_id = req.params.card_id;
  const card = await db.getCardFromCustomer(id, card_id);
  if (card.length===0){
    res.status(400).json(JSON.stringify(cards));
    console.log(`Card with id ${card_id} does not exist`);
  }else{
    console.log(card);
    res.status(201).json(JSON.stringify(card[0]));
    console.log(`Card with id ${card_id} fetched`);
  }
});

router.get('/:id/rewards', async (req, res) => {
    const rewards = [];
    //get all redeemable rewards from this customer
    const id = req.params.id;
    const cards = await db.getCardsFromCustomer(id);
    for (const card of cards){
      const card_id = card.id;
      const business_rewards = await db.getRewardsFromBusiness(card_id);
      for (const reward of business_rewards){
        if (reward.points <= card.points){
          rewards.push(reward);
        }
      }
    }
    res.json(JSON.stringify(rewards));
});

router.get('/:id/card/:card_id/rewards', async (req, res) => {
    //get rewards that this card can redeem
    //aka all rewards where card.points >= points needed
    const customer_id = req.params.id;
    const card_id = req.params.card_id;
    // const card_points = await db.getCardFromCustomer(card_id)[0].points;
    res.json(JSON.stringify(await db.getCardFromCustomer(customer_id, card_id)));

    // const business_id = await db.getBusinessFromCard(card_id);
    // const rewards = await db.getRewardsFromBusiness(business_id);
    // const redeemable_rewards = [];
    // for(let i = 0; i < rewards.length; i++){
    //     if (rewards[i].points <= card_points){
    //         redeemable_rewards.push(rewards[i]);
    //         j++;
    //     }
    // }
    // res.json(JSON.stringify(redeemable_rewards));
});



export default router;