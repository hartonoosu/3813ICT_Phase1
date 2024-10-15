import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Channel schema
const channelSchema = new Schema({
  channelName: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Referencing User model
});

// Group schema
const groupSchema = new Schema({
  groupName: { type: String, required: true }, 
  channels: [channelSchema], // Embedding channel documents
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Referencing User model
});

export default model('Group', groupSchema);
