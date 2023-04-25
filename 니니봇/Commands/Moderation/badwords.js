const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Schema = require("../../Models/mongoose");
const Schema2 = require("../../Models/mongoose2");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("금지어")
    .setDescription("금지어 명령어")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("추가")
        .setDescription("이 서버의 금지어 추가")
        .addStringOption((option) =>
          option
            .setName("추가할-금지어")
            .setDescription("추가할 금지어")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("제거")
        .setDescription("이 서버의 금지어 제거")
        .addStringOption((option) =>
          option
            .setName("제거할-금지어")
            .setDescription("제거할 금지어")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("채널비적용")
        .setDescription("금지어가 적용되지 않는 서버를 추가합니다.")
        .addChannelOption((option) =>
          option
            .setName("비적용채널")
            .setDescription("비적용할 채널")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("채널적용")
        .setDescription("금지어가 적용되지 않는 서버를 다시 적용되게 합니다.")
        .addChannelOption((option) =>
          option
            .setName("적용채널")
            .setDescription("적용할 채널")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { options, guildId, user, member } = interaction;
    const sub = options.getSubcommand([
      "추가",
      "제거",
      "채널비적용",
      "채널적용",
    ]);
    const add = options.getString("추가할-금지어");
    const del = options.getString("제거할-금지어");
    const addchannel = options.getChannel("비적용채널");
    const delchannel = options.getChannel("적용채널");

    const embed = new EmbedBuilder();

    switch (sub) {
      case "추가":
        const getwords = await Schema.findOne({
          serverid: guildId,
          금지어: add,
        });
        if (getwords) {
          interaction.reply({
            embeds: [
              embed
                .setTitle("이미 있는 금지어")
                .setDescription(`\`${add}\`은/는 금지어 리스트에 이미 있어`)
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Red")
                .setTimestamp(),
            ],
          });
        } else {
          const newData = new Schema({
            serverid: guildId,
            금지어: add,
          });
          newData.save();
          interaction.reply({
            embeds: [
              embed
                .setTitle("금지어 추가 완료")
                .setDescription(`\`${add}\`을/를 금지어 리스트에 추가 했어`)
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Green")
                .setTimestamp(),
            ],
          });
        }
        break;
      case "제거":
        const getwords2 = await Schema.findOne({
          serverid: guildId,
          금지어: del,
        });
        if (getwords2) {
          await Schema.findOneAndDelete({ serverid: guildId, 금지어: del });
          interaction.reply({
            embeds: [
              embed
                .setTitle("금지어 제거 완료")
                .setDescription(`\`${del}\`을/를 금지어 리스트에서 제거했어`)
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Green")
                .setTimestamp(),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              embed
                .setTitle("금지어 제거 실패")
                .setDescription(`\`${del}\`은/는 금지어에 없어`)
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Red")
                .setTimestamp(),
            ],
          });
        }
        break;
      case "채널비적용":
        const aleadychannel = await Schema2.findOne({
          serverid: guildId,
          channelid: addchannel.id,
        });
        if (aleadychannel) {
          interaction.reply({
            embeds: [
              embed
                .setTitle("이미 비적용중인 채널")
                .setDescription(
                  `${addchannel}은/는 이미 금지어가 적용되지 않아.`
                )
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Red")
                .setTimestamp(),
            ],
          });
        } else {
          const newData = new Schema2({
            serverid: guildId,
            channelid: addchannel.id,
          });
          newData.save();
          interaction.reply({
            embeds: [
              embed
                .setTitle("채널 비적용 완료")
                .setDescription(
                  `${addchannel}은/는 이제부터 금지어가 적용되지 않아.`
                )
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Green")
                .setTimestamp(),
            ],
          });
        }
        break;
      case "채널적용":
        const aleadychannel2 = await Schema2.findOne({
          serverid: guildId,
          channelid: delchannel.id,
        });
        if (aleadychannel2) {
          await Schema2.findOneAndDelete({
            serverid: guildId,
            channelid: delchannel.id,
          });
          interaction.reply({
            embeds: [
              embed
                .setTitle("채널 적용 완료")
                .setDescription(`${delchannel}은/는 이제부터 금지어가 적용돼.`)
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Green")
                .setTimestamp(),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              embed
                .setTitle("채널 적용 실패")
                .setDescription(
                  `${delchannel}은/는 이미 금지어가 적용되는 중이야.`
                )
                .setFooter({
                  text: "욕심니니",
                  iconURL: "https://ifh.cc/g/LYrpSv.png",
                })
                .setColor("Red")
                .setTimestamp(),
            ],
          });
        }
        break;
    }
  },
};
