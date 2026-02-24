const ContactMsg = require("../models/contactMsgModel");

exports.getAllContactMsgs = async (req, res) => {
  try {
    const messages = await ContactMsg.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All contact messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getContactMsgById = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await ContactMsg.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact message fetched successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addContactMsg = async (req, res) => {
  const { name, phone, email, message } = req.body;
  try {
    const newMessage = await ContactMsg.create({ name, phone, email, message });
    res.status(201).json({
      success: true,
      message: "Contact message created successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteContactMsg = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await ContactMsg.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
