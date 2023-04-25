const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
  Options,
} = require("discord.js");
const logSchema = require("../../Models/Logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("로그-설정")
    .setDescription("로그 채널 설정")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option.setName("채널").setDescription("로그 채널").setRequired(false)
    ),

  async execute(interaction) {
    const { channel, guildId, options } = interaction;

    const logChannel = options.getChannel("채널") || channel;
    const embed = new EmbedBuilder();

    const data = await logSchema.findOne({ Guild: guildId });

    if (!data) {
      const newData = new logSchema({
        Guild: guildId,
        Channel: logChannel.id,
      });
      newData.save();

      embed
        .setDescription("데이터베이스에 데이터가 성공적으로 전송됨.")
        .setColor("Green")
        .setTimestamp();
    } else if (data) {
      await logSchema.findOneAndDelete({ Guild: guildId });
      const newData = new logSchema({
        Guild: guildId,
        Channel: logChannel.id,
      });
      newData.save();

      embed
        .setDescription("데이터베이스에 새로운 데이터가 성공적으로 전송됨.")
        .setColor("Green")
        .setTimestamp();
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
