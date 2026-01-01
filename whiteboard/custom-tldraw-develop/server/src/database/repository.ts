import { randomUUID } from 'crypto';
import { Room } from './model';

export class RoomRepository {
    async getRoomById(uuid: string) {
        const room = await Room.findOne({ uuid: uuid }, 'uuid drawObjects');
        console.log(room);
        return room;
    }

    async createRoom(uuid?: string) {
        if (!uuid) uuid = randomUUID();
        try {
            const newRoom = await Room.create({
                uuid: uuid,
                drawObjects: {},
            });
            return newRoom;
        } catch (error) {
            console.error('Failed to create a new room', error);
            throw error;
        }
    }

    async updateRoom(uuid: string, drawObjects: Object) {
        try {
            await Room.findOneAndUpdate(
                { uuid: uuid },
                { drawObjects: drawObjects }
            );
        } catch (error) {
            console.error('Failed to update room', uuid, error);
            throw error;
        }
    }
}
