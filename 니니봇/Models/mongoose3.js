const { Schema, model } = require("mongoose");

let schema = new Schema({
  serverid: String,
  modlog: String,
  channelid: String,
});

module.exports = model("Schema3", schema);
