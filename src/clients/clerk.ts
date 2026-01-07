
import { createClerkClient } from '@clerk/backend'
import * as dotenv from 'dotenv';

/**
 * Clerk client for user management.
 */
class Clerk {
    #clerkClient: ReturnType<typeof createClerkClient>;
    constructor(){
        dotenv.config();
        this.#clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    }
    
    //user modifications

    async setUserType(userId: string, userType: string)  {
        try {
            await this.#clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: {
                    userType: userType,
                },                
            });
            return userType;
        } catch (error) {
            console.error("setUserType error:", error);
            throw error;
        }        
    }

    async deleteUser(userId: string)  {     
        try {
            await this.#clerkClient.users.deleteUser(userId);
            return userId;
        } catch (error) {
            console.error("deleteUser error:", error);
            throw error;
        }
    }
    
}

export default new Clerk();

// const clerk = new Clerk();
// const result = clerk.setUserType("user_363Tl64h2sSxQH3jKLIWBPpZEYg", "customer");
// result.then((data)=>{console.log(data.emailAddresses)});


// For manual testing
// if (import.meta.main) {
//     const clerk = new Clerk();
//     const promise =clerk.deleteUser("user_37wHsTK5fR8R0tLDlibiOPEyWxu");
//     promise.then(() => {console.log("user deleted")});
// }