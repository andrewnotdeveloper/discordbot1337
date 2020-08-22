const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

function factorial(num) {
  if (num === 0) {
    return 0;
} if (num === 1)
    return 1;
  for (var i = num - 1; i >= 1; i--) {
    num += i;
  }
  return num;
}

module.exports = {
  name: "leaderboard",
  category: "Leveling",
  description: "See the leaderboard for the server.",
  aliases: ["lb"],
  usage: "[page number]",
  cooldown: 1,
  guildOnly: true,
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send(":warning: There was an error while fetching server database, please report this problem on \nhttps://discord.gg/HcAeqg5");
      if (guild) {

        let users = [];
        let top = [];
        guild.members.forEach(member => {
          if (member.xp > 0) {
            const lvl = member.level
            const lastxp = member.xp + factorial(lvl) * 560
            users.push({
              user: member.username,
              xp: lastxp,
              lvl: member.level
            });
          }
        });

        users.sort((a, b) => b.xp - a.xp);
        let countlb = users.length < 10 ? users.length : 10;

        const pages = Math.floor(users.length / 10)
        const extra = users.length % 10

        const goto = (args[0] - 1) * 10

        let page = ""
        if (!args[0]) {
          for (let i = 0; i < countlb; i++) {
            top.push(`${i == 0 ? ':first_place:' : (i === 1 ? ':second_place:' : (i === 2 ? ':third_place:': `${i + 1}.`))} ${users[i].user} | **XP:** \`${users[i].xp}\` | **LEVEL:** \`${users[i].lvl}\``)
          }
          page = `1/${pages}`
        } else {
          if (Number(args[0]) > pages) return message.channel.send("<:disagree:745003854017593354> This page does not exist.");
          for (let i = goto; i < goto + 10; i++) {
            top.push(`${i == 0 ? ':first_place:' : (i === 1 ? ':second_place:' : (i === 2 ? ':third_place:': `${i + 1}.`))} ${users[i].user} | **XP:** \`${users[i].xp}\` | **LEVEL:** \`${users[i].lvl}\``)
          }
          page = `${args[0]}/${pages}`
        }

        let place;
        let count = 1;
        users.forEach(userz => {
          if (userz.user === message.author.tag) {
            place = count;
          } else {
            count += 1;
          }
        });

        const lbEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.guild.name} Leaderboard`, message.guild.iconURL())
        .setColor("invisible")
        .setFooter(`Page of ${page} - Requested by ${message.author.tag}`, message.author.avatarURL())
        .setDescription(top)
        message.channel.send(lbEmbed);
      }
    });
  }
};
