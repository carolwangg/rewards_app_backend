import db from '../src/clients/database.ts';
import assert from 'assert';

async function testGetCustomers() {
    try {
        const customers = await db.getCustomers();
        console.log('testGetCustomers passed:', customers.length, 'customers');
    } catch (err) {
        console.error('testGetCustomers failed:', err);
    }
}

async function testGetCustomer() {
    try {
        const customer = await db.getCustomer('dummy_id');
        console.log('testGetCustomer passed:', customer);
    } catch (err) {
        console.error('testGetCustomer failed:', err);
    }
}

async function testAddCustomer() {
    try {
        const result = await db.addCustomer('dummy_id', 'test@example.com', 'US', 'en');
        console.log('testAddCustomer passed:', result);
    } catch (err) {
        console.error('testAddCustomer failed:', err);
    }
}

async function testUpdateCustomer() {
    try {
        const result = await db.updateCustomer('dummy_id', 'new@example.com', 'Test Name', 0, 0);
        console.log('testUpdateCustomer passed:', result);
    } catch (err) {
        console.error('testUpdateCustomer failed:', err);
    }
}

async function testGetBusinesses() {
    try {
        const businesses = await db.getBusinesses();
        console.log('testGetBusinesses passed:', businesses.length, 'businesses');
    } catch (err) {
        console.error('testGetBusinesses failed:', err);
    }
}

async function testGetBusiness() {
    try {
        const business = await db.getBusiness('dummy_id');
        console.log('testGetBusiness passed:', business);
    } catch (err) {
        console.error('testGetBusiness failed:', err);
    }
}

async function testGetBusinessFromCard() {
    try {
        const business = await db.getBusinessFromCard('dummy_card_id');
        console.log('testGetBusinessFromCard passed:', business);
    } catch (err) {
        console.error('testGetBusinessFromCard failed:', err);
    }
}

async function testAddBusiness() {
    try {
        const result = await db.addBusiness('dummy_id', 'business@example.com', 'Test Business', 'US', 'en');
        console.log('testAddBusiness passed:', result);
    } catch (err) {
        console.error('testAddBusiness failed:', err);
    }
}

async function testUpdateBusiness() {
    try {
        const result = await db.updateBusiness('dummy_id', 'new@example.com', '1234567890', 'New Name', 'Description', 'Address');
        console.log('testUpdateBusiness passed:', result);
    } catch (err) {
        console.error('testUpdateBusiness failed:', err);
    }
}

async function testGetRewards() {
    try {
        const rewards = await db.getRewards();
        console.log('testGetRewards passed:', rewards.length, 'rewards');
    } catch (err) {
        console.error('testGetRewards failed:', err);
    }
}

async function testGetRewardsFromBusiness() {
    try {
        const rewards = await db.getRewardsFromBusiness('dummy_business_id');
        console.log('testGetRewardsFromBusiness passed:', rewards);
    } catch (err) {
        console.error('testGetRewardsFromBusiness failed:', err);
    }
}

async function testGetReward() {
    try {
        const reward = await db.getReward('dummy_id');
        console.log('testGetReward passed:', reward);
    } catch (err) {
        console.error('testGetReward failed:', err);
    }
}

async function testAddReward() {
    try {
        const result = await db.addReward('dummy_id', 'Test Reward', 100, 'Description', 'image.jpg', 'business_id');
        console.log('testAddReward passed:', result);
    } catch (err) {
        console.error('testAddReward failed:', err);
    }
}

async function testUpdateReward() {
    try {
        const result = await db.updateReward('dummy_id', 'New Name', 'New Description', 'new_image.jpg', 200);
        console.log('testUpdateReward passed:', result);
    } catch (err) {
        console.error('testUpdateReward failed:', err);
    }
}

async function testGetCards() {
    try {
        const cards = await db.getCards();
        console.log('testGetCards passed:', cards.length, 'cards');
    } catch (err) {
        console.error('testGetCards failed:', err);
    }
}

async function testGetCard() {
    try {
        const card = await db.getCard('dummy_id');
        console.log('testGetCard passed:', card);
    } catch (err) {
        console.error('testGetCard failed:', err);
    }
}

async function testAddCard() {
    try {
        const result = await db.addCard('business_id', 'Test Card');
        console.log('testAddCard passed:', result);
    } catch (err) {
        console.error('testAddCard failed:', err);
    }
}

async function testUpdateCard() {
    try {
        const result = await db.updateCard('dummy_id', 'New Name', 'Description', 'image.jpg', 'contact', 'blue');
        console.log('testUpdateCard passed:', result);
    } catch (err) {
        console.error('testUpdateCard failed:', err);
    }
}

async function testGetCustomerCards() {
    try {
        const cards = await db.getCustomerCards('dummy_customer_id');
        console.log('testGetCustomerCards passed:', cards);
    } catch (err) {
        console.error('testGetCustomerCards failed:', err);
    }
}

async function testGetCustomerCard() {
    try {
        const card = await db.getCustomerCard('dummy_customer_id', 'dummy_card_id');
        console.log('testGetCustomerCard passed:', card);
    } catch (err) {
        console.error('testGetCustomerCard failed:', err);
    }
}

async function testAddCustomerCard() {
    try {
        const result = await db.addCustomerCard('dummy_customer_id', 'dummy_card_id');
        console.log('testAddCustomerCard passed:', result);
    } catch (err) {
        console.error('testAddCustomerCard failed:', err);
    }
}

async function testUpdateCustomerCard() {
    try {
        const result = await db.updateCustomerCard('dummy_customer_id', 'dummy_card_id', 50);
        console.log('testUpdateCustomerCard passed:', result);
    } catch (err) {
        console.error('testUpdateCustomerCard failed:', err);
    }
}

async function testGetBusinessRewards() {
    try {
        const rewards = await db.getBusinessRewards('dummy_business_id');
        console.log('testGetBusinessRewards passed:', rewards);
    } catch (err) {
        console.error('testGetBusinessRewards failed:', err);
    }
}

async function testGetBusinessReward() {
    try {
        const reward = await db.getBusinessReward('dummy_business_id', 'dummy_reward_id');
        console.log('testGetBusinessReward passed:', reward);
    } catch (err) {
        console.error('testGetBusinessReward failed:', err);
    }
}

async function runAllTests() {
    await testGetCustomers();
    await testGetCustomer();
    await testAddCustomer();
    await testUpdateCustomer();
    await testGetBusinesses();
    await testGetBusiness();
    await testGetBusinessFromCard();
    await testAddBusiness();
    await testUpdateBusiness();
    await testGetRewards();
    await testGetRewardsFromBusiness();
    await testGetReward();
    await testAddReward();
    await testUpdateReward();
    await testGetCards();
    await testGetCard();
    await testAddCard();
    await testUpdateCard();
    await testGetCustomerCards();
    await testGetCustomerCard();
    await testAddCustomerCard();
    await testUpdateCustomerCard();
    await testGetBusinessRewards();
    await testGetBusinessReward();
    console.log('All dummy tests completed.');
}

runAllTests();