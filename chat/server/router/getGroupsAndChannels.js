import Group from '../models/Group.js';

export default async function(req, res) {
    try {
        // Find all groups in the database and populate user data
        const groups = await Group.find()
            .populate({ path: 'members', select: 'username' }) // Populating group members
            .populate({ path: 'channels.members', select: 'username' }); // Populating channel members

        res.send(groups);  // Send all groups and channels as the response
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
