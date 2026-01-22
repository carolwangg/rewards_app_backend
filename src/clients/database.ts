import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

/**
 * Database client for MySQL interactions.
 * @author carolwangg
 * @version v0.1.0
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
    async addUser(id: string, userType: string, email: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('INSERT INTO user_types (id, user_type, email) VALUES (?, ?, ?)', [id, userType, email]);
            return result;
        }catch (err){
            console.error('addUser error:', err);
            throw err;
        }
    }

    async removeUser(id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('DELETE FROM user_types WHERE id = ?', [id]);
            return result;
        }catch (err){
            console.error('removeUser error:', err);
            throw err;
        }
    }

    async getUsers(){
        try{
            const rows : mysql.RowDataPacket[] = await this.query<mysql.RowDataPacket[]>('SELECT * FROM user_types');
            return rows;
        }catch (err){
            console.error('getUsers error:', err);
            throw err;
        }
    }

    async getUserType(id: string){
        try{
            const result: mysql.RowDataPacket[] = await this.query<mysql.RowDataPacket[]>('SELECT user_type FROM user_types WHERE id = ?', [id]);
            return result.length == 1 ? result[0].user_type : null;
        }catch (err){
            console.error('getUserType error:', err);
            throw err;
        }
    }

    async getUserTypeEmail(email: string){
        try{
            const result: mysql.RowDataPacket[] = await this.query<mysql.RowDataPacket[]>('SELECT user_type FROM user_types WHERE email = ?', [email]);
            return result.length == 1 ? result[0].user_type : null;
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

    async addCustomer(id: string, email: string, country: string, image_url: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query<mysql.ResultSetHeader[]>('INSERT INTO customers (id, email, country, image_url) VALUES (?, ?, ?, ?)', [id, email, country, image_url]);
            return result;
        }catch (err){
            console.error('addCustomer error:', err);
            throw err;
        }
    }

    async updateCustomer(customer_id: string, email: string, country: string, name: string, longitude: number, latitude: number, street_address: string){
        try{
            const command = "UPDATE `customers` SET `email` = ?, `country` = ?, `name` = ?, `longitude` = ?, `latitude` = ?, `street_address` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [email, country, name, longitude, latitude, street_address, customer_id]);
            return result;
        }catch (err){
            console.error('updateCustomer error:', err);
            throw err;
        }
    }

    async updateCustomerLocation(customer_id: string, latitude: number, longitude: number, street_address: string){
        try{
            const command = "UPDATE `customers` SET `latitude` = ?, `longitude` = ?, `street_address` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [latitude, longitude, street_address, customer_id]);
            return result;
        }catch (err){
            console.error('updateCustomerLocation error:', err);
            throw err;
        }
    }

    async updateCustomerImage(customer_id: string, image_url: string){
        try{
            const command = "UPDATE `customers` SET `image_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [image_url, customer_id]);
            return result;
        }catch (err){
            console.error('updateCustomerImage error:', err);
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

    async addBusiness(id: string, email: string, country: string, name: string, image_url: string, banner_url: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('INSERT INTO businesses (id, email, country, name, rating, image_url, banner_url) VALUES (?, ?, ?, ?, 5, ?, ?)', [id, email, country, name, image_url, banner_url]);
            return result;
        }catch (err){
            console.error('addBusiness error:', err);
            throw err;
        }
    }

    async updateBusiness(business_id: string, email: string, country: string, longitude: number, latitude: number, street_address: string, 
        business_email: string, business_phone: string, name: string, description: string){
        try{
            const command = "UPDATE `businesses` SET `email` = ?, `country` = ?, `longitude` = ?, `latitude` = ?, `street_address` = ?, `business_email` = ?, `business_phone` = ?, `name` = ?, `description` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [email, country, longitude, latitude, street_address, business_email, business_phone, name, description, business_id]);
            console.log("result:"+JSON.stringify(result));
            return result;
        }catch (err){
            console.error('updateBusiness error:', err);
            throw err;
        }
    }

    async updateBusinessImage(business_id: string, image_url: string){
        try{
            const command = "UPDATE `businesses` SET `image_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [image_url, business_id]);
            return result;
        }catch (err){
            console.error('updateBusinessImage error:', err);
            throw err;
        }
    }


    async updateBusinessBanner(business_id: string, banner_url: string){
        try{
            const command = "UPDATE `businesses` SET `banner_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [banner_url, business_id]);
            return result;
        }catch (err){
            console.error('updateBusinessBanner error:', err);
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

    async getRewardsInRadius(latitude: number, longitude: number, radius: number){
        try{
            const command = "SELECT rewards.* FROM rewards JOIN businesses ON rewards.business_id = businesses.id WHERE \
                    (POWER(? - businesses.latitude, 2) + POWER(? - businesses.longitude, 2)) < POWER(?, 2)"
            const rows : mysql.RowDataPacket[] = await this.query(command, [latitude, longitude, radius]);
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

    async addReward(id: string, name: string, description: string, image_url: string, points: number, business_id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('INSERT INTO rewards (id, name, description, image_url, points, business_id) VALUES (?, ?, ?, ?, ?, ?)', [id, name, description, image_url, points, business_id]);
            return result;
        }catch (err){
            console.error('addReward error:', err);
            throw err;
        }
    }

    async updateReward(id: string, name: string, description: string, points: number){
        try{
            const command = "UPDATE `rewards` SET `name` = ?, `description` = ?, `points` = ? WHERE `id` = ?"
            const result: mysql.ResultSetHeader[] = await this.query(command, [name, description, points, id]);
            return result;
        }catch (err){
            console.error('updateReward error:', err);
            throw err;
        }
    }

    async updateRewardImage(reward_id: string, image_url: string){
        try{
            const command = "UPDATE `rewards` SET `image_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [image_url, reward_id]);
            return result;
        }catch (err){
            console.error('updateRewardImage error:', err);
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

    async updateCard(card_id: string, name: string, description: string, contact_info: string, colour: string, textColour: string){
        try{
            const command = "UPDATE `cards` SET `name` = ?, `description` = ?, `contact_info` = ?, `colour` = ?, `text_colour` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [name, description, contact_info, colour, textColour, card_id]);
            return result;
        }catch (err){
            console.error('updateCard error:', err);
            throw err;
        }
    }

    async updateCardImage(card_id: string, image_url: string){
        try{
            const command = "UPDATE `cards` SET `image_url` = ? WHERE `id` = ?";
            const result: mysql.ResultSetHeader[] = await this.query(command, [image_url, card_id]);
            return result;
        }catch (err){
            console.error('updateCardImage error:', err);
            throw err;
        }
    }

    async removeCard(card_id: string){
        try{
            const result: mysql.ResultSetHeader[] = await this.query('DELETE FROM cards WHERE id = ?', [card_id]);
            return result;
        }catch (err){
            console.error('removeCard error:', err);
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
            const rows : mysql.RowDataPacket[] = await this.query('SELECT id, name, description, contact_info, points, colour FROM cards INNER JOIN customer_cards WHERE customer_id = ? AND card_id = ?', [customer_id, card_id]);
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

    async clearAllTables(){
        try {
            await this.query("ALTER TABLE customer_cards DROP FOREIGN KEY customer_cards_to_cards");
            await this.query("ALTER TABLE customer_cards DROP FOREIGN KEY customer_cards_to_customers");
            await this.query("ALTER TABLE rewards DROP FOREIGN KEY rewards_to_businesses");
            await this.query("ALTER TABLE cards DROP FOREIGN KEY cards_to_businesses");

            await this.query('TRUNCATE customer_cards');
            await this.query('TRUNCATE cards');
            await this.query('TRUNCATE rewards');
            await this.query('TRUNCATE businesses');
            await this.query('TRUNCATE customers');
            await this.query('TRUNCATE user_types');

            await this.query("ALTER TABLE `reward-app`.`customer_cards` \
            ADD CONSTRAINT `customer_cards_to_cards`\
            FOREIGN KEY (`card_id`)\
            REFERENCES `reward-app`.`cards` (`id`)\
            ON DELETE NO ACTION\
            ON UPDATE NO ACTION;");

            await this.query("ALTER TABLE `reward-app`.`customer_cards` \
            ADD CONSTRAINT `customer_cards_to_customers`\
            FOREIGN KEY (`customer_id`)\
            REFERENCES `reward-app`.`customers` (`id`)\
            ON DELETE NO ACTION\
            ON UPDATE NO ACTION;");
            
            await this.query(
            "ALTER TABLE `reward-app`.`rewards` \
            ADD CONSTRAINT `rewards_to_businesses`\
            FOREIGN KEY (`business_id`)\
            REFERENCES `reward-app`.`businesses` (`id`)\
            ON DELETE NO ACTION\
            ON UPDATE NO ACTION;");

            await this.query(
            "ALTER TABLE `reward-app`.`cards` \
            ADD CONSTRAINT `cards_to_businesses`\
            FOREIGN KEY (`id`)\
            REFERENCES `reward-app`.`businesses` (`id`)\
            ON DELETE NO ACTION\
            ON UPDATE NO ACTION;");
            
        } catch (err) {
            console.error('clearAllTables error:', err);
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
//     }

//     const user_1 = {
//     id: 'user_1',
//     name: 'Test Business',
//     email: 'test@example.com',
//     latitude: 0,
//     longitude: 0,
//     country: 'ES',
//     street_address: '123 Test St',
//     business_email: 'business@example.com',
//     business_phone: '1234567890',
//     image_url: 'http://example.com/image.jpg',
//     banner_url: 'http://example.com/banner.jpg'
//     }

//     const user_2 = {
//     id: 'user_2',
//     name: 'Test User',
//     email: 'test@example.com',
//     latitude: 0,
//     longitude: 0,
//     country: 'CA',
//     }

//     const user_3 = {
//     id: 'user_3',
//     name: 'Test Business',
//     email: 'test@example.com',
//     latitude: 0,
//     longitude: 0,
//     country: 'ES',
//     street_address: '123 Test St',
//     business_email: 'business@example.com',
//     business_phone: '1234567890',
//     image_url: 'http://example.com/image.jpg',
//     banner_url: 'http://example.com/banner.jpg'
//     }

//     const card_1 = {
//     id: 'user_1',
//     name: 'Test Card',
//     description: 'Test Description',
//     contact_info: 'Test Contact Info',
//     image_url: 'http://example.com/card.jpg',
//     colour: 'ff0000',
//     }

//     const card_0 = {
//     customer_id: 'user_0',
//     card_id: 'user_1',
//     points: 0
//     }

//     const reward_1 = {
//     id: '1',
//     name: 'Test Reward',
//     description: 'Test Description',
//     image_url: 'http://example.com/reward.jpg',
//     points: 100,
//     business_id: 'user_1'
//     }

    // const db = new Database();
//     // db.clearAllTables();
//     // await db.addCustomer(user_0.id, user_0.email, user_0.country);
//     // await db.addCustomer(user_2.id, user_2.email, user_2.country);
//     // await db.addBusiness(user_1.id, user_1.email, user_1.country);
//     // await db.addBusiness(user_3.id, user_3.email, user_3.country);
//     // await db.addCard(user_1.id, user_1.name);
//     // await db.addCard(user_3.id, user_3.name);
//     // await db.addCustomerCard(user_0.id, user_3.id);
//     // await db.addCustomerCard(user_0.id, user_1.id);
//     // console.log(await db.getCustomerCards(card_0.customer_id));
// }
