import User from '../models/User.js';

export default async function(req, res) {
  try {
    const { username } = req.params;

    // Validate request data
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Find and delete the user by username
    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
}
