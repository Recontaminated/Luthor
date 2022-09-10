import prettyMilliseconds from "pretty-ms";
import { SlashCommandBuilder } from "@discordjs/builders";
import client from "index.js";
import {AttachmentBuilder, Interaction} from "discord.js";
import fetch from 'node-fetch';
import Logger from "@utils/logger.js";
let queue: any[] = []
let command = {
    data: new SlashCommandBuilder()
        .setName("halfexpedition")
        .setDescription("makes a shitty image")
        .addStringOption((option) =>
            option
                .setName("prompt")
                .setDescription("Your prmopt idk")
                .setRequired(true)
        ),
    //@ts-ignore
    async createImage(interaction) {
        const api = `http://192.168.1.88:5000/?username=${interaction.options.getString("prompt")}`;


        // if the useris in the queue, return


        const response = await fetch(api);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new AttachmentBuilder(buffer, {name: interaction.options.getString("prompt") + ".png"});
        Logger.debug(response.headers.get("NSFW-detected"));
        if (response.headers.get("NSFW-detected") == "[True]") {
            return await interaction.editReply("NSFW detected, aborting");
        }

        return await interaction.editReply({files: [attachment]})
    },
    //@ts-ignore
    async execute(interaction) {
        if (queue.includes(interaction.user.id)) {
            return interaction.reply("Please wait for your current image to finish processing")
        }

      if (queue.length == 0) {
          queue.push(interaction.user.id)
          let reply = await interaction.deferReply("hang on a sec")
          await this.createImage(interaction)
            queue.splice(queue.indexOf(interaction.user.id), 1)

      }
      else if (queue.length > 0) {
          queue.push(interaction.user.id)
      //    wait till elemenet before resloves promise. This is a really bad implementation but its late and I'd rather have a bad solution than no solution
            await new Promise<void>(async resolve => {
                await interaction.reply("you are in the queue!")
                let interval = setInterval(() => {
                    interaction.editReply("You are in the Queue! position: " + queue.indexOf(interaction.user.id))
                    if (queue.indexOf(interaction.user.id) == 0) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 1000)
            })
            let reply = await interaction.editReply("hang on a sec")
            await this.createImage(interaction)
            queue.splice(queue.indexOf(interaction.user.id), 1)
      }







    },
};

export default command;
