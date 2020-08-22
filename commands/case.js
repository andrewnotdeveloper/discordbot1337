const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const prettyms = require("pretty-ms");

module.exports = {
  name: "case",
  category: "Moderation",
  description: "Get information about a case",
  usage: "<case number>",
  cooldown: 1,
  guildOnly: true,
  execute(bot, message, args, db) {
    const caseNumber = args[0]
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send(":warning: There was an error while fetching server database, please report this problem on \nhttps://discord.gg/HcAeqg5")
      if (guild) {
        const cases = guild.cases.get(caseNumber) ? guild.cases.get(caseNumber) : false
        if (!cases) return message.channel.send("<:disagree:745003854017593354> This case does not exist!")
        let casemsg = `**Issued by:** <@${cases.by.id}>(${cases.by.id}) \n**Case ID:** #${caseNumber} \n**Action:** ${cases.action} \n**Reason:** ${cases.reason}`
        
        cases.action === "mute" ? (cases.length === null ? casemsg += `\n**Muted for:** No time was provided.` : casemsg += `\n**Muted for:** ${prettyms(cases.length, {verbose: true})}`) : false
        sendEmbed(cases, casemsg)
      }
    })
    
    function sendEmbed(cases, casemsg) {
      const caseEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("invisible")
      .setAuthor(`${cases.user.tag}(${cases.user.id})`, cases.user.avatar)
      .setDescription(casemsg)
      return message.channel.send(caseEmbed);
    }
  }
};