import { Router, json, urlencoded } from 'express';
import db from "../clients/database.js";
import clerk from "../clients/clerk.js";

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
  const reward = await db.getBusinessRewards(req.params.id, req.params.reward_id);
  res.status(200).send(reward);
});

router.post('/create', async(req, res) => {
  const data = req.body;
  const db_result = db.addBusiness(data.businessId, data.email, data.name, data.country);
  const clerk_result = await clerk.setUserType("business");
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
  const result = db.updateBusiness(businessId, data.email, data.phoneNumber, data.name, data.description, data.location);
  try{
    res.status(200).json({message: "Business successfully updated", user: "success"});
    console.log("Business updated");
  }catch(err){
    res.status(400).json({message: "Business update error", user: JSON.stringify(err)});
    console.log("Business update error"+err);
  }  
});

export default router;