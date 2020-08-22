const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "un-ban",
  category: "Moderation",
  description: "Unbans a specified user.",
  aliases: ["unban"],
  usage: "<username/id> <reason>",
  cooldown: 1,
  guildOnly: true,
  reqPermissions: ["BAN_MEMBERS"],
  async execute(bot, message, args) {
    if (!args[0]) return message.channel.send("<:disagree:745003854017593354> You must provide a username or id of the person you want to unban.");
    let user = args.shift();
    //Dont forget to add case
    let bans = await message.guild.fetchBans()
    let banned = bans.find(ban => ban.user.username.toLowerCase().includes(user.toLowerCase()) || ban.user.id === user)
    if (!banned) return message.channel.send("<:disagree:745003854017593354> This ban could not be found.");
    
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send(":warning: There was an error while fetching server database, please report this problem on \nhttps://discord.gg/HcAeqg5")
      if (guild) {
        let keys = Array.from(guild.cases.keys())
        let caseNumber = keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()
        
        let reason = args[0] ? args.join(" ") : "No reason provided."
        
        let userFetch = await bot.users.fetch(banned.user.id)
        
        guild.cases.set(caseNumber, {
          user: {
            tag: userFetch.tag,
            id: userFetch.id,
            avatar: userFetch.avatarURL()
          },
          by: {
            tag: message.author.tag,
            id: message.author.id,
            avatar: message.author.avatarURL()
          },
          reason: reason,
          time: Date.now(),
          action: "un-ban"
        })
        guild.save().then(() => {
          message.guild.members.unban(userFetch.id, {reason: reason})
          return message.channel.send(`Case ID: \`#${caseNumber}\` \n<:agree:745003896522670100> **${userFetch.tag}** has been unbanned.`)
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`)
        })
      }
    })
  }
};
