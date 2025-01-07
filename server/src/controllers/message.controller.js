import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch {
    console.log("Error getting users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params.id;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.log("Error getting messages:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //* todo : realtime function goes here with socket.io

    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
