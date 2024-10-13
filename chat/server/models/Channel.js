const { Schema, model } = require('mongoose');

const channelSchema = new Schema({
  channelName: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

const Channel = model('Channel', channelSchema);
module.exports = Channel;
