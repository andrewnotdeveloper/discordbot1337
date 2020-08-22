const Discord = require("discord.js");
const find = require("../find.js");

function prettyString(string) {
 return string.replace(/_/g, " ").replace(/guild/gi, "Server").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
}

module.exports = {
  name: "roleinfo",
  category: "Utility",
  description: "Lists the information about a role.",
  usage: "<role>",
  cooldown: 1,
  guildOnly: "true",
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send("<:disagree:745003854017593354> You didn't provide a role.");

    let role = await find.role(bot, message, args[0])
    if (!role) return message.channel.send("<:disagree:745003854017593354> You didn't provide a true role.");

    let count = 0;
    message.guild.members.cache.forEach(member => {
      if (member.roles.cache.get(role.id)) count++
    })

    let perms = []
    role.permissions.toArray().forEach(perm => {
    perms.push(prettyString(perm))
    })

    const roleEmbed = new Discord.MessageEmbed()
      .setTitle(`**${role.name}** (ROLE INFORMATION)`)
      .setTimestamp()
      .setColor("#36393e")
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setDescription(`**ID:** ${role.id}`)
      .addField("**SEPARATED:**", String(role.hoist)[0].toUpperCase() + String(role.hoist).substr(1), true)
      .addField("**MENTIONABLE:**", String(role.mentionable)[0].toUpperCase() + String(role.mentionable).substr(1), true)
      .addField("**POSITION:**", `${role.rawPosition}/${message.guild.roles.cache.size - 1}`, true)
      .addField("**MEMBER COUNT:**", count, true)
      .addField("**BOT ROLE:**", String(role.managed)[0].toUpperCase() + String(role.managed).substr(1), true)
      .addField("**HEX:**", '#' + role.color.toString(16), true)
      .addField("**PERMISSION(s)**", `${perms.length > 0 ? perms.join(", ") : "No Permissions"}`, true);
    return message.channel.send(roleEmbed);
  }
};
