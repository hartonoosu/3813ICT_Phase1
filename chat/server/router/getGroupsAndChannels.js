import Group from '../models/Group.js';

export default async function(req, res) {
    try {
        // Find all groups in the database
        const groups = await Group.find();
        res.send(groups);  // Send all groups and channels as the response
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
