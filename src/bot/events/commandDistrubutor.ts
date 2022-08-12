import * as Discord from "discord.js";
import client from "../../index.js";
import {InteractionType} from "discord.js";
import Logger from "../../utils/logger.js";

export default async function (message: Discord.Message) {
   
    
    commandHandler(message);
}

async function commandHandler(message: Discord.Message) {
    let prefix;

    if (!message.guildId) prefix = client.config.prefix;
    else prefix = client.prefix[message.guildId] || client.config.prefix;

    if (!message.content.startsWith(prefix)) return;

    let commandMessage = message.content.slice(prefix.length);
    let messageArray = commandMessage.split(" ");
    let commandName = messageArray[0].toLowerCase();

    const args = messageArray.slice(1);


    let command = client.commands.text.get(commandName);

   if (!command) return
   command = command.run



    if (!command || typeof command !== "function") return;
    const timeStart = new Date().getTime();
    await command(message, args);
    const timeEnd = new Date().getTime();
    Logger.info(`user ${message.author.username} ran the command ${commandName} took ${(timeEnd - timeStart)} ms`)
}
client.on("interactionCreate", async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.commands.slash.get(interaction.commandName);
    if (!command) return;

    try {
        await command.default.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});
export const settings = {
    once: false,
    event: "messageCreate",
};
