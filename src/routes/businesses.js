import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', async (req, res) => {
  const businesses = await db.getBusinesses();
  res.status(200).send(businesses);
});

router.get('/:id', async (req, res) => {
  const business = await db.getBusiness(req.params.id);
  res.status(200).send({user: business});
});

router.get('/:id/rewards', async (req, res) => {
  const rewards = await db.getBusinessRewards(req.params.id);
  res.status(200).json({message: "Rewards fetched for business", user: rewards});
  console.log("Business rewards fetched from business/:id/rewards")
});

router.get('/:id/rewards/:reward_id', async (req, res) => {
  const reward = await db.getBusinessReward(req.params.id, req.params.reward_id);
  res.status(200).send(reward);
});

router.post('/create', async(req, res) => {
  const data = req.body;
  let db_result = await db.addBusiness(data.businessId, data.email, data.country, data.name);
  const db_userType_result = await db.addUser(data.businessId, "business");
  console.log("Business created");
  console.log("MySQL:"+db_result);
  console.log("UserType:"+db_userType_result);
  try{
    res.status(201).json({message: "Business successfully created", user: "success"});
    console.log("Business created");
  }catch(err){
    res.status(400).json({message: "Business creation error", user: JSON.stringify(err)});
    console.log("Business creation error"+err);
  }  
});

router.post('/:id/update', async(req, res) => {
  const businessId = req.params.id;
  const data = req.body;
  const result = await db.updateBusiness(data.id, data.email, data.country, data.longitude, data.latitude, data.street_address, data.business_email, data.business_phone, data.name, data.description, data.image_url, data.banner_url, data.rating);

  try{
    res.status(200).json({message: "Business successfully updated", user: "success"});
    console.log("Business updated");
  }catch(err){
    res.status(400).json({message: "Business update error", user: JSON.stringify(err)});
    console.log("Business update error"+err);
  }  
});

export default router;