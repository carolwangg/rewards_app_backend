import db from '../src/clients/database.js';

async function runTests(){
    try{
        const customers = await db.getCustomers();
        console.log('getCustomers', customers);

        const businesses = await db.getBusinesses();
        console.log('getBusinesses', businesses);

        const cards = await db.getCards();
        console.log('getCards', cards);

        const rewards = await db.getRewards();
        console.log('getRewards', rewards);

        const rewardsForBusiness = await db.getRewardsFromBusiness(1);
        console.log('getRewardsFromBusiness', rewardsForBusiness);
    }catch(err){
        console.error('test-db error', err);
        throw err;
    }
}
await runTests();
