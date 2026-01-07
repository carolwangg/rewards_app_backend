import express from 'express';
import customerRouter from './routes/customers.js';
import businessesRouter from './routes/businesses.js';
import rewardsRouter from './routes/rewards.js';
import cardsRouter from './routes/cards.js';
import userRouter from './routes/users.js';
import cors from 'cors';

export const app = express();
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
app.use('/users', userRouter);
app.get('/', (req, res) => {
  res.status(201).json({ message: 'Server Up', user: req.body });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

