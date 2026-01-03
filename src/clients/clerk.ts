
import { ClerkClient, createClerkClient } from '@clerk/backend'
import dotenv from 'dotenv';
class Clerk {
    #clerkClient: ClerkClient;
    constructor(){
        dotenv.config();
        this.#clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    }
    
    //user modifications

    async setUserType(userId: string, userType: string)  {
        await this.#clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                userType: userType,
            },
        });
    }
    
}

export default new Clerk();

// const clerk = new Clerk();
// const result = clerk.setUserType("user_363Tl64h2sSxQH3jKLIWBPpZEYg", "customer");
// result.then((data)=>{console.log(data.emailAddresses)});