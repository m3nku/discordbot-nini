const { Client } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await mongoose.connect(
      "",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    if (mongoose.connect) {
      console.log("mongoose loaded");
    }

    console.log(`${client.user.username} is now online`);
  },
};
