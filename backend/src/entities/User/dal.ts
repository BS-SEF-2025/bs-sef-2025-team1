import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { EntityNotFoundError } from "../../utils/errors/client";
import { isEntityExists, convertTimestampsToDates } from "../../utils/firestore.utils";
import { User, RegisterUser, UserResponse } from "./schema";

export const usersCollectionName = 'users';

export class UserDal {
    private collection: CollectionReference<Omit<User, 'id'>>;

    constructor(private db: Firestore, private collectionName: string = usersCollectionName) {
        this.collection = this.db.collection(this.collectionName) as CollectionReference<User>;
    }

    getUserById = async (id: string): Promise<User> => {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            throw new EntityNotFoundError(id, 'User');
        }
        return convertTimestampsToDates({ ...doc.data(), id: doc.id }) as User;
    }

    getUserResponseById = async (id: string): Promise<UserResponse> => {
        const user = await this.getUserById(id);
        const { password, ...userResponse } = user;
        return userResponse;
    }

    getUserByEmail = async (email: string): Promise<User | null> => {
        const query = this.collection.where('email', '==', email);
        const res = await query.get();

        if (res.empty) {
            return null;
        }

        const doc = res.docs[0]!;
        return convertTimestampsToDates({ ...doc.data(), id: doc.id }) as User;
    }

    getAllUsers = async (): Promise<User[]> => {
        const res = await this.collection.get();
        return res.docs.map((doc) => convertTimestampsToDates({
            ...doc.data(),
            id: doc.id,
        })) as User[];
    };

    addUser = async (userData: RegisterUser): Promise<User> => {
        // Check if user already exists
        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const now = new Date();
        const user: Omit<User, 'id'> = {
            ...userData,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await this.collection.add(user);

        return { ...user, id: docRef.id } as User;
    };

    updateUser = async (id: string, updates: Partial<User>) => {
        const doc = this.collection.doc(id);
        await this.assertUserExists(id);

        await doc.update({
            ...updates,
            updatedAt: new Date(),
        });
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