const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("추방")
    .setDescription("이 서버에서 유저를 추방합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
        option.setName("대상")
        .setDescription("추방할 대상")
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName("사유")
        .setDescription("추방 사유")
        ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const user = options.getUser("대상");
        const reason = options.getString("사유");

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
        .setTitle(`${user.username} 을 추방할 권한이 없어~`)
        .setColor(0xc723b)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
        .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        await member.kick(reason);

        const embed = new EmbedBuilder()
        .setTitle(`${user} 너 "${reason}" 사유로 추방`)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
        .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    }
}