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

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "businessId", "description": "User's unique id"},
 *   {"type": "String", "name": "email", "description": "User's email"},
 *   {"type": "String", "name": "country", "description": "User's country two-digit code"},
 *   {"type": "String", "name": "name", "description": "User full name"}
 * ]
 */
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

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "businessId", "description": "User's unique id"},
 *   {"type": "String", "name": "email", "description": "User's email"},
 *   {"type": "String", "name": "country", "description": "User's country two-digit code"},
 *   {"type": "Number", "name": "longitude", "description": "User's location longitude"},
 *   {"type": "Number", "name": "latitude", "description": "User's location latitude"},
 *   {"type": "String", "name": "street_address", "description": "User's location street_address"},
 *   {"type": "String", "name": "business_email", "description": "Business' email (displayed to customers, not used for sign-in)"},
 *   {"type": "String", "name": "business_phone", "description": "Business' phone number (displayed to customers, not used for sign-in)"},
 *   {"type": "String", "name": "name", "description": "Business name (max 30 chars)"},
 *   {"type": "String", "name": "description", "description": "Business description (max 50 chars)"},
 *   {"type": "String", "name": "image_url", "description": "Logo url"},
 *   {"type": "String", "name": "banner_url", "description": "Background banner url"}
 * ]
 */
router.post('/:id/update', async(req, res) => {
  const businessId = req.params.id;
  const data = req.body;
  const result = await db.updateBusiness(data.id, data.email, data.country, data.longitude, data.latitude, data.street_address, data.business_email, data.business_phone, data.name, data.description, data.image_url, data.banner_url);

  try{
    res.status(200).json({message: "Business successfully updated", user: "success"});
    console.log("Business updated");
  }catch(err){
    res.status(400).json({message: "Business update error", user: JSON.stringify(err)});
    console.log("Business update error"+err);
  }  
});
export default router;