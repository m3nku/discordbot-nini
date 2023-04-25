const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("영구추방")
    .setDescription("이 서버에서 유저를 영구적으로 추방합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
        const reason = options.getString("사유") || "사유 없음";

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
        .setTitle(`${user.username} 을 영구추방할 권한이 없어~`)
        .setColor(0xc723b)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
        .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        await member.ban({ reason });

        const embed = new EmbedBuilder()
        .setTitle(`${user} 너 "${reason}" 사유로 영구추방`)
        .setImage("https://ifh.cc/g/LYrpSv.png")
        .setColor(0x5fb041)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
        .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    }
}