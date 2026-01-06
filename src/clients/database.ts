import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

/**
 * Database client for MySQL interactions.
 */
class Database {
    #pool: mysql.Pool;

    constructor() {
        dotenv.config();
        this.#pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
    }

    async query<MySQLType extends mysql.RowDataPacket[] | mysql.ResultSetHeader[]>(query: string, params: any[] = []): Promise<MySQLType> {
        const [rows] = await this.#pool.query<MySQLType>(query, params);
        return rows;
    }

    // User types
    async addUser(id: string, userType: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('INSERT INTO user_types (id, user_type) VALUES (?, ?)', [id, userType]);
            return result;
        }catch (err){
            console.error('addUser error:', err);
            throw err;
        }
    }

    async removeUser(id: string, userType: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('DELETE FROM user_types WHERE id = ? AND user_type = ?', [id, userType]);
            return result;
        }catch (err){
            console.error('removeUser error:', err);
            throw err;
        }
    }

    async getUserType(id: string){
        try{
            const result: mysql.RowDataPacket[] = await this.query<mysql.RowDataPacket[]>('SELECT user_type FROM user_types WHERE id = ?', [id]);
            return result;
        }catch (err){
            console.error('getUserType error:', err);
            throw err;
        }
    }
    
    // Customers
    async getCustomers(){
        try{
            const rows : mysql.RowDataPacket[] = await this.query<mysql.RowDataPacket[]>('SELECT * FROM customers');
            return rows;
        }catch (err){
            console.error('getCustomers error:', err);
            throw err;
        }
    }

    async getCustomer(id: string){
        try{
            const rows: mysql.RowDataPacket[] = await this.query<mysql.RowDataPacket[]>('SELECT * FROM customers WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCustomer error:', err);
            throw err;
        }
    }

    async addCustomer(id: string, email: string, country: string, language: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('INSERT INTO customers (id, email, country, language) VALUES (?, ?, ?, ?)', [id, email, country, language]);
            return result;
        }catch (err){
            console.error('addCustomer error:', err);
            throw err;
        }
    }

    async updateCustomer(customer_id: string, email: string, name: string, longitude: number, latitude: number, street_address: string, image_url: string){
        try{
            const command = "UPDATE `customers` SET `email` = ?, `name` = ?, `longitude` = ?, `latitude` = ?, `street_address` = ?, `image_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [email, name, longitude, latitude, street_address, image_url, customer_id]);
            return result;
        }catch (err){
            console.error('updateCustomer error:', err);
            throw err;
        }
    }

    async removeCustomer(id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('DELETE FROM customers WHERE id = ?', [id]);
            return result;
        }catch (err){
            console.error('removeCustomer error:', err);
            throw err;
        }
    }

    // Businesses
    async getBusinesses(){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM businesses');
            return rows;
        }catch (err){
            console.error('getBusinesses error:', err);
            throw err;
        }
    }

    async getBusiness(id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM businesses WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusiness error:', err);
            throw err;
        }
    }
    
    async getBusinessFromCard(cardId: string){
        try{
            // If businesses reference cards via `card_id`, select the business for the given card id.
            const rows : mysql.RowDataPacket[] = await this.query('SELECT id, name, email, longitude, latitude FROM businesses WHERE card_id = ?', [cardId]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusinessFromCard error:', err);
            throw err;
        }
    }

    async addBusiness(id: string, email: string, country: string, language: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('INSERT INTO businesses (id, email, country, language) VALUES (?, ?, ?, ?)', [id, email, country, language]);
            return result;
        }catch (err){
            console.error('addBusiness error:', err);
            throw err;
        }
    }

    async updateBusiness(business_id: string, email: string, country: string, language: string, longitude: number, latitude: number, street_address: string, 
        business_email: string, business_phone: string, name: string, description: string, image_url: string, banner_url: string){
        try{
            const command = "UPDATE `businesses` SET `email` = ?, `country` = ?, `language` = ?, `longitude` = ?, `latitude` = ?, `street_address` = ?, `business_email` = ?, `business_phone` = ?, `name` = ?, `description` = ?, `image_url` = ?, `banner_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [email, country, language, longitude, latitude, street_address, business_email, business_phone, name, description, image_url, banner_url, business_id]);
            return result;
        }catch (err){
            console.error('updateBusiness error:', err);
            throw err;
        }
    }

    async removeBusiness(id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('DELETE FROM businesses WHERE id = ?', [id]);
            return result;
        }catch (err){
            console.error('removeBusiness error:', err);
            throw err;
        }
    }

    // Rewards
    async getRewards(){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM rewards');
            return rows;
        }catch (err){
            console.error('getRewards error:', err);
            throw err;
        }
    }

    async getRewardsFromBusiness(business_id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM rewards WHERE business_id = ?', [business_id]);
            return rows;
        }catch (err){
            console.error('getRewardsFromBusiness error:', err);
            throw err;
        }
    }

    async getReward(id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM rewards WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getReward error:', err);
            throw err;
        }
    }

    async addReward(id: string, name: string, points: number, description: string, image_url: string, business_id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('INSERT INTO rewards (id, name, points, description, image_url, business_id) VALUES (?, ?, ?, ?, ?, ?)', [id, name, points, description, image_url, business_id]);
            return result;
        }catch (err){
            console.error('addReward error:', err);
            throw err;
        }
    }

    async updateReward(id: string, name: string, description: string, image_url: string, points: number){
        try{
            const command = "UPDATE `rewards` SET `name` = ?, `description` = ?, `image_url` = ?, `points` = ? WHERE `id` = ?"
            const result: mysql.ResultSetHeader[] = await this.query(command, [name, description, image_url, points, id]);
            return result;
        }catch (err){
            console.error('updateReward error:', err);
            throw err;
        }
    }

    async removeReward(id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('DELETE FROM rewards WHERE id = ?', [id]);
            return result;
        }catch (err){
            console.error('removeReward error:', err);
            throw err;
        }
    }

    // Cards
    async getCards(){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM cards');
            return rows;
        }catch (err){
            console.error('getCards error:', err);
            throw err;
        }
    }

    async getCard(id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM cards WHERE id = ?', [id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCard error:', err);
            throw err;
        }
    }

    async addCard(business_id: string, name: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('INSERT INTO cards (id, name) VALUES (?, ?)', [business_id, name]);
            return result;
        }catch (err){
            console.error('addCard error:', err);
            throw err;
        }
    }

    async updateCard(card_id: string, name: string, description: string, image_url: string, contact_info: string, colour: string){
        try{
            const command = "UPDATE `cards` SET `name` = ?, `description` = ?, `image_url` = ?, `contact_info` = ?, `colour` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [name, description, image_url, contact_info, colour, card_id]);
            return result;
        }catch (err){
            console.error('updateCard error:', err);
            throw err;
        }
    }

    async getCustomerCards(id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT id, name, description, image_url, contact_info, points, colour FROM cards INNER JOIN customer_cards ON cards.id = customer_cards.card_id WHERE customer_id = ?', [id]);
            return rows;
        }catch (err){
            console.error('getCustomerCards error:', err);
            throw err;
        }
    }
    async getCustomerCard(customer_id: string, card_id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT id, name, description, contact_info, points FROM cards INNER JOIN customer_cards WHERE customer_id = ? AND card_id = ?', [customer_id, card_id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getCardFromCustomer error:', err);
            throw err;
        }
    }
    async addCustomerCard(customer_id: string, card_id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('INSERT INTO customer_cards (customer_id, card_id, points) VALUES (?, ?, 0)', [customer_id, card_id]);
            return result;
        }catch (err){
            console.error('addCustomerCard error:', err);
            throw err;
        }
    }

    async updateCustomerCard(customer_id: string, card_id: string, points: number){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('UPDATE customer_cards SET points = ? WHERE customer_id = ? AND card_id = ?', [points, customer_id, card_id]);
            return result;
        }catch (err){
            console.error('updateCustomerCard error:', err);
            throw err;
        }
    }

    async removeCustomerCard(customer_id: string, card_id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('DELETE FROM customer_cards WHERE customer_id = ? AND card_id = ?', [customer_id, card_id]);
            return result;
        }catch (err){
            console.error('removeCustomerCard error:', err);
            throw err;
        }
    }

    async getBusinessRewards(business_id: string){
        //fetch data in ascending point order
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM rewards WHERE business_id = ? ORDER BY rewards.points ASC', [business_id]);
            return rows;
        }catch (err){
            console.error('getBusinessRewards error:', err);
            throw err;
        }
    }

    async getBusinessReward(business_id: string, reward_id: string){
        try{
            const rows : mysql.RowDataPacket[] = await this.query('SELECT * FROM rewards WHERE business_id = ? AND id = ?', [business_id, reward_id]);
            return rows && rows.length ? rows[0] : null;
        }catch (err){
            console.error('getBusinessReward error:', err);
            throw err;
        }
    }

    async removeBusinessRewards(business_id: string){
        try{
            const result: mysql.ResultSetHeader[][] = [];
            const rewards = await this.getBusinessRewards(business_id);
            for (const reward of rewards){
                result.push(await this.query('DELETE FROM rewards WHERE business_id = ? AND id = ?', [business_id, reward.id]));
            }
            return result;
        }catch (err){
            console.error('removeBusinessRewards error:', err);
            throw err;
        }
    }
}

export default new Database();

// For manual testing
// if (import.meta.main) {
//     const user_0 = {
//     id: 'user_0',
//     name: 'Test User',
//     email: 'test@example.com',
//     latitude: 0,
//     longitude: 0,
//     country: 'CA',
//     language: 'en'
//     }

//     const user_1 = {
//     id: 'user_1',
//     name: 'Test Business',
//     email: 'test@example.com',
//     latitude: 0,
//     longitude: 0,
//     country: 'ES',
//     language: 'es',
//     street_address: '123 Test St',
//     business_email: 'business@example.com',
//     business_phone: '1234567890',
//     image_url: 'http://example.com/image.jpg',
//     banner_url: 'http://example.com/banner.jpg'
//     }

//     const db = new Database();
//     // const result?: mysql.RowDataPacket[] = await db.getCustomers();
//     // console.log(result);
//     // await db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.language);
//     // await db.addCustomer(user_0.id, user_0.email, user_0.country, user_0.language);
//     // console.log("here");
//     const result = await db.removeCustomer(user_0.id);
//     console.log(result);
// }
