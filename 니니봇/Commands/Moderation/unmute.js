const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("언뮤트")
    .setDescription("대상을 뮤트해제합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
        option.setName("대상")
        .setDescription("뮤트를 해제할 대상을 선탭합니다.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {guild, options} = interaction;

        const user = options.getUser("대상");
        const member = guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
        .setDescription("알수없는 오류가 발생했어, 다시 시도해~")
        .setColor(0xc72c3b)

        const succesEmbed = new EmbedBuilder()
        .setTitle("** <:crythumbsup:1000740198956683334> 뮤트해제 완료**")
        .setDescription(`${user} 를 성공적으로 뮤트 해제 완료~`)
        .setColor(0x5fb041)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
        .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null);

            interaction.reply({ embeds: [succesEmbed]});
        } catch (err) {
            console.log(err);
        }
    }
}