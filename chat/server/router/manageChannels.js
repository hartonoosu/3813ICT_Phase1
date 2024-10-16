import Group from '../models/Group.js';

export default async function(req, res) {
  try {
    // Handle POST request for creating a channel
    if (req.method === "POST" && req.url === "/create-channel") {
      const { groupId, channelName } = req.body;

      // Validate request data
      if (!groupId || !channelName) {
        console.error("Group ID or Channel name is missing in the request");
        return res.status(400).send({ error: "Group ID and Channel name are required" });
      }

      // Find the group by ID
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(404).send({ error: "Group not found" });
      }

      // Check if the channel name already exists in the group
      if (group.channels.some(channel => channel.channelName.toLowerCase() === channelName.trim().toLowerCase())) {
        return res.status(400).send({ error: "Channel name already exists in this group" });
      }

      // Create a new channel
      const newChannel = {
        channelName: channelName.trim().toLowerCase(),
        members: []
      };

      // Add the new channel to the group
      group.channels.push(newChannel);

      // Save the updated group
      await group.save();

      // Send the newly created channel (including _id) as a response
      const createdChannel = group.channels[group.channels.length - 1];
      res.send(createdChannel);

    } else if (req.method === "DELETE" && req.url.startsWith("/delete-channel")) {
      const { groupId, channelId } = req.query;

      if (!groupId || !channelId) {
        return res.status(400).send({ error: "Group ID and Channel ID are required" });
      }

      // Find the group by ID
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(404).send({ error: "Group not found" });
      }

      // Filter out the channel with the specified channelId
      const updatedChannels = group.channels.filter(channel => channel._id.toString() !== channelId);

      if (updatedChannels.length === group.channels.length) {
        return res.status(404).send({ error: "Channel not found" });
      }

      // Update the group's channels
      group.channels = updatedChannels;

      // Save the updated group
      await group.save();

      res.send({ message: "Channel deleted successfully" });
    } else {
      res.status(405).send({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ error: "Internal server error" });
  }
}
