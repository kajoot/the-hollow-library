const Message = require("../models/Message");
const User = require("../models/User");
const axios = require("axios");

// AI TOXICITY CHECK - Call Python Flask API
const checkMessageToxicity = async (text) => {
  try {
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5000";
    const response = await axios.post(`${AI_SERVICE_URL}/predict`, {
      text: text,
    });

    const prediction = response.data.prediction;
    // prediction: 0 = negative/toxic, 1 = neutral, 2 = positive
    // Return true if message is toxic (prediction === 0)
    return prediction === 0;
  } catch (error) {
    console.error("Error checking toxicity:", error.message);
    // If AI service is down, allow message (fail-safe)
    return false;
  }
};

// GET ALL MESSAGES
exports.getMessages = async (req, res, next) => {
  try {
    const { house = "general" } = req.query;

    const messages = await Message.find({ house })
      .populate("author", "username avatar house")
      .populate("replies.authorId", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// CREATE MESSAGE - WITH TOXICITY CHECK
exports.createMessage = async (req, res, next) => {
  try {
    const { content, house = "general" } = req.body;
    const userId = req.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Message content is required" });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message too long (max 1000 characters)" });
    }

    // ✅ CHECK IF MESSAGE IS TOXIC
    const isToxic = await checkMessageToxicity(content);
    
    if (isToxic) {
      // Message is toxic - reject and notify user
      return res.status(400).json({ 
        error: "Your message was flagged as toxic and violates our community guidelines",
        flagged: true,
        reason: "toxic"
      });
    }

    const message = new Message({
      author: userId,
      content,
      house,
    });

    await message.save();
    await message.populate("author", "username avatar house");

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// ADD REPLY TO MESSAGE - WITH TOXICITY CHECK
exports.addReply = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Reply content is required" });
    }

    // ✅ CHECK IF REPLY IS TOXIC
    const isToxic = await checkMessageToxicity(content);
    
    if (isToxic) {
      // Reply is toxic - reject and notify user
      return res.status(400).json({ 
        error: "Your reply was flagged as toxic and violates our community guidelines",
        flagged: true,
        reason: "toxic"
      });
    }

    const user = await User.findById(userId);
    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $push: {
          replies: {
            authorId: userId,
            content,
          },
        },
      },
      { new: true }
    ).populate("author", "username avatar");

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// LIKE MESSAGE
exports.likeMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if already liked
    if (message.likes.includes(userId)) {
      // Remove like
      message.likes = message.likes.filter((id) => !id.equals(userId));
    } else {
      // Add like
      message.likes.push(userId);
    }

    await message.save();
    res.json({ likes: message.likes.length });
  } catch (error) {
    next(error);
  }
};

// DELETE MESSAGE (author only)
exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (!message.author.equals(userId)) {
      return res.status(403).json({ error: "Not authorized to delete" });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
