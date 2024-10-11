import Group from '../models/Group.js';

export default async function(req, res) {
  try {
    // Create Group
    if (req.method === "POST" && req.url === "/create-group") {
      const { groupName } = req.body;

      // Validate request data
      if (!groupName) {
        console.error("Group name is missing in the request");
        return res.status(400).send({ error: "Group name is required" });
      }

      const newGroupName = groupName.trim();

      // Check if the group name already exists
      const groupExists = await Group.findOne({ groupName: { $regex: new RegExp(`^${newGroupName}$`, 'i') } });

      if (groupExists) {
        return res.status(400).send({ error: "Group name already exists" });
      }

      // Create new group
      const newGroup = new Group({
        groupName: newGroupName,
        channels: [],
        members: []
      });

      await newGroup.save();

      res.send(newGroup);  // Send the newly created group as a response

    // Delete Group
    } else if (req.method === "DELETE" && req.url === "/delete-group") {
      const { groupId } = req.body;

      // Validate request data
      if (!groupId) {
        console.error("Group ID is missing in the request");
        return res.status(400).send({ error: "Group ID is required" });
      }

      // Find and delete the group
      const deletedGroup = await Group.findByIdAndDelete(groupId);

      if (!deletedGroup) {
        return res.status(404).send({ error: "Group not found" });
      }

      res.send({ message: "Group deleted successfully" });
    } else {
      res.status(405).send({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ error: "Internal server error" });
  }
}
