import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

let pool;
class Database {
    constructor() {
        dotenv.config();

        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
    }

    async query (query, params = []) {
        const [rows] = await pool.query(query, params);
        return rows;
    }
    
    // Customers
    async getCustomers(){
        try{
            const rows = await this.query('SELECT * FROM card_app.customers');
            return rows;
        }catch (err){
            console.error('getCustomers error:', err);
            throw err;
        }
    }

    async getCustomer(id){
        try{
            const rows = await this.query('SELECT * FROM card_app.customers WHERE id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getCustomer error:', err);
            throw err;
        }
    }

    async addCustomer(name, email){
        try{
            const result = await this.query('INSERT INTO card_app.customers (`name`, email) VALUES (?, ?)', [name, email]);
            return result;
        }catch (err){
            console.error('addCustomer error:', err);
            throw err;
        }
    }

    // Businesses
    async getBusinesses(){
        try{
            const rows = await this.query('SELECT * FROM card_app.businesses');
            return rows;
        }catch (err){
            console.error('getBusinesses error:', err);
            throw err;
        }
    }

    async getBusiness(id){
        try{
            const rows = await this.query('SELECT * FROM card_app.businesses WHERE id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getBusiness error:', err);
            throw err;
        }
    }
    
    async getBusinessFromCard(cardId){
        try{
            // If businesses reference cards via `card_id`, select the business for the given card id.
            const rows = await this.query('SELECT id, name, email, longitude, latitude FROM card_app.businesses WHERE card_id = ?', [cardId]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusinessFromCard error:', err);
            throw err;
        }
    }

    async addBusiness(name, email, longitude, latitude){
        try{
            const result = await this.query('INSERT INTO card_app.businesses (name, email, longitude, latitude) VALUES (?, ?, ?, ?)', [name, email, longitude, latitude]);
            return result;
        }catch (err){
            console.error('addBusiness error:', err);
            throw err;
        }
    }


    // Rewards
    async getRewards(){
        try{
            const rows = await this.query('SELECT * FROM card_app.rewards');
            return rows;
        }catch (err){
            console.error('getRewards error:', err);
            throw err;
        }
    }

    async getReward(id){
        try{
            const rows = await this.query('SELECT * FROM card_app.rewards WHERE id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getReward error:', err);
            throw err;
        }
    }

    async addReward(business_id, name, points){
        try{
            const result = await this.query('INSERT INTO card_app.rewards (business_id, name, points) VALUES (?, ?, ?)', [business_id, name, points]);
            return result;
        }catch (err){
            console.error('addReward error:', err);
            throw err;
        }
    }

    async getRewardsFromBusiness(id){
        try{
            const rows = await this.query('SELECT * FROM card_app.rewards WHERE business_id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getRewardsFromBusiness error:', err);
            throw err;
        }
    }

    // Cards
    async getCards(){
        try{
            const rows = await this.query('SELECT * FROM card_app.cards');
            return rows;
        }catch (err){
            console.error('getCards error:', err);
            throw err;
        }
    }

    async getCardsFromCustomer(id){
        try{
            const rows = await this.query('SELECT id, name, description, phone_number, points FROM card_app.cards INNER JOIN card_app.customer_cards WHERE customer_id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getCardsFromCustomer error:', err);
            throw err;
        }
    }

    async getCardFromCustomer(customer_id, card_id){
        try{
            const rows = await this.query('SELECT id, name, description, phone_number, points FROM card_app.cards INNER JOIN card_app.customer_cards WHERE customer_id = ? AND card_id = ?', [customer_id, card_id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCardFromCustomer error:', err);
            throw err;
        }
    }

    async getCard(id){
        try{
            const rows = await this.query('SELECT * FROM card_app.cards WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCard error:', err);
            throw err;
        }
    }
}

export default new Database();

// const customers = await addCustomer("Test", "test@example.com");
// console.log(customers);