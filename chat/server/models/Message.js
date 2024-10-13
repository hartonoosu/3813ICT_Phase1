import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  messageId: { type: String, required: true },
  channelId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default model('Message', messageSchema);
