import mongoose from 'mongoose';
import { RoomRepository } from './repository';

export class RepositoryFactory {
    static DATABASE_URL = process.env.DATABASE_URL || '';

    static async getRoomRepository() {
        await mongoose.connect(RepositoryFactory.DATABASE_URL);
        return new RoomRepository();
    }
}
