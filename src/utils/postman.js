  import { generateCollection } from 'express-to-postman'
  await generateCollection('../app.js', './api.postman.json', true)