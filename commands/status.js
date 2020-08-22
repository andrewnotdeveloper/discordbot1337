const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "status",
  category: "General",
  description: "The status of the bot.",
  aliases: ["stats"],
  cooldown: 1,
  async execute(bot, message, args) {
    const msg = await message.channel.send(`:timer: Sending data ...`);

    const totalSeconds = process.uptime();
    const realTotalSecs = Math.floor(totalSeconds % 60);
    const days = Math.floor((totalSeconds % 31536000) / 86400);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);

    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setColor("invisible")
      .setThumbnail(bot.user.avatarURL())
      .addField("**CREATED AT:**", "28/04/2020", true)
      .addField("**VERSION:**", config.version, true)
      .addField("**GUILD(s):**", `${bot.guilds.cache.size} guilds`, true)
      .addField("**CHANNEL(s)**", `${bot.channels.cache.size} channels`, true)
      .addField("**USER(s)**", `${bot.users.cache.size.toLocaleString()} users`, true)
      .addField("**PREFIXES**", config.prefixes.join(", "))
      .addField("**PING:**", `Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
      .addField("**UPTIME:**", `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setTimestamp();
    msg.edit("", {embed: embed});
  }
};
