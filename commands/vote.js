const Discord = require("discord.js");

module.exports = {
  name: "vote",
  description: "Vote for the bot on top.gg! You can vote every 12 hours.",
  cooldown: 1,
  execute(bot, message, args) {
    let voteEmbed = new Discord.MessageEmbed()
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setColor("invisible")
      .setTimestamp()
      .setDescription("[**incoming**n](https://discordbots.org) \n\nIf you vote you can claim your role on the [Sax's Bot Dump](https://discord.gg/PqjP3Dy) support server.");
    message.channel.send(voteEmbed);
  }
};
