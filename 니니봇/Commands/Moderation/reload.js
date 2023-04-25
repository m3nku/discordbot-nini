const { Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { loadEvents } = require("../../Handlers/eventHandler");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("재부팅")
        .setDescription("명령어, 이벤트 재부팅")
        .addSubcommand(subcommand =>
            subcommand
                .setName("명령어")    
                .setDescription("명령어 재부팅")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("이벤트")    
                .setDescription("이벤트 재부팅")
        ),
    
    async execute(interaction, client) {

        const { user, options } = interaction;

        if(user.id !== "924033484576665681") return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("이 명령어는 봇 개발자만 사용 가능합니다.")
            ], ephemeral: true
        })

        const sub = options.getSubcommand()
        const embed = new EmbedBuilder()
            .setTitle("💻 개발자")
            .setColor("Blue")

        switch(sub) {
            case "명령어": {
                loadCommands(client)
                interaction.reply({ embeds: [embed.setDescription("✅ 명령어가 재부팅되었습니다.")]})
                console.log(`${user} has reloaded the commands.`)
            }
            break;
            case "이벤트": {
                loadEvents(client)
                interaction.reply({ embeds: [embed.setDescription("✅ 이벤트가 재부팅되었습니다.")]})
                console.log(`${user} has reloaded the events.`)
            }
            break;
        }
    }
}