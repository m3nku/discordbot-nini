const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("영구추방해제")
    .setDescription("영구추방을 해제합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("대상")
        .setDescription("영구추방 해제를 할 대상")
        .setRequired(true)
        ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const userId = options.getString("대상");

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
            .setTitle(`${userId} 너 추방해제`)
            .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
            .setColor(0x5fb041)
            .setTimestamp();

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
            .setTitle(`${userId} 넌 누구니?`)
            .setColor(0xc723b)
            .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
            .setTimestamp();

            await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true
            });
        }
    }
}