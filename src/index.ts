import * as Discord from "discord.js";
import config from "./utils/readConfig.js";
import commandAdder from "./bot/commandAdder.js";
import eventHandler from "./bot/eventHandler.js";
import shutdown from "./utils/shutdown.js";
import Logger from "./utils/logger.js";
import { initMongo } from "./utils/mongo/mongoManager.js";
import deployCommands from "./utils/deployCommands.js";
declare module "discord.js" {
  interface Client<Ready extends boolean = boolean> {
    commands: any;
  }
}

// all intents f*** the pricintpal of least permisisons
const intents = new Discord.Intents(32767);

const client = new Discord.Client({ intents: intents });
client.commands = {}

client.commands.text = new Discord.Collection();
client.commands.slash = new Discord.Collection();


export { client as default };
//TODO: await theese by wrapping  all in a anyno function so it isnt top level
let sycFunctions = async () => {
  await eventHandler(client);
  await commandAdder();
  await deployCommands()
  await initMongo();
  client.emit("asyncInit")
};
sycFunctions();


client.login(config.token);
process.on("SIGINT", async function () {
  Logger.warn("Caught interrupt signal, itinating graceful shutdown");

  try {
    await client.destroy();
    await shutdown();
    process.exit(0)

  } catch (err: any) {
    Logger.error(err);
  }
});
