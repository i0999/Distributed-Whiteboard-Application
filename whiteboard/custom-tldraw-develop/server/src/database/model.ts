import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    uuid: String,
    drawObjects: Object,
});

export const Room = mongoose.model('Room', roomSchema);
