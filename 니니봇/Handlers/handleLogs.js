const { EmbedBuilder } = require("discord.js");
const logSchema = require("../Models/Logs");
const moment = require("moment");
moment.locale("ko");

function handleLogs(client) {
  async function send_log(guildId, embed) {
    const data = await logSchema.findOne({ Guild: guildId });
    if (!data || !data.Channel) return;
    const LogChannel = client.channels.cache.get(data.Channel);

    if (!LogChannel) return;
    embed
      .setTimestamp()
      .setFooter({ text: "욕심니니", iconURL: "https://ifh.cc/g/LYrpSv.png" });

    try {
      LogChannel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }

  client.on("messageDelete", function (message) {
    if (message.author.bot) return;

    const msgEdit =
      message.content.slice(0, 1950) +
      (message.content.length > 1950 ? " ..." : "");

    const embed = new EmbedBuilder()
      .setTitle("메시지 삭제")
      .setColor("#2F3136")
      .addFields(
        { name: "**사용자**", value: `<@${message.author.id}>`, inline: true },
        { name: "**채널**", value: `<#${message.channel.id}>`, inline: true },
        { name: "**내용**", value: `\`\`\`${msgEdit}\`\`\``.slice(0, 4096) }
      );

    if (message.attachments.size > 0) {
      embed.setImage(message.attachments.first().url);
    }

    return send_log(message.guild.id, embed);
  });

  client.on("messageUpdate", function (oldMessage, newMessage) {
    if (oldMessage.author.bot) return;
    if (
      oldMessage.content.replace(/\s/g, "") ===
      newMessage.content.replace(/\s/g, "")
    )
      return;

    const OldmsgEdit =
      oldMessage.content.slice(0, 1950) +
      (oldMessage.content.length > 1950 ? " ..." : "");
    const NewmsgEdit =
      newMessage.content.slice(0, 1950) +
      (newMessage.content.length > 1950 ? " ..." : "");

    const embed = new EmbedBuilder()
      .setTitle("메시지 업데이트")
      .setColor("#2F3136")
      .addFields(
        {
          name: "**사용자**",
          value: `<@${newMessage.author.id}>`,
          inline: true,
        },
        {
          name: "**채널**",
          value: `<#${oldMessage.channel.id}>`,
          inline: true,
        },
        {
          name: "**이전 내용**",
          value: `\`\`\`${OldmsgEdit}\`\`\``.slice(0, 4096),
        },
        {
          name: "**새로운 내용**",
          value: `\`\`\`${NewmsgEdit}\`\`\``.slice(0, 4096),
        }
      );

    if (newMessage.attachments.size > 0) {
      embed.setImage(newMessage.attachments.first().url);
    }

    return send_log(newMessage.guild.id, embed);
  });

  // Channel Topic Updating
  client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
    const embed = new EmbedBuilder()
      .setTitle("주제 업데이트")
      .setColor("#2F3136")
      .setDescription(
        `${channel} 의 주제가 **${oldTopic}** 에서 **${newTopic}** 로 바뀌었습니다.`
      );

    return send_log(channel.guild.id, embed);
  });

  // Channel Permission Updating
  client.on(
    "guildChannelPermissionsUpdate",
    (channel, oldPermissions, newPermissions) => {
      const embed = new EmbedBuilder()
        .setTitle("권한 업데이트")
        .setColor("#2F3136")
        .setDescription(`${channel} 의 권한이 업데이트 됐습니다.`);

      return send_log(channel.guild.id, embed);
    }
  );

  // unhandled Guild Channel Update
  client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
    const embed = new EmbedBuilder()
      .setTitle("채널 업데이트")
      .setColor("#2F3136")
      .setDescription(
        `${oldChannel} 이 편집되었지만 discord-logs에서 업데이트된 내용을 찾을 수 없습니다.`
      );

    return send_log(oldChannel.guild.id, embed);
  });

  // Member Started Boosting
  client.on("guildMemberBoost", (member) => {
    const embed = new EmbedBuilder()
      .setTitle("서버 부스팅!")
      .setColor("#2F3136")
      .setDescription(
        `**${member.user}** 유저가 ${member.guild.name} 서버를 부스팅하였습니다.`
      );
    return send_log(member.guild.id, embed);
  });

  // Member Unboosted
  client.on("guildMemberUnboost", (member) => {
    const embed = new EmbedBuilder()
      .setTitle("부스팅 종료.")
      .setColor("Pink")
      .setDescription(
        `**${member.user}** 유저가 ${member.guild.name} 서버 부스팅을 그만두었습니다.`
      );

    return send_log(member.guild.id, embed);
  });

  // Member Got Role
  client.on("guildMemberRoleAdd", (member, role) => {
    const embed = new EmbedBuilder()
      .setTitle("유저 역할 추가")
      .setColor("#2F3136")
      .setDescription(`**${member.user}** 유저가 ${role} 역할을 얻었습니다.`);

    return send_log(member.guild.id, embed);
  });

  // Member Lost Role
  client.on("guildMemberRoleRemove", (member, role) => {
    const embed = new EmbedBuilder()
      .setTitle("유저 역할 삭제")
      .setColor("#2F3136")
      .setDescription(`**${member.user}** 유저가 ${role} 역할을 잃었습니다.`);

    return send_log(member.guild.id, embed);
  });

  // Nickname Changed
  client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
    const embed = new EmbedBuilder()
      .setTitle("닉네임 업데이트")
      .setColor("#2F3136")
      .setDescription(
        `${member.user} 유저가 \`${oldNickname}\` 에서 \`${newNickname}\` 으로 닉네임을 변경하였습니다.`
      );

    return send_log(member.guild.id, embed);
  });

  // Server Boost Level Up
  client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
    const embed = new EmbedBuilder()
      .setTitle("서버 부스트 레벨업")
      .setColor("#2F3136")
      .setDescription(
        `${guild.name} 서버의 부스트 레벨이 ${newLevel} 을 달성하였습니다.`
      );

    return send_log(guild.id, embed);
  });

  // Server Boost Level Down
  client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
    const embed = new EmbedBuilder()
      .setTitle("서버 부스트 레벨다운")
      .setColor("#2F3136")
      .setDescription(
        `${guild.name} 서버의 부스트 레벨이 ${oldLevel} 에서 ${newLevel} 로 떨어졌습니다.`
      );

    return send_log(guild.id, embed);
  });

  // Banner Added
  client.on("guildBannerAdd", (guild, bannerURL) => {
    const embed = new EmbedBuilder()
      .setTitle("서버 배너 추가")
      .setColor("#2F3136")
      .setImage(bannerURL);

    return send_log(guild.id, embed);
  });

  // Role Created
  client.on("roleCreate", (role) => {
    const embed = new EmbedBuilder()
      .setTitle("역할 추가")
      .setColor("#2F3136")
      .setDescription(
        `역할: ${role}\n역할이름: ${role.name}\n역할 ID: ${role.id}\nHEX 코드: ${role.hexColor}\n위치: ${role.position}`
      );

    return send_log(role.guild.id, embed);
  });

  // Role Deleted
  client.on("roleDelete", (role) => {
    const embed = new EmbedBuilder()
      .setTitle("역할 삭제")
      .setColor("#2F3136")
      .setDescription(
        `역할: ${role}\n역할이름: ${role.name}\n역할 ID: ${role.id}\nHEX 코드: ${role.hexColor}\n위치: ${role.position}`
      );

    return send_log(role.guild.id, embed);
  });

  // User Banned
  client.on("guildBanAdd", ({ guild, user }) => {
    const embed = new EmbedBuilder()
      .setTitle("유저 벤")
      .setColor("#2F3136")
      .setDescription(
        `유저: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
        user.displayAvatarURL({ dynamic: true })
      );

    return send_log(guild.id, embed);
  });

  // User Unbanned
  client.on("guildBanRemove", ({ guild, user }) => {
    const embed = new EmbedBuilder()
      .setTitle("유저 언벤")
      .setColor("#2F3136")
      .setDescription(
        `유저: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
        user.displayAvatarURL({ dynamic: true })
      );

    return send_log(guild.id, embed);
  });
}

module.exports = { handleLogs };
