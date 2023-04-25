const {
  EmbedBuilder,
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ActivityType,
  Collection,
  AuditLogEvent,
} = require("discord.js");
const mongoose = require("mongoose");
const Schema3 = require("./Models/mongoose3");

const { handleLogs } = require("./Handlers/handleLogs");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const logs = require("discord-logs");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

logs(client, {
  debug: true,
});

client.once("ready", () => {
  console.log("ready");

  client.user.setActivity("사는 이야기", { type: ActivityType.Watching });
});

client.commands = new Collection();

module.exports = client;

client
  .login(
    ""
  )
  .then(() => {
    handleLogs(client);
    loadEvents(client);
    loadCommands(client);
  });
