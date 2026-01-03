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
            const rows = await this.query('SELECT * FROM customers');
            return rows;
        }catch (err){
            console.error('getCustomers error:', err);
            throw err;
        }
    }

    async getCustomer(id){
        try{
            const rows = await this.query('SELECT * FROM customers WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCustomer error:', err);
            throw err;
        }
    }

    // async addCustomer(email, name){
    //     try{
    //         const result = await this.query('INSERT INTO customers (email, `name`) VALUES (?, ?)', [email, name]);
    //         return result;
    //     }catch (err){
    //         console.error('addCustomer error:', err);
    //         throw err;
    //     }
    // }

    async addCustomer(id, email, country, language){
        try{
            const result = await this.query('INSERT INTO customers (id, email, country, language) VALUES (?, ?, ?, ?)', [id, email, country, language]);
            return result;
        }catch (err){
            console.error('addCustomer error:', err);
            throw err;
        }
    }

    async updateCustomer(customer_id, email, name, longitude, latitude){
        try{
            const command = "UPDATE `card_app`.`customers` SET `email` = ?, `name` = ?, `longitude` = ?, `latitude` = ? WHERE `id` = ?";
            const result = await this.query(command, [email, name, longitude, latitude, customer_id]);
            return result;
        }catch (err){
            console.error('updateCustomer error:', err);
            throw err;
        }
    }

    // Businesses
    async getBusinesses(){
        try{
            const rows = await this.query('SELECT * FROM businesses');
            return rows;
        }catch (err){
            console.error('getBusinesses error:', err);
            throw err;
        }
    }

    async getBusiness(id){
        try{
            const rows = await this.query('SELECT * FROM businesses WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusiness error:', err);
            throw err;
        }
    }
    
    async getBusinessFromCard(cardId){
        try{
            // If businesses reference cards via `card_id`, select the business for the given card id.
            const rows = await this.query('SELECT id, name, email, longitude, latitude FROM businesses WHERE card_id = ?', [cardId]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusinessFromCard error:', err);
            throw err;
        }
    }

    async addBusiness(id, email, name, country, language){
        try{
            const result = await this.query('INSERT INTO businesses (id, email, name, country, language) VALUES (?, ?, ?, ?, ?)', [id, email, name, country, language]);
            return result;
        }catch (err){
            console.error('addBusiness error:', err);
            throw err;
        }
    }

    async updateBusiness(business_id, email, phone_number, name, description, street_address){
        try{
            const command = "UPDATE `card_app`.`businesses` SET `email` = ?, `phone_number` = ?, `name` = ?, `description` = ?, `street_address` = ? WHERE `id` = ?";
            const result = await this.query(command, [email, phone_number, name, description, street_address, business_id]);
            return result;
        }catch (err){
            console.error('updateBusiness error:', err);
            throw err;
        }
    }

    // Rewards
    async getRewards(){
        try{
            const rows = await this.query('SELECT * FROM rewards');
            return rows;
        }catch (err){
            console.error('getRewards error:', err);
            throw err;
        }
    }

    async getRewardsFromBusiness(business_id){
        try{
            const rows = await this.query('SELECT * FROM rewards WHERE business_id = ?', [business_id]);
            return rows;
        }catch (err){
            console.error('getRewardsFromBusiness error:', err);
            throw err;
        }
    }

    async getReward(id){
        try{
            const rows = await this.query('SELECT * FROM rewards WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getReward error:', err);
            throw err;
        }
    }

    async addReward(id, name, points, description, image_url, business_id){
        try{
            const result = await this.query('INSERT INTO rewards (id, name, points, description, image_url, business_id) VALUES (?, ?, ?, ?, ?, ?)', [id, name, points, description, image_url, business_id]);
            return result;
        }catch (err){
            console.error('addReward error:', err);
            throw err;
        }
    }

    async updateReward(id, name, description, image_url, points){
        try{
            const command = "UPDATE `card_app`.`rewards` SET `name` = ?, `description` = ?, `image_url` = ?, `points` = ? WHERE `id` = ?"
            const result = await this.query(command, [name, description, image_url, points, id]);
            return result;
        }catch (err){
            console.error('updateReward error:', err);
            throw err;
        }
    }

    // Cards
    async getCards(){
        try{
            const rows = await this.query('SELECT * FROM cards');
            return rows;
        }catch (err){
            console.error('getCards error:', err);
            throw err;
        }
    }

    async getCard(id){
        try{
            const rows = await this.query('SELECT * FROM cards WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCard error:', err);
            throw err;
        }
    }

    async addCard(business_id, name){
        try{
            const result = await this.query('INSERT INTO cards (id, name) VALUES (?, ?)', [business_id, name]);
            return result;
        }catch (err){
            console.error('addCard error:', err);
            throw err;
        }
    }

    async updateCard(card_id, name, description, image_url, contact_info, colour){
        try{
            const command = "UPDATE `card_app`.`cards` SET `name` = ?, `description` = ?, `image_url` = ?, `contact_info` = ?, `colour` = ? WHERE `id` = ?";
            const result = await this.query(command, [name, description, image_url, contact_info, colour, card_id]);
            return result;
        }catch (err){
            console.error('updateCard error:', err);
            throw err;
        }
    }

    async getCustomerCards(id){
        try{
            const rows = await this.query('SELECT id, name, description, image_url, contact_info, points, colour FROM cards INNER JOIN customer_cards ON cards.id = customer_cards.card_id WHERE customer_id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getCustomerCards error:', err);
            throw err;
        }
    }
    async getCustomerCard(customer_id, card_id){
        try{
            const rows = await this.query('SELECT id, name, description, contact_info, points FROM cards INNER JOIN customer_cards WHERE customer_id = ? AND card_id = ?', [customer_id, card_id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCardFromCustomer error:', err);
            throw err;
        }
    }
    async addCustomerCard(customer_id, card_id){
        try{
            const result = await this.query('INSERT INTO customer_cards (customer_id, card_id) VALUES (?, ?)', [customer_id, card_id]);
            return result;
        }catch (err){
            console.error('addCustomerCard error:', err);
            throw err;
        }
    }

    async updateCustomerCard(customer_id, card_id, points){
        try{
            const result = await this.query('UPDATE customer_cards SET points = ? WHERE customer_id = ? AND card_id = ?', [points, customer_id, card_id]);
            return result;
        }catch (err){
            console.error('updateCustomerCard error:', err);
            throw err;
        }
    }


    async getBusinessRewards(business_id){
        //fetch data in ascending point order
        try{
            const rows = await this.query('SELECT * FROM rewards WHERE business_id = ? ORDER BY rewards.points ASC', [business_id]);
            return rows;
        }catch (err){
            console.error('getBusinessRewards error:', err);
            throw err;
        }
    }
    async getBusinessReward(business_id, reward_id){
        try{
            const rows = await this.query('SELECT * FROM rewards WHERE business_id = ? AND id = ?', [business_id, reward_id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusinessReward error:', err);
            throw err;
        }
    }
}

export default new Database();

// const customers = await addCustomer("Test", "test@example.com");
// console.log(customers);
// const db = new Database();
// const result = await db.updateCustomerCard("user_3631ytWKA51u1CLDkuuppqtu8LZ", "user_363Tl64h2sSxQH3jKLIWBPpZEYg", 1);
// console.log(result);