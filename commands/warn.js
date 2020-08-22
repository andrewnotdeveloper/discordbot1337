const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const find = require("../find.js");

module.exports = {
  name: "warn",
  category: "Moderation",
  description: "Warn a user",
  aliases: ["w"],
  usage: "<user> <reason>",
  cooldown: 1,
  guildOnly: true,
  reqPermissions: ['MANAGE_MESSAGES'],
  async execute(bot, message, args, db) {
    if (!args[0]) return message.channel.send("\<:disagree:745003854017593354> You didn't provided a user.");
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.channel.send("\<:disagree:745003854017593354> You didn't provide a true user.");

    if (user.id === message.author.id) return message.channel.send("\<:disagree:745003854017593354> You cannot warn yourself!");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't warn this member, they are too powerful for you.")

    args.shift();
    let reason = args.join(" ");
    if (reason.length < 1) reason = "No reason provided."

    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send(":warning: There was an error while fetching server database, please report this problem on \nhttps://discord.gg/HcAeqg5")
      if (guild) {
        let keys = Array.from(guild.cases.keys())
        let caseNumber = keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()

        guild.cases.set(caseNumber, {
          user: {
            tag: user.user.tag,
            id: user.user.id,
            avatar: user.user.avatarURL()
          },
          by: {
            tag: message.author.tag,
            id: message.author.id,
            avatar: message.author.avatarURL()
          },
          reason: reason,
          time: Date.now(),
          action: "warn"
        })
        guild.save().then(() => {
          user.send(`You have been warned in **${message.guild.name}** for reason **${reason}**.`).then(() => {
            return message.channel.send(`Case ID: \`#${caseNumber}\` \n<:agree:745003896522670100> **${user.user.tag}** has been warned! \n**Reason:** ${reason}`)
          }).catch(err => {
            return message.channel.send(`Case ID: \`#${caseNumber}\` \n<:agree:745003896522670100> **${user.user.tag}** has been warned but I couldn't inform them in DM's! **Reason:** ${reason}`)
          })
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`)
        })
      }
    })
  }
};
