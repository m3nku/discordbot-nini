const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("업데이트")
    .setDescription("봇 상태메시지 업데이트")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("활성")
        .setDescription("봇 활성 업데이트")
        .addStringOption((option) =>
          option
            .setName("타입")
            .setDescription("활성 선택")
            .setRequired(true)
            .addChoices(
              { name: "Playing", value: "Playing" },
              { name: "Streaming", value: "Streaming" },
              { name: "Listening", value: "Listening" },
              { name: "Watching", value: "Watching" },
              { name: "Competing", value: "Competing" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("활성상태")
            .setDescription("활성 설명")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("상태")
        .setDescription("봇 상태 업데이트")
        .addStringOption((option) =>
          option
            .setName("타입")
            .setDescription("상태 선택")
            .setRequired(true)
            .addChoices(
              { name: "Online", value: "online" },
              { name: "Idle", value: "idle" },
              { name: "Do not disturb", value: "dnd" },
              { name: "Invisible", value: "invisible" }
            )
        )
    ),

  async execute(interaction, client) {
    const { options } = interaction;

    const sub = options.getSubcommand(["활성", "상태"]);
    const type = options.getString("타입");
    const activity = options.getString("활성상태");

    try {
      switch (sub) {
        case "활성":
          switch (type) {
            case "Playing":
              client.user.setActivity(activity, { type: ActivityType.Playing });
              break;
            case "Streaming":
              client.user.setActivity(activity, {
                type: ActivityType.Streaming,
              });
              break;
            case "Listening":
              client.user.setActivity(activity, {
                type: ActivityType.Listening,
              });
              break;
            case "Watching":
              client.user.setActivity(activity, {
                type: ActivityType.Watching,
              });
              break;
            case "Competing":
              client.user.setActivity(activity, {
                type: ActivityType.Competing,
              });
              break;
          }
        case "상태":
          client.user.setPresence({ status: type });
          break;
      }
    } catch (err) {
      console.log(err);
    }

    const embed = new EmbedBuilder()
      .setTitle(`내 ${sub} 을(를) **${type}** 로 변경했어.`)
      .setFooter({ text: "욕심니니", iconURL: "https://ifh.cc/g/LYrpSv.png" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
