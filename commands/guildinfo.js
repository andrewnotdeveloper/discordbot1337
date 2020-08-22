const Discord = require("discord.js");
const prettyms = require("pretty-ms");

function prettyString(string) {
 return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/_/g, " ").replace(/guild/gi, "Server")
}

module.exports = {
  name: "guildinfo",
  category: "Utility",
  description: "Lists the information about the guild you're in.",
  aliases: ["serverinfo","si","gi"],
  cooldown: 1,
  guildOnly: "true",
  execute(bot, message, args) {
    const guild = message.guild;

    let vccount = 0;
    let textcount = 0;
    let newscount = 0;
    let storecount = 0;
    let categorycount = 0;
    let sicon = message.guild.iconURL();
  if (sicon) {
    sicon = message.guild.iconURL();
  } else {
    sicon = "https://imgur.com/a/t7zw3BK";
  }
    guild.channels.cache.map(c => {
      if (c.type === "text") {
        textcount += 1;
      } else if (c.type === "voice") {
        vccount += 1;
      } else if (c.type === "news") {
        newscount += 1;
      } else if (c.type === "store") {
        storecount += 1;
      } else if (c.type === "category") {
        categorycount += 1;
      }
    });

    let usercount = 0;
    let botcount = 0;

    let onlinecount = 0;
    let offlinecount = 0;
    let dndcount = 0;
    let idlecount = 0;

    let mobilecount = 0;
    let webcount = 0;
    let desktopcount = 0;
    guild.members.cache.map(m => {
      if (m.user.bot === true) {
        botcount += 1;
      } else {
        usercount += 1;
        let plat = m.presence.clientStatus;
        if (plat != null && JSON.stringify(plat) != "{}") {
          if (plat.web) webcount += 1;
          if (plat.mobile) mobilecount += 1;
          if (plat.desktop) desktopcount += 1;
        }
        if (m.presence.status == "online") onlinecount += 1;
        if (m.presence.status == "idle") idlecount += 1;
        if (m.presence.status == "dnd") dndcount += 1;
        if (m.presence.status == "offline") offlinecount += 1;
      }
    });

    let features = []
    guild.features.forEach(feature => {
      features.push(feature[0] + feature.replace("_", " ").toLowerCase().substr(1))
    })

    let channels = `TEXT CHANNEL(**S**): ${textcount}, VOICE CHANNEL(**S**): ${vccount}, CATEGORY: ${categorycount}`
    if (newscount > 0) channels += ` News: ${newscount}`
    if (storecount > 0) channels += ` Store: ${storecount}`
    let guildEmbed = new Discord.MessageEmbed()
      .setTitle(`Guild Information`)
      .setThumbnail(sicon)
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
      .setColor("invisible")
      .addField("**GUILD OWNER**",`<:D02crown:746669770807705620> ${guild.owner} (\`${guild.owner.id}\`)`)
      .addField("**CREATED AT**", `${message.guild.createdAt.toLocaleDateString('en-US', {weekday: 'long',year: 'numeric',month: 'long',hour12: true,day: 'numeric'})}`)
      .addField("**MEMBER(S)**", `Users: ${usercount} \nBots: ${botcount} \n(Total ${guild.members.cache.size}) \n\n<:DE_StatusOnline:740518688318554203> Online: ${onlinecount} \n<:DE_StatusIdle:740518631292796928> Idle: ${idlecount} \n<:DE_StatusDND:740518653207904286> Do Not Distrub: ${dndcount} \n<:DE_StatusOffline:740518735798075413> Offline: ${offlinecount}  \n\n:desktop: Desktop: ${desktopcount} \n:iphone: Mobile: ${mobilecount}`, true)
      .addField("**VERIFICATION LEVEL**", prettyString(guild.verificationLevel))
      .addField("**SERVER BOOST**", `BOOST(S): ${guild.premiumSubscriptionCount} \nLEVEL: ${guild.premiumTier}`)
      message.guild.banner ? guildEmbed.setImage(message.guild.bannerURL()) : false
      guild.partnered ? guildEmbed.setDescription(`<:partner:746674945437990993> Partnered Discord Server`) : false
      guild.verified ? guildEmbed.setDescription(`<:verified:746674993143742535> Verified Discord Server`) : false

    message.channel.send(guildEmbed);
  }
};
