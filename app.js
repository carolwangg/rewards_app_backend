import express from 'express';
import customerRouter from './routes/customers.js';
import businessesRouter from './routes/businesses.js';
import rewardsRouter from './routes/rewards.js';
import cardsRouter from './routes/cards.js';
import cors from 'cors';

const app = express();
const port = 8080;

//ONLY FOR TESTING
app.use(cors({ origin: '*' })); // Allow all origins

// Use the routers
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});
app.use('/customers', customerRouter);
app.use('/businesses', businessesRouter);
app.use('/rewards', rewardsRouter);
app.use('/cards', cardsRouter);
app.get('/', (req, res) => {
  res.status(201).json({ message: 'Home page loaded', user: req.body });
  console.log("home");
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});