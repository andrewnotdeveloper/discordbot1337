const Discord = require("discord.js");
const find = require("../find.js");

module.exports = {
  name: "nickname",
  category: "Moderation",
  description: "Change nickname of members. Leave blank to reset nickname.",
  aliases: ["setnick","nick"],
  usage: "<user - role> [new nickname]",
  cooldown: 1,
  guildOnly: true,
  reqPermissions: ["MANAGE_NICKNAMES"],
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send("<:disagree:745003854017593354> You didn't provided a user.");

    let user = await find.guildMember(bot, message, args[0])

    args.shift();
    let nick = args.join(" ");
    if (nick.length >= 32) return message.channel.send("<:disagree:745003854017593354> Nickname must be 32 or fewer in lenght.");

    if (!message.guild.members.cache.get(cache.id).manageable && user.id != bot.user.id) return message.channel.send("<:disagree:745003854017593354> This user is way too powerful than me.");
    user.setNickname(nick, "Requested by " + message.author.username).then(() => {
      if (nick.length < 1) {
        return message.channel.send(`<:agree:745003896522670100> **${user.user.tag}**'s nickname has been cleared succesfully.`);
      } else {
        return message.channel.send(`<:agree:745003896522670100> **${user.user.tag}**'s nickname has been changed to **${nick}** succesfully.`);
      }
    }).catch(err => {
      return message.channel.send("An error occured: " + err)
    })
  }
};
