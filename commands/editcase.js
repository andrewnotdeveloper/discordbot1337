const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "editcase",
  category: "Moderation",
  description: "Edit the case",
  usage: "<case number>",
  cooldown: 1,
  guildOnly: true,
  reqPermissions: ['MANAGE_MESSAGES'],
  execute(bot, message, args, db) {
    if (!args[0]) return message.channel.send("<:disagree:745003854017593354> You didn't provide a case ID.")
    const caseNumber = args[0]
    args.shift()
    const updated = args.join(" ")
    if (updated.length < 1) return message.channel.send("<:disagree:745003854017593354> You didn't provide the updated reason.");
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send(":warning: There was an error while fetching server database, please report this problem on \nhttps://discord.gg/HcAeqg5")
      if (guild) {
        const cases = guild.cases.get(caseNumber) ? guild.cases.get(caseNumber) : false
        if (!cases) return message.channel.send("<:disagree:745003854017593354> This case does not exist!")

        guild.cases.set(caseNumber, {
          user: {
            tag: cases.user.tag,
            id: cases.user.id,
            avatar: cases.user.avatar
          },
          by: {
            tag: cases.by.tag,
            id: cases.by.id,
            avatar: cases.by.avatar
          },
          reason: args.join(" "),
          time: cases.time,
          action: cases.action
        })
        guild.save().then(() => message.channel.send("<:agree:745003896522670100> Case has been edited successfully.")).catch(err => message.channel.send(`An error occured: ${err}`))
        sendEmbed(cases)
      }
    })

    function sendEmbed(cases) {
      const warnEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("invisible")
      .setAuthor(cases.user.tag, cases.user.avatar)
      .addField("User", `<@${cases.user.id}>(\`${cases.user.id}\`)`)
      .addField("Case by", `<@${cases.by.id}>`)
      .addField("Case", `**#${caseNumber}** `, true)
      .addField("Action", cases.action, true)
      .addField("Reason", args.join(" "));
      return message.channel.send(warnEmbed);
    }
  }
};
