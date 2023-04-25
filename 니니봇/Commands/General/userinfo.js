const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  Attachment,
} = require("discord.js");
const { profileImage } = require("discord-arts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("유저정보")
    .setDescription("유저 정보 확인")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("유저").setDescription("정보를 확인할 유저")
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const { options, guildId, guild } = interaction;
    const user = options.getUser("유저") || interaction.user;
    const member = await interaction.guild.members.cache.get(user.id);

    try {
      const fetchedMembers = await guild.members.fetch();

      const profileBuffer = await profileImage(user.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, {
        name: "profile.png",
      });

      const joinPosition =
        Array.from(
          fetchedMembers
            .sort((a, b) => (a.joinedTimestamp = b.joinedTimestamp))
            .keys()
        ).indexOf(user.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedAt / 1000);
      const createdTime = parseInt(member.user.createdAt / 1000);

      const Booster = user.premiumSince
        ? "<:discordboost7:1089038248703172658>"
        : "❌";

      const Embed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag} | 기본 정보`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(member.displayColor)
        .setDescription(
          `가입일: <t:${joinTime}:D>, ${user} 님은 이 서버의 **${joinPosition}** 번째 맴버입니다.`
        )
        .setImage("attachment://profile.png")
        .addFields(
          {
            name: "뱃지",
            value: `${addBadges(userBadges).join("")}`,
            inline: true,
          },
          { name: "부스터", value: `${Booster}`, inline: true },
          {
            name: "상위 역할",
            value: `${topRoles.join("").replace(`<@&${guildId}>`, "")}`,
            inline: false,
          },
          { name: "계정 만든날", value: `<t:${createdTime}:R>`, inline: true },
          { name: "서버 가입일", value: `<t:${joinTime}:R>`, inline: true },
          { name: "ID", value: `${user.id}`, inline: false },
          {
            name: "아바타",
            value: `[Link](${user.displayAvatarURL()})`,
            inline: true,
          },
          { name: "배너", value: `[Link](${user.bannerURL()})`, inline: true }
        );

      interaction.editReply({ embeds: [Embed], files: [imageAttachment] });
    } catch (error) {
      interaction.editReply({ content: "알 수 없는 오류", ephemeral: true });
      throw error;
    }
  },
};

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["❌"];
  const badgeMap = {
    ActiveDeveloper: "<:activedeveloper:1089038247075786772> ",
    BugHunterLevel1: "<:discordbughunter1:1089038254252236830> ",
    BugHunterLevel2: "<:discordbughunter2:1089038255674114099> ",
    PremiumEarlySupporter: "<:discordearlysupporter:1089038258660454453> ",
    Partner: "<:discordpartner:1089038264880607244> ",
    Staff: "<:discordstaff:1089038267837583410> ",
    HypeSquadOnlineHouse1: "<:hypesquadbravery:1089038272270979193> ", // bravery
    HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1089038273734770790> ", // brilliance
    HypeSquadOnlineHouse3: "<:hypesquadbalance:1089038269662109777> ", // balance
    Hypesquad: "<:hypesquadevents:1089038276494639225> ",
    CertifiedModerator: "<:discordmod:1089038260443021413> ",
    VerifiedDeveloper: "<:discordbotdev:1089038251576275044>",
  };

  return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔");
}
