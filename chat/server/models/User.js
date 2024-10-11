import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userid: { type: String, required: true },
  pwd: { type: String, required: true },  // Change 'password' to 'pwd'
  username: { type: String, required: true },
  useremail: String,
  usergroup: String,
  userrole: String
});

export default model('User', userSchema);
