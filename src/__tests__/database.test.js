const db = require('clients/database.ts').default;
// import assert from 'assert';

const user_0 = {
  id: 'user_0',
  name: 'Test User',
  email: 'test@example.com',
  latitude: 0,
  longitude: 0,
  country: 'CA',
  language: 'en'
}
const user_1 = {
  id: 'user_1',
  name: 'Test Business',
  email: 'test@example.com',
  latitude: 0,
  longitude: 0,
  country: 'ES',
  language: 'es',
  street_address: '123 Test St',
  business_email: 'business@example.com',
  business_phone: '1234567890',
  image_url: 'http://example.com/image.jpg',
  banner_url: 'http://example.com/banner.jpg'
}

test('addCustomer user_0', async() => {
  await expect(db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.language)).resolves.toBeDefined();
});

test('getCustomer user_0', async() => {
  const customer = await db.getCustomer('user_0');
  expect(customer.id).toBe(user_0.id);
  expect(customer.email).toBe(user_0.email);
  expect(customer.country).toBe(user_0.country);
});

test('updateCustomer user_0', async() => {
  const customer = await db.updateCustomer(user_0.id, user_0.email, user_0.name, user_0.latitude, user_0.longitude);
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
});

// test('getCustomers includes user_0', async() => {
//   const customers = await db.getCustomers();
//   expect(customers.length).toBe(1);
//   const customerIds = customers.map(cust => cust.id);
//   expect(customerIds).toContain(user_0.id);
// });

test('addCustomer user_0 (duplicate)', async() => {
  try {
    db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.language);
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
  await expect(db.addBusiness(user_1.id, user_1.email, user_1.country, user_1.language)).resolves.toBeDefined();
});

test('getBusiness user_1', async() => {
  const business = await db.getBusiness('user_1');
  expect(business.id).toBe(user_1.id);
  expect(business.email).toBe(user_1.email);
  expect(business.country).toBe(user_1.country);
});

test('updateBusiness user_1', async() => {
  const business = await db.updateBusiness(user_1.id, user_1.email, user_1.country, user_1.language, user_1.longitude, user_1.latitude, user_1.street_address, user_1.business_email, user_1.business_phone, user_1.name, user_1.description, user_1.image_url, user_1.banner_url);
  expect(business).toBeDefined();
});

test('getBusiness user_1 (updated with name, latitude, longitude)', async() => {
  const business = await db.getBusiness(user_1.id);
  expect(business.id).toBe(user_1.id);
  expect(business.email).toBe(user_1.email);
  expect(business.country).toBe(user_1.country);
  expect(business.language).toBe(user_1.language);
  expect(Number(business.latitude)).toBeCloseTo(user_1.latitude);
  expect(Number(business.longitude)).toBeCloseTo(user_1.longitude);
  expect(business.street_address).toBe(user_1.street_address);
  expect(business.business_email).toBe(user_1.business_email);
  expect(business.business_phone).toBe(user_1.business_phone);
  expect(business.name).toBe(user_1.name);
  expect(business.image_url).toBe(user_1.image_url);
  expect(business.banner_url).toBe(user_1.banner_url);
});

// test('getBusinesses includes user_1', async() => {
//   const businesses = await db.getBusinesses();
//   expect(businesses.length).toBe(1);
//   const businessIds = businesses.map(biz => biz.id);
//   expect(businessIds).toContain(user_1.id);
// });

test('add user_1 (duplicate)', async() => {
  try {
    await db.addBusiness(user_1.id, user_1.email, user_1.country, user_1.language);
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


// async function testGetBusinesses() {
//     try {
//         const businesses = await db.getBusinesses();
//         console.log('testGetBusinesses passed:', businesses.length, 'businesses');
//     } catch (err) {
//         console.error('testGetBusinesses failed:', err);
//     }
// }

// async function testGetBusiness() {
//     try {
//         const business = await db.getBusiness('dummy_id');
//         console.log('testGetBusiness passed:', business);
//     } catch (err) {
//         console.error('testGetBusiness failed:', err);
//     }
// }

// async function testGetBusinessFromCard() {
//     try {
//         const business = await db.getBusinessFromCard('dummy_card_id');
//         console.log('testGetBusinessFromCard passed:', business);
//     } catch (err) {
//         console.error('testGetBusinessFromCard failed:', err);
//     }
// }

// async function testAddBusiness() {
//     try {
//         const result = await db.addBusiness('dummy_id', 'business@example.com', 'Test Business', 'US', 'en');
//         console.log('testAddBusiness passed:', result);
//     } catch (err) {
//         console.error('testAddBusiness failed:', err);
//     }
// }

// async function testUpdateBusiness() {
//     try {
//         const result = await db.updateBusiness('dummy_id', 'new@example.com', '1234567890', 'New Name', 'Description', 'Address');
//         console.log('testUpdateBusiness passed:', result);
//     } catch (err) {
//         console.error('testUpdateBusiness failed:', err);
//     }
// }

// async function testGetRewards() {
//     try {
//         const rewards = await db.getRewards();
//         console.log('testGetRewards passed:', rewards.length, 'rewards');
//     } catch (err) {
//         console.error('testGetRewards failed:', err);
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