const {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("청소")
    .setDescription("지정된 채널의 텍스트 n개 지우기")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("개수")
        .setDescription("지울 텍스트 개수")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("대상")
        .setDescription("특정 대상의 텍스트만 지우기")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { channel, options } = interaction;

    const amount = options.getInteger("개수");
    const target = options.getUser("대상");

    const messages = await channel.messages.fetch();

    if (target) {
      let i = 0;
      const filtered = [];

      messages.filter((msg) => {
        if (msg.author.id === target.id && amount > i) {
          filtered.push(msg);
          i++;
        }
      });

      interaction.channel.bulkDelete(filtered, true).then((messages) => {
        interaction.editReply({
          content: `${target} 니가 쓴 글 ${messages.size}개 지웠어~`,
        });
      });
    } else {
      interaction.channel.bulkDelete(amount, true).then((messages) => {
        interaction.editReply({ content: `글 ${messages.size}개 지웠어~` });
      });
    }
  },
};
