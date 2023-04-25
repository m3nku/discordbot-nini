const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cpuStat = require("cpu-stat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("봇정보")
    .setDescription("욕심니니 정보"),

  async execute(interaction, client) {
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 36000000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;

    cpuStat.usagePercent(function (error, percent) {
      if (error) return interaction.reply({ content: `${error}` });

      const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
      const node = process.version;
      const cpu = percent.toFixed(2);

      const embed = new EmbedBuilder()
        .setTitle("욕심니니 정보")
        .setColor("Blue")
        .addFields(
          { name: "개발자", value: "강민성", inline: true },
          { name: "이름", value: `${client.user.username}`, inline: true },
          { name: "ID", value: `${client.user.id}`, inline: true },
          { name: "제작일", value: "몰루" },
          { name: "도움말 커맨드", value: "/도움말" },
          {
            name: "업타임",
            value: `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds.`,
          },
          { name: "핑", value: `${client.ws.ping}ms` },
          { name: "node version", value: `${node}` },
          { name: "CPU usage", value: `${cpu}%` },
          { name: "Memory usage", value: `${memoryUsage}` }
        );

      interaction.reply({ embeds: [embed] });
    });

    function formatBytes(a, b) {
      let c = 1024;
      d = b || 2;
      e = ["B", "KB", "MB", "GB", "TB"];
      f = Math.floor(Math.log(a) / Math.log(c));

      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + "" + e[f];
    }
  },
};
