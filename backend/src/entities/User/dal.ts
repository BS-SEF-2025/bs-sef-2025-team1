import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { EntityNotFoundError } from "../../utils/errors/client";
import { isEntityExists } from "../../utils/firestore.utils";
import { PartialUser, User } from "./schema";
                                                                                
export const usersCollectionName = 'users';                                     
                                                                                
export class UserDal {                                                          
    private collection: CollectionReference<User>;                              
                                                                                
    constructor(private db: Firestore, private collectionName: string = usersCollectionName) {
        this.collection = this.db.collection(this.collectionName) as CollectionReference<User>;
    }                                                                           
                                                                                
    getUserById = async (id: string): Promise<User> => {                        
         const doc = (await this.collection.doc(id).get()).data();                
        await this.assertUserExists(id);                                        
        
        return doc as unknown as User;                                                           
    }
    
    getAllUsers = async (): Promise<User[]> => {
        const res = await this.collection.get();

        return res.docs.map((doc) => ({
            ...doc.data(),
        }));
    };
    
    addUser = async (user: User): Promise<User> => {
        await this.collection.add(user);

        return user;
    };
    
    updateUser = async (id: string, updates: PartialUser) => {
        const doc = this.collection.doc(id);

        await this.assertUserExists(id);
        
        await doc.update(updates);
    };
    
    deleteUser = async (id: string) => {
        const doc = this.collection.doc(id);
        
        await this.assertUserExists(id);

        await doc.delete();
    };
                                                                                
    private assertUserExists = async (id: string) => {                          
        const isExists = await isEntityExists(this.db, this.collectionName, id);
                                                                                
        if (!isExists) {                                                        
            throw new EntityNotFoundError(id, 'User');                          
        }                                                                       
    }                                                                           
}                                                                               