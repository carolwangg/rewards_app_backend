import { Router, json, urlencoded } from 'express';
import db from "../clients/database.js";
import awsS3 from '../clients/aws-s3.js';
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
  const rewards = await db.getRewards();
  res.status(200).json({ message: 'Reward fetched', user: rewards });
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
    const file_name = `images/reward-${id}`;
    const putObjectResult = await awsS3.putObject(image.data, file_name);
    const image_url = putObjectResult.url;
    console.log("image url:" + image_url)
    const success = await db.addReward(id, data.name, data.description, image_url, data.points, data.business_id);
    console.log(success);
    res.status(201).json({ message: 'Reward created', user: req.body });
    console.log("Reward created");
  }
  
});

router.post('/update', async(req, res) => {
  // req.body contains the parsed JSON data
  const data = req.body;
  const image = req.files.image;
  const reward = await db.getReward(data.reward_id);
  if (reward == null){
    res.status(400).json({ message: 'Reward does not exist', user: req.body });
    console.log("Reward does not exist");
  }else{
    const id = randomUUID();
    const file_name = `images/reward-${id}`;
    const putObjectResult = await awsS3.putObject(image.data, file_name);
    const image_url = putObjectResult.url;
    const success = db.updateReward(data.reward_id, data.name, data.description, image_url, data.points);
    console.log(success);
    res.status(200).json({ message: 'Reward updated', user: "success" });
    console.log("Reward updated");
  }
});

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
});

export default router;