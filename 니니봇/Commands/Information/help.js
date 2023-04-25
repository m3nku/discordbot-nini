const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ActionRow,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("도움말")
    .setDescription("욕심니니의 모든 명령어 모음")
    .setDMPermission(false),
  async execute(interaction) {
    const { client, channel } = interaction;

    const emojis = {
      information: "📰",
      general: "🌍",
      moderation: "🔑",
    };

    function getCommand(name) {
      const getCommandID = client.application.commands.cache
        .filter((cmd) => cmd.name === name)
        .map((cmd) => cmd.id);

      return getCommandID;
    }

    const directories = [...new Set(client.commands.map((cmd) => cmd.folder))];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description:
              cmd.data.description || "해당 명령어에는 설명이 없습니다.",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder()
      .setDescription("아래에서 카테고리를 선택하여 명령어를 확인해")
      .setColor("#235ee7")
      .setAuthor({
        name: `${client.user.username}의 명령어들`,
        iconURL: client.user.avatarURL(),
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("도움말 메뉴")
          .setPlaceholder("카테고리 찾기")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `${cmd.directory} 의 명령어들`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .setTitle(
          `${emojis[directory.toLowerCase()] || null} ${formatString(
            directory
          )} 명령어들`
        )
        .setDescription(`${directory} 산하 명령어들`)
        .setColor("#235ee7")
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `</${cmd.name}:${getCommand(cmd.name)}>`,
              value: `\`${cmd.description}\``,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initialMessage.edit({ components: components(ture) });
    });
  },
};
