
import { createClerkClient } from '@clerk/backend'
import dotenv from 'dotenv';
let clerkClient;
class Clerk {
    constructor(){
        dotenv.config();
        clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    }
    
    //user modification

    async createUser(email, userType)  {
        try {
            await clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: {
                    userType: userType,
                },
            });
        } catch (err) {
            console.error('createUser error:', err);
            throw err;
        }
    }

    async setUserType(userId, userType)  {
        await clerkClient.users.updateUserMetadata(userId, {
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