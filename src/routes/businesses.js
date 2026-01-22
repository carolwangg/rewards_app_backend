import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";
import {generateIdenticon} from "../helpers/jidenticon.ts";
import { randomUUID } from "node:crypto";
import fileUpload from 'express-fileupload';
import awsS3 from '../clients/awsS3.ts';

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

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
  const id = randomUUID();
  const image = generateIdenticon(data.name);
  const file_name = `images/${data.id}/pfp-${id}`;
  const folder_name = `images/${data.id}`;
  const makeDirResult = await awsS3.makeFolder(folder_name);
  const putObjectResult = await awsS3.putObject(image, file_name);
  const image_url = putObjectResult.url;

  let db_result = await db.addBusiness(data.businessId, data.email, data.country, data.name, data.image_url, data.image_url);
  const db_userType_result = await db.addUser(data.businessId, "business", data.email);
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
 *   {"type": "String", "name": "description", "description": "Business description (max 50 chars)"}
 * ]
 */
router.post('/:id/update', async(req, res) => {
  const businessId = req.params.id;
  const data = req.body;
  const result = await db.updateBusiness(businessId, data.email, data.country, data.longitude, data.latitude, data.street_address, data.business_email, data.business_phone, data.name, data.description);
  try{
    res.status(200).json({message: "Business successfully updated", user: "success"});
    console.log("Business updated");
  }catch(err){
    res.status(400).json({message: "Business update error", user: JSON.stringify(err)});
    console.log("Business update error"+err);
  }  
});

router.post('/:id/updateImage', async(req, res) => {
  // req.body contains the parsed JSON data
  const image = req.files.image;
  const business_id = req.params.id;
  const business = await db.getBusiness(business_id);
  if (business == null){
    res.status(400).json({ message: 'Business does not exist', user: req.body });
    console.log("Business does not exist");
  }else{
    if (business.image_url) await awsS3.deleteObject(awsS3.getKeyFromUrl(business.image_url));
    const id = randomUUID();
    const file_name = `images/${business_id}/pfp-${id}`;
    const putObjectResult = await awsS3.putObject(image.data, file_name);
    const image_url = putObjectResult.url;
    const success = db.updateBusinessImage(business_id, image_url);
    console.log(success);
    res.status(200).json({ message: 'Business image updated', user: "success" });
    console.log("Business image updated");
  }
});

router.post('/:id/updateBanner', async(req, res) => {
  // req.body contains the parsed JSON data
  const image = req.files.image;
  const business_id = req.params.id;
  const business = await db.getBusiness(business_id);
  if (business == null){
    res.status(400).json({ message: 'Business does not exist', user: req.body });
    console.log("Business does not exist");
  }else{
    if (business.banner_url) await awsS3.deleteObject(awsS3.getKeyFromUrl(business.banner_url));
    const id = randomUUID();
    const file_name = `images/${business_id}/banner-${id}`;
    const putObjectResult = await awsS3.putObject(image.data, file_name);
    const image_url = putObjectResult.url;
    const success = db.updateBusinessBanner(business_id, image_url);
    console.log(success);
    res.status(200).json({ message: 'Business banner updated', user: "success" });
    console.log("Business banner updated");
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const business_id = req.params.id;
    const business = await db.getBusiness(business_id);
    if (business == null){
      res.status(400).json({message: `Business ${business_id} does not exist`, user: req.body});
      console.log(`Business ${business_id} does not exist`);
      return;
    }
    const rewards = await db.getRewardsFromBusiness(business_id);
    console.log("Rewards:"+JSON.stringify(rewards));
    for (let i = 0; i <rewards.length; i++){
      console.log("reward:"+JSON.stringify(rewards[i]))
      await db.removeReward(rewards[i].id);
      // const aws_result_2 = await awsS3.deleteObject(awsS3.getKeyFromUrl(business.banner_url));

    }
    await db.removeCard(business_id);
    const db_result = await db.removeBusiness(business_id);
    // const aws_result = await awsS3.deleteObject(awsS3.getKeyFromUrl(business.image_url));
    // const aws_result_2 = await awsS3.deleteObject(awsS3.getKeyFromUrl(business.banner_url));
    console.log(" db_result:"+db_result);
    // console.log("aws_result:"+aws_result);
    // console.log("aws_result_2:"+aws_result_2);
    res.status(200).json({message: `Business ${business_id} deleted`, user: "success"});
    console.log(`Business ${business_id} deleted`);
  } catch (err) {
    console.error("Error deleting business:"+err)
    res.status(400).json({message: `Business deletion error`, user: err.errors[0].longMessage});
  }
});
export default router;