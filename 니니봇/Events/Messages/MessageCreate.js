const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../Models/mongoose");
const Schema2 = require("../../Models/mongoose2");
const map = new Map();

module.exports = {
  name: "messageCreate",

  async execute(message) {
    if (!message.guild || message.author.bot) return;
    var content = message.content.toLowerCase().replace(/ /g, "");
    content = content.replace(/[a-zA-Z0-9]/g, "");
    content = content.replace(
      /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g,
      ""
    );
    let foundInText = false;
    var texts;

    if (
      !(await Schema2.findOne({
        serverid: message.guild.id,
        channelid: message.channel.id,
      }))
    ) {
      await Schema.find({ serverid: message.guild.id })
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            if (content.includes(res[i].금지어.toLowerCase())) {
              foundInText = true;
              if (!texts) {
                texts = res[i].금지어;
              } else {
                texts = texts + "(이)랑 " + res[i].금지어;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (foundInText) {
      message.delete();
      message.channel.send({
        content: `${message.author} 뭐? ${texts}? 너 벌점`,
      });
    }

    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      if (map.has(message.author.id)) {
        const data = map.get(message.author.id);
        const { lastmsg, timer } = data;
        const diff = message.createdTimestamp - lastmsg.createdTimestamp;
        let msgs = data.msgs;
        if (diff > 2000) {
          clearTimeout(timer);
          data.msgs = 1;
          data.lastmsg = message;
          data.timer = setTimeout(() => {
            map.delete(message.author.id);
          }, 5000);
          map.set(message.author.id, data);
        } else {
          ++msgs;
          if (parseInt(msgs) === 5) {
            await message.member.timeout(60);
            message.channel.send({ content: `${message.author} 도배는 그만~` });
          } else {
            data.msgs = msgs;
            map.set(message.author.id, data);
          }
        }
      } else {
        let remove = setTimeout(() => {
          map.delete(message.author.id);
        }, 5000);
        map.set(message.author.id, {
          msgs: 1,
          lastmsg: message,
          timer: remove,
        });
      }
    }
  },
};
