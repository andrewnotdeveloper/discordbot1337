const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invites for support channel and bot auth.",
  execute(bot, message, args) {
    const inviteEmbed = new MessageEmbed()
    .setDescription("To invite \`Yumeko\` to your server click [**HERE**](https://discord.com/api/oauth2/authorize?client_id=704577503666372609&permissions=8&scope=bot). \n\nJoin the support server by clicking [**HERE**](https://discord.gg/HcAeqg5)")
    .setColor("invisible")
    .setThumbnail(bot.user.avatarURL())
    .setFooter("Requested by " + message.author.username, message.author.avatarURL())
    .setTimestamp()
    message.channel.send(inviteEmbed)
  }
};
