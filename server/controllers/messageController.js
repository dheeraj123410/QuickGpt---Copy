/*import imagekit from "../configs/imageKit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import openai from "../configs/openai.js";

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You do not have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Gemini Response (OpenAI Compatible API)
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Image Generation Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits.",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const encodedPrompt = encodeURIComponent(prompt)
    //construct imagekit AI generation URI

    const generatedImageUrl =`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`
    // Trigger generation by fetching from imageKit

    const aiImageResponse= await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

    // Convert to 64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`; 
    //upload to imagekit media library
    const uploadResponse = await imagekit.upload({
  file: base64Image,
  fileName: `${Date.now()}.png`,
  folder: "quickgpt",
});

const reply = {
  role: "assistant",
  content: uploadResponse.url,
  timestamp: Date.now(),
  isImage: true,
  isPublished,
};

chat.messages.push(reply);

await chat.save();

await User.updateOne(
  { _id: userId },
  { $inc: { credits: -2 } }
);

return res.json({
  success: true,
  reply,
});
   
*/
import imagekit from "../configs/imageKit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import openai from "../configs/openai.js";

// ================= TEXT MESSAGE =================
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You do not have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // AI Response
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= IMAGE MESSAGE =================
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits.",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save user prompt
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Generate Image URL
    const encodedPrompt = encodeURIComponent(prompt);

    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    // Trigger ImageKit AI Generation
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Convert to Base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload generated image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    // Save image message
    chat.messages.push(reply);

    await chat.save();

    // Deduct credits
    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -2 } }
    );

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};