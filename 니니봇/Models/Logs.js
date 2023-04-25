const { Schema, model } = require("mongoose");

let schema = new Schema({
  serverid: String,
  금지어: String,
});

module.exports = model("Schema", schema);
