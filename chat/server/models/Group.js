import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const channelSchema = new Schema({
  channelId: { type: String, required: true },
  channelName: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  channels: [channelSchema],
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


export default model('Group', groupSchema);
