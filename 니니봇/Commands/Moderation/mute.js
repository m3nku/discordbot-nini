const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("뮤트")
    .setDescription("대상을 뮤트합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
        option.setName("대상")
        .setDescription("뮤트할 대상을 선탭합니다.")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("시간")
        .setDescription("뮤트할 시간을 정합니다.")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("사유")
        .setDescription("뮤트를 하는 사유를 입력합니다.")
    ),

    async execute(interaction) {
        const {guild, options} = interaction;

        const user = options.getUser("대상");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("시간");
        const convertedTime = ms(time);
        const reason = options.getString("사유") || "사유 없음";

        const errEmbed = new EmbedBuilder()
        .setTitle("알수없는 오류가 발생했어, 다시 시도해~")
        .setColor(0xc72c3b)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' });

        const succesEmbed = new EmbedBuilder()
        .setTitle("** <:crythumbsup:1000740198956683334> 뮤트 완료**")
        .setDescription(`${user} 를 성공적으로 뮤트 완료~`)
        .addFields(
            { name: "사유", value: `${reason}`, inline: true },
            { name: "뮤트시간", value: `${time}`, inline: true }
        )
        .setColor(0x5fb041)
        .setFooter({ text: '욕심니니', iconURL: 'https://ifh.cc/g/LYrpSv.png' })
        .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!convertedTime)
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [succesEmbed]});
        } catch (err) {
            console.log(err);
        }
    }
}