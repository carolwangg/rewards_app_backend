import { Router, json, urlencoded } from 'express';
import db from "../clients/database.ts";
import awsS3 from '../clients/awsS3.ts';
import fileUpload from 'express-fileupload';
import { randomUUID } from "node:crypto";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Define routes
router.get('/', async (req, res) => {
  const data = req.body;
  if (data.latitude && data.longitude && data.radius){
    const rewards = await db.getRewardsInRadius(data.latitude, data.longitude, data.radius);
    res.status(200).json({ message: `Rewards in radius ${data.radius} from location (${data.latitude}, ${data.longitude}) fetched`, user: rewards });
    return;
  }
  const rewards = await db.getRewards();
  res.status(200).json({ message: 'Rewards fetched', user: rewards });
});

router.get('/:id', async(req, res) => {
  const reward_id = req.params.id;
  const reward = await db.getReward(reward_id)
  if (reward!==null){
    res.status(200).json({message: "Reward fetched", user: reward});
  }else{
    res.status(404).json({message: "Reward not found", user: reward_id});
  }
});

router.get('/create', (req, res) => {
  res.send('Create reward');
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "business_id", "description": "Business ID"},
 *   {"type": "String", "name": "name", "description": "Reward name"},
 *   {"type": "String", "name": "description", "description": "Reward description"},
 *   {"type": "Number", "name": "points", "description": "Points required for the reward"}
 * ]
 */
router.post('/create', async(req, res) => {
  // req.body contains the parsed JSON data
  const data = req.body;
  const image = req.files.image;
  const business = await db.getBusiness(data.business_id);
  if (business == null){
    res.status(400).json({ message: 'Business does not exist', user: req.body });
    console.log("Business does not exist");
  }else{
    const id = randomUUID();
    const file_name = `images/${data.business_id}/reward-${id}`;
    const putObjectResult = await awsS3.putObject(image.data, file_name);
    const image_url = putObjectResult.url;
    console.log("image url:" + image_url)
    const success = await db.addReward(id, data.name, data.description, image_url, data.points, data.business_id);
    console.log(success);
    res.status(201).json({ message: 'Reward created', user: req.body });
    console.log("Reward created");
  }
  
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "business_id", "description": "Business ID"},
 *   {"type": "String", "name": "reward_id", "description": "Reward ID"},
 *   {"type": "String", "name": "name", "description": "Reward name"},
 *   {"type": "String", "name": "description", "description": "Reward description"},
 *   {"type": "Number", "name": "points", "description": "Points required for the reward"}
 * ]
 */
router.post('/update', async(req, res) => {
  // req.body contains the parsed JSON data
  const data = req.body;
  const reward = await db.getReward(data.reward_id);
  if (reward == null){
    res.status(400).json({ message: 'Reward does not exist', user: req.body });
    console.log("Reward does not exist");
  }else{
    const success = db.updateReward(data.reward_id, data.name, data.description, data.points);
    console.log(success);
    res.status(200).json({ message: 'Reward updated', user: "success" });
    console.log("Reward updated");
  }
});


router.post('/:id/updateImage', async(req, res) => {
  try{
    const image = req.files.image;
    const reward_id = req.params.id;
    const reward = await db.getReward(reward_id);
    if (reward == null){
      res.status(400).json({ message: 'Reward does not exist', user: req.body });
      console.log("Reward does not exist");
    }else{
      if (reward.image_url) await awsS3.deleteObject(awsS3.getKeyFromUrl(reward.image_url));
      const id = randomUUID();
      const file_name = `images/${reward_id}/reward-${id}`;
      const putObjectResult = await awsS3.putObject(image.data, file_name);
      const image_url = putObjectResult.url;
      const success = db.updateRewardImage(reward_id, image_url);
      console.log(success);
      res.status(200).json({ message: 'Reward image updated', user: "success" });
      console.log("Reward image updated");
    }
  }catch(err){
    console.error(err);
    res.status(400).json({ message: 'Card image not updated', user: req.body })
  }
});

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "customerId", "description": "Customer ID"},
 *   {"type": "String", "name": "cardId", "description": "Card ID"},
 *   {"type": "String", "name": "rewardId", "description": "Reward ID"}
 * ]
 */
router.post('/redeem', async(req, res) => {
  // req.body contains the parsed JSON data
  const data = req.body;
  const customerCard = await db.getCustomerCard(data.customerId, data.cardId);
  const reward = await db.getReward(data.rewardId);
  if (reward == null){
    res.status(400).json({ message: 'Reward does not exist', user: req.body });
    console.log("Reward does not exist");
  }else if (customerCard == null){
    res.status(400).json({ message: 'Customer card does not exist', user: req.body });
    console.log("Customer card does not exist");
  }else{
    if (customerCard.points >= reward.points) {
      //redeem
      try{
        db.updateCustomerCard(data.customerId, data.cardId, customerCard.points - reward.points);
        res.status(200).json({ message: 'Reward redeemed', user: "success" });
        console.log("Reward redeemed"); 
      }catch (err){
        res.status(501).json({ message: 'Error redeeming reward', user: req.body });
        console.log("error redeeming reward"); 
      }
    }else{
      res.status(501).json({ message: 'Error redeeming reward', user: req.body });
        console.log("error redeeming reward - not enough points"); 
    }
  }

  /**
 * @apiQueryGroup [
 *   {"type": "String", "name": "reward_id", "description": "Reward ID"}
 * ]
 */
  router.delete('/:id', async(req, res) => {
    // req.body contains the parsed JSON data
    const reward = await db.getReward(req.params.id);
    if (reward == null){
      res.status(400).json({ message: 'Reward does not exist', user: req.body });
      console.log("Reward does not exist");
    }else{
      const dbResult = db.deleteReward(req.params.id);
      const awsResult = await awsS3.deleteObject(awsS3.getKeyFromUrl(reward.image_url));
      console.log("dbResult:" + dbResult);
      console.log("awsResult:" + awsResult);
      res.status(200).json({ message: 'Reward deleted', user: "success" });
      console.log("Reward deleted");
    }
  });
});

export default router;