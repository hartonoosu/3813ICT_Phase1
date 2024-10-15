import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userid: { 
    type: String, 
    required: true, 
    unique: true // Ensure the user ID is unique
  },
  pwd: { 
    type: String, 
    required: true 
  },  
  username: { 
    type: String, 
    required: true, 
    unique: true // Ensure the username is unique
  },
  useremail: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Basic email validation regex
      },
      message: props => `${props.value} is not a valid email!`
    },
    required: [true, 'User email required']
  },
  usergroup: { 
    type: String, 
    default: 'default_group' //set a default group if not provided
  },
  userrole: { 
    type: String, 
    default: 'user' // Default role is 'user'
  },
  avatar: {
    type: String, 
    default: '' 
  }
});

export default model('User', userSchema);
