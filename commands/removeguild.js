const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "removeguild",
  category: "Utility",
  description: "Manually removes a guild",
  dev: true,
  unstaged: true,
  guildOnly: true,
  execute(bot, message, args, db) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      
      if (err) return message.channel.send(`An error occured: ${err}`);
      
      if (!guild) return message.channel.send("This database does not exist!");
      
      if (guild) {
        guild.remove().then(
          () => message.channel.send("<:agree:745003896522670100> Guild has been removed from database.")
        ).catch(
          err => message.channel.send("<:disagree:745003854017593354> Guild could not be removed from database! " + err)
        );
      }
    });   
  }
};