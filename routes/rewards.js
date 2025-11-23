import { Router, json, urlencoded } from 'express';
import db from "../database.js";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

// Define routes
router.get('/', (req, res) => {
  res.send('Rewards list');
});

router.get('/create', (req, res) => {
    console.log('wee')
});
router.post('/create', async(req, res) => {
  // req.body contains the parsed JSON data
  const data = req.body;
  console.log(data);
  const businesses = await db.getBusiness(data.businessId);
  if (businesses.length===0){
    res.status(404).json({ message: 'Business does not exist', user: req.body });
    console.log("Business DNE");
  }else{
    const success = db.addReward(data.businessId, data.name, data.pointCount);
    console.log(success);
    res.status(201).json({ message: 'Reward created', user: req.body });
    console.log("Rewards created");
  }
  
});

router.get('/:id', (req, res) => {
  res.send(`Product details for ID: ${req.params.id}`);
});

router.post('/update', (req, res) => {
  // req.body contains the parsed JSON data
  console.log(req.body);
  res.status(201).json({ message: 'Reward updated', user: req.body });
});

export default router;