/**
 * Test suite for database client functions using Jest.
 * @author carolwangg
 * @version 1.0.0
 */
const db = require('clients/database.ts').default;

const user_0 = {
  id: 'user_0',
  name: 'Test User',
  email: 'test@example.com',
  latitude: 0,
  longitude: 0,
  country: 'CA',
  street_address: '123 Test St',
  image_url: 'http://example.com/image.jpg'
}

const user_1 = {
  id: 'user_1',
  name: 'Test Business',
  email: 'test@example.com',
  latitude: 0,
  longitude: 0,
  country: 'ES',
  street_address: '123 Test St',
  business_email: 'business@example.com',
  business_phone: '1234567890',
  image_url: 'http://example.com/image.jpg',
  banner_url: 'http://example.com/banner.jpg'
}

const card_1 = {
  id: 'user_1',
  name: 'Test Card',
  description: 'Test Description',
  contact_info: 'Test Contact Info',
  image_url: 'http://example.com/card.jpg',
  colour: 'ff0000',
}

const card_0 = {
  customer_id: 'user_0',
  card_id: 'user_1',
  points: 0
}

const reward_1 = {
  id: '1',
  name: 'Test Reward',
  description: 'Test Description',
  image_url: 'http://example.com/reward.jpg',
  points: 100,
  business_id: 'user_1'
}

test('getUsers empty', async() => {
  const users = await db.getUsers();
  expect(users.length).toBe(0);
});

test('getCustomers empty', async() => {
  const customers = await db.getCustomers();
  expect(customers.length).toBe(0);
});

test('getBusinesses empty', async() => {
  const businesses = await db.getBusinesses();
  expect(businesses.length).toBe(0);
});

test('getCards empty', async() => {
  const cards = await db.getCards();
  expect(cards.length).toBe(0);
});

test('getRewards empty', async() => {
  const rewards = await db.getRewards();
  expect(rewards.length).toBe(0);
});

test('addUser user_0 (customer)', async() => {
  await expect(db.addUser(user_0.id, 'customer')).resolves.toBeDefined();
});

test('getUserType user_0 to be customer', async() => {
  await expect(db.getUserType(user_0.id)).resolves.toBe('customer');
});

test('removeUser user_0', async() => {
  await expect(db.removeUser(user_0.id)).resolves.toBeDefined();
});

test('getUserType user_0 (none existing) return null', async() => {
  await expect(db.getUserType(user_0.id)).resolves.toBe(null);
});

test('addCustomer user_0', async() => {
  await expect(db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.image_url)).resolves.toBeDefined();
});

test('getCustomer user_0', async() => {
  const customer = await db.getCustomer('user_0');
  expect(customer.id).toBe(user_0.id);
  expect(customer.email).toBe(user_0.email);
  expect(customer.country).toBe(user_0.country);
});

test('updateCustomer user_0', async() => {
  const customer = await db.updateCustomer(user_0.id, user_0.email, user_0.country, user_0.name, user_0.latitude, user_0.longitude, user_0.street_address, user_0.image_url);
  expect(customer).toBeDefined();
});

test('getCustomer user_0 (updated with name, latitude, longitude)', async() => {
  const customer = await db.getCustomer(user_0.id);
  expect(customer.id).toBe(user_0.id);
  expect(customer.email).toBe(user_0.email);
  expect(customer.country).toBe(user_0.country);
  expect(customer.name).toBe(user_0.name);
  expect(Number(customer.latitude)).toBeCloseTo(user_0.latitude);
  expect(Number(customer.longitude)).toBeCloseTo(user_0.longitude);
  expect(customer.street_address).toBe(user_0.street_address);
  expect(customer.image_url).toBe(user_0.image_url);
});

test('getCustomers includes user_0', async() => {
  const customers = await db.getCustomers();
  expect(customers.length).toBe(1);
  const customerIds = customers.map(cust => cust.id);
  expect(customerIds).toContain(user_0.id);
});

test('addCustomer user_0 (duplicate)', async() => {
  try {
    await db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.image_url);
  }catch(err){
    expect(err.toString()).toMatch("Error");
  }
});

test('removeCustomer user_0', async() => {
  await expect(db.removeCustomer(user_0.id)).resolves.toBeDefined();
});

test('getCustomer user_0 (none existing)', async() => {
  const customer = await db.getCustomer('user_0');
  expect(customer).toBe(null);
});

test('addBusiness user_1', async() => {
  await expect(db.addBusiness(user_1.id, user_1.email, user_1.country, user_1.name)).resolves.toBeDefined();
});

test('getBusiness user_1', async() => {
  const business = await db.getBusiness('user_1');
  expect(business.id).toBe(user_1.id);
  expect(business.email).toBe(user_1.email);
  expect(business.country).toBe(user_1.country);
  expect(business.name).toBe(user_1.name);
});

test('updateBusiness user_1', async() => {
  const business = await db.updateBusiness(user_1.id, user_1.email, user_1.country, user_1.longitude, user_1.latitude, user_1.street_address, user_1.business_email, user_1.business_phone, user_1.name, user_1.description, user_1.image_url, user_1.banner_url);
  expect(business).toBeDefined();
});

test('getBusiness user_1 (updated with name, latitude, longitude)', async() => {
  const business = await db.getBusiness(user_1.id);
  expect(business.id).toBe(user_1.id);
  expect(business.email).toBe(user_1.email);
  expect(business.country).toBe(user_1.country);
  expect(Number(business.latitude)).toBeCloseTo(user_1.latitude);
  expect(Number(business.longitude)).toBeCloseTo(user_1.longitude);
  expect(business.street_address).toBe(user_1.street_address);
  expect(business.business_email).toBe(user_1.business_email);
  expect(business.business_phone).toBe(user_1.business_phone);
  expect(business.name).toBe(user_1.name);
  expect(business.image_url).toBe(user_1.image_url);
  expect(business.banner_url).toBe(user_1.banner_url);
});

test('getBusinesses includes user_1', async() => {
  const businesses = await db.getBusinesses();
  expect(businesses.length).toBe(1);
  const businessIds = businesses.map(biz => biz.id);
  expect(businessIds).toContain(user_1.id);
});

test('add user_1 (duplicate)', async() => {
  try {
    await db.addBusiness(user_1.id, user_1.email, user_1.country, user_1.name);
  } catch(err) {
    expect(err.toString()).toMatch("Error");
  }
});

test('removeBusiness user_1', async() => {
  await expect(db.removeBusiness(user_1.id)).resolves.toBeDefined();
});

test('getBusiness user_1 (none existing)', async() => {
  const business = await db.getBusiness('user_1');
  expect(business).toBe(null);
});

test('addCard without business (should fail)', async() => {
  await expect(db.addCard(card_1.id, card_1.name)).rejects.toThrow();
});

test('addReward without business (should fail)', async() => {
  await expect(db.addReward(reward_1.id, reward_1.name, reward_1.description, reward_1.image_url, reward_1.points, reward_1.business_id)).rejects.toThrow();
});

test('addCustomer user_0 and addBusiness user_1 for further tests', async() => {
  await expect(db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.image_url)).resolves.toBeDefined();
  await expect(db.addBusiness(user_1.id, user_1.email, user_1.country, user_1.name)).resolves.toBeDefined();
});

test('addCard with valid business', async() => {
  await expect(db.addCard(card_1.id, card_1.name)).resolves.toBeDefined();
});

test('getCards includes new card', async() => {
  const cards = await db.getCards();
  expect(cards.length).toBe(1);
  const cardNames = cards.map(card => card.name);
  expect(cardNames).toContain(card_1.name);
});

test('getCard card_1', async() => {
  const card = await db.getCard(card_1.id);
  expect(card.name).toBe(card_1.name);
});

test('updateCard card_1', async() => {
  const updatedCard = await db.updateCard(card_1.id, 'Updated Card Name', card_1.description, card_1.contact_info, card_1.image_url, card_1.colour);
  expect(updatedCard).toBeDefined();
});

test('getCard card_1 (after update)', async() => {
  const card = await db.getCard(card_1.id);
  expect(card.name).toBe('Updated Card Name');  
  expect(card.description).toBe(card_1.description);
  expect(card.contact_info).toBe(card_1.contact_info);
  expect(card.image_url).toBe(card_1.image_url);
  expect(card.colour).toBe(card_1.colour);
});

test('removeCard card_1', async() => {
  await expect(db.removeCard(card_1.id)).resolves.toBeDefined();
});

test('getCards empty after removal', async() => {
  const cards = await db.getCards();
  expect(cards.length).toBe(0);
});

test('addReward with valid business', async() => {
  await expect(db.addReward(reward_1.id, reward_1.name, reward_1.description, reward_1.image_url, reward_1.points, reward_1.business_id)).resolves.toBeDefined();
});

test('getRewards includes new reward', async() => {
  const rewards = await db.getRewards();
  expect(rewards.length).toBe(1);
  const rewardNames = rewards.map(reward => reward.name);
  expect(rewardNames).toContain(reward_1.name);
});

test('getReward reward_1', async() => {
  const reward = await db.getReward(reward_1.id);
  expect(reward.name).toBe(reward_1.name);
  expect(reward.description).toBe(reward_1.description);
  expect(reward.image_url).toBe(reward_1.image_url);
  expect(reward.points).toBe(reward_1.points);
  expect(reward.business_id).toBe(reward_1.business_id);
});

test('updateReward reward_1', async() => {
  const updatedReward = await db.updateReward(reward_1.id, 'Updated Reward Name', 'Updated Description', 'http://example.com/updated_reward.jpg', 200);
  expect(updatedReward).toBeDefined();
});

test('getReward reward_1 (after update)', async() => {
  const reward = await db.getReward(reward_1.id);
  expect(reward.name).toBe('Updated Reward Name');
  expect(reward.description).toBe('Updated Description');
  expect(reward.image_url).toBe('http://example.com/updated_reward.jpg');
  expect(reward.points).toBe(200);
  expect(reward.business_id).toBe(reward_1.business_id);
});

test('getBusinessRewards for user_1 includes reward_1', async() => {
  const businessRewards = await db.getBusinessRewards(reward_1.business_id);
  expect(businessRewards.length).toBe(1);
  const rewardIds = businessRewards.map(reward => reward.id);
  expect(rewardIds).toContain(reward_1.id);
});

test('getBusinessReward user_1 reward_1', async() => {
  const businessReward = await db.getBusinessReward(reward_1.business_id, reward_1.id);
  expect(businessReward.id).toBe(reward_1.id);
  expect(businessReward.name).toBe('Updated Reward Name');
  expect(businessReward.description).toBe('Updated Description');
  expect(businessReward.image_url).toBe('http://example.com/updated_reward.jpg');
  expect(businessReward.points).toBe(200);
  expect(businessReward.business_id).toBe(reward_1.business_id);
});

test('removeReward reward_1', async() => {
  await expect(db.removeReward(reward_1.id)).resolves.toBeDefined();
});

test('getRewards empty after removal', async() => {
  const rewards = await db.getRewards();
  expect(rewards.length).toBe(0);
});

test('addReward reward_1 (setup for removeBusinessRewards test)', async() => {
  await expect(db.addReward(reward_1.id, reward_1.name, reward_1.description, reward_1.image_url, reward_1.points, reward_1.business_id)).resolves.toBeDefined();
});

test('removeBusinessRewards for user_1', async() => {
  await expect(db.removeBusinessRewards(reward_1.business_id)).resolves.toBeDefined();
});

test('getRewards empty after removeBusinessRewards', async() => {
  const rewards = await db.getRewards();
  expect(rewards.length).toBe(0);
});

test('addCard + updateCard card_1 (setup for customerCard tests)', async() => {
  await expect(db.addCard(card_1.id, card_1.name)).resolves.toBeDefined();
  await expect(db.updateCard(card_1.id, card_1.name, card_1.description, card_1.contact_info, card_1.image_url, card_1.colour)).resolves.toBeDefined();
});

test('addCustomerCard card_0', async() => {
  await expect(db.addCustomerCard(card_0.customer_id, card_0.card_id)).resolves.toBeDefined();
});

test('getCustomerCards for user_0 includes card_1', async() => {
  const customerCards = await db.getCustomerCards(card_0.customer_id);
  expect(customerCards.length).toBe(1);
  const cardIds = customerCards.map(custCard => custCard.id);
  expect(cardIds[0]).toBe(card_0.card_id);
});

test('getCustomerCard card_0', async() => {
  const customerCard = await db.getCustomerCard(card_0.customer_id, card_0.card_id);
  expect(customerCard.id).toBe(card_0.card_id);
  expect(customerCard.name).toBe(card_1.name);
  expect(customerCard.description).toBe(card_1.description);
  expect(customerCard.colour).toBe(card_1.colour);
  expect(customerCard.contact_info).toBe(card_1.contact_info);
  expect(customerCard.points).toBe(0);
  expect(customerCard.colour).toBe(card_1.colour);
});

test('updateCustomerCard card_0', async() => {
  const updatedCustomerCard = await db.updateCustomerCard(card_0.customer_id, card_0.card_id, 50);
  expect(updatedCustomerCard).toBeDefined();
});

test('getCustomerCard card_0 (after update)', async() => {
  const customerCard = await db.getCustomerCard(card_0.customer_id, card_0.card_id);
  expect(customerCard.points).toBe(50);
});

test('removeCustomerCard card_0', async() => {
  await expect(db.removeCustomerCard(card_0.customer_id, card_0.card_id)).resolves.toBeDefined();
});

test('getCustomerCards for user_0 empty after removal', async() => {
  const customerCards = await db.getCustomerCards(card_0.customer_id);
  expect(customerCards.length).toBe(0);
});

test('removeCard card_1 (cleanup)', async() => {
  await expect(db.removeCard(card_1.id)).resolves.toBeDefined();
});

test('removeBusiness user_0 and user_1 (cleanup)', async() => {
  await expect(db.removeCustomer(user_0.id)).resolves.toBeDefined();
  await expect(db.removeBusiness(user_1.id)).resolves.toBeDefined();
}); 


// at this point there are no users
// try adding business cards/rewards (fail for no valid business id), and customer cards (fail for no valid customer/card id)
// then add business + customer -> add business card -> add business reward -> add customer card



// async function testGetBusinessFromCard() {
//     try {
//         const business = await db.getBusinessFromCard('dummy_card_id');
//         console.log('testGetBusinessFromCard passed:', business);
//     } catch (err) {
//         console.error('testGetBusinessFromCard failed:', err);
//     }
// }

// async function testGetRewardsFromBusiness() {
//     try {
//         const rewards = await db.getRewardsFromBusiness('dummy_business_id');
//         console.log('testGetRewardsFromBusiness passed:', rewards);
//     } catch (err) {
//         console.error('testGetRewardsFromBusiness failed:', err);
//     }
// }

// async function testGetReward() {
//     try {
//         const reward = await db.getReward('dummy_id');
//         console.log('testGetReward passed:', reward);
//     } catch (err) {
//         console.error('testGetReward failed:', err);
//     }
// }

// async function testAddReward() {
//     try {
//         const result = await db.addReward('dummy_id', 'Test Reward', 100, 'Description', 'image.jpg', 'business_id');
//         console.log('testAddReward passed:', result);
//     } catch (err) {
//         console.error('testAddReward failed:', err);
//     }
// }

// async function testUpdateReward() {
//     try {
//         const result = await db.updateReward('dummy_id', 'New Name', 'New Description', 'new_image.jpg', 200);
//         console.log('testUpdateReward passed:', result);
//     } catch (err) {
//         console.error('testUpdateReward failed:', err);
//     }
// }

// async function testGetCards() {
//     try {
//         const cards = await db.getCards();
//         console.log('testGetCards passed:', cards.length, 'cards');
//     } catch (err) {
//         console.error('testGetCards failed:', err);
//     }
// }

// async function testGetCard() {
//     try {
//         const card = await db.getCard('dummy_id');
//         console.log('testGetCard passed:', card);
//     } catch (err) {
//         console.error('testGetCard failed:', err);
//     }
// }

// async function testAddCard() {
//     try {
//         const result = await db.addCard('business_id', 'Test Card');
//         console.log('testAddCard passed:', result);
//     } catch (err) {
//         console.error('testAddCard failed:', err);
//     }
// }

// async function testUpdateCard() {
//     try {
//         const result = await db.updateCard('dummy_id', 'New Name', 'Description', 'image.jpg', 'contact', 'blue');
//         console.log('testUpdateCard passed:', result);
//     } catch (err) {
//         console.error('testUpdateCard failed:', err);
//     }
// }

// async function testGetCustomerCards() {
//     try {
//         const cards = await db.getCustomerCards('dummy_customer_id');
//         console.log('testGetCustomerCards passed:', cards);
//     } catch (err) {
//         console.error('testGetCustomerCards failed:', err);
//     }
// }

// async function testGetCustomerCard() {
//     try {
//         const card = await db.getCustomerCard('dummy_customer_id', 'dummy_card_id');
//         console.log('testGetCustomerCard passed:', card);
//     } catch (err) {
//         console.error('testGetCustomerCard failed:', err);
//     }
// }

// async function testAddCustomerCard() {
//     try {
//         const result = await db.addCustomerCard('dummy_customer_id', 'dummy_card_id');
//         console.log('testAddCustomerCard passed:', result);
//     } catch (err) {
//         console.error('testAddCustomerCard failed:', err);
//     }
// }

// async function testUpdateCustomerCard() {
//     try {
//         const result = await db.updateCustomerCard('dummy_customer_id', 'dummy_card_id', 50);
//         console.log('testUpdateCustomerCard passed:', result);
//     } catch (err) {
//         console.error('testUpdateCustomerCard failed:', err);
//     }
// }

// async function testGetBusinessRewards() {
//     try {
//         const rewards = await db.getBusinessRewards('dummy_business_id');
//         console.log('testGetBusinessRewards passed:', rewards);
//     } catch (err) {
//         console.error('testGetBusinessRewards failed:', err);
//     }
// }

// async function testGetBusinessReward() {
//     try {
//         const reward = await db.getBusinessReward('dummy_business_id', 'dummy_reward_id');
//         console.log('testGetBusinessReward passed:', reward);
//     } catch (err) {
//         console.error('testGetBusinessReward failed:', err);
//     }
// }

// async function runAllTests() {
//     await testGetCustomers();
//     await testGetCustomer();
//     await testAddCustomer();
//     await testUpdateCustomer();
//     await testGetBusinesses();
//     await testGetBusiness();
//     await testGetBusinessFromCard();
//     await testAddBusiness();
//     await testUpdateBusiness();
//     await testGetRewards();
//     await testGetRewardsFromBusiness();
//     await testGetReward();
//     await testAddReward();
//     await testUpdateReward();
//     await testGetCards();
//     await testGetCard();
//     await testAddCard();
//     await testUpdateCard();
//     await testGetCustomerCards();
//     await testGetCustomerCard();
//     await testAddCustomerCard();
//     await testUpdateCustomerCard();
//     await testGetBusinessRewards();
//     await testGetBusinessReward();
//     console.log('All dummy tests completed.');
// }

// runAllTests();