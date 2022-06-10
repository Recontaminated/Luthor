// Create a new MongoClient
import pkg from 'mongoose';
import Logger from "./logger.js";
import config from "./readConfig.js";
const { Schema, model, connect } = pkg;
const uri = config.databaseURL



const PlayerSchema = new Schema({
  discordId: String,
  playerUuid: String,
}, {timestamps: true});

let Player;


async function initMongo():Promise<void> {

  const db = await connect(uri)
  
  Logger.info("Connected to MongoDB");

  Player = model("Player", PlayerSchema);
  
}





export { initMongo }
export { Player } ;
