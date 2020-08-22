const Discord = require("discord.js");
const ms = require("ms");
const prettyms = require("pretty-ms");
const find = require("../find.js");

function prettyString(string) {
 return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/_/g, " ").replace(/guild/gi, "Server")
}

module.exports = {
  name: "userinfo",
  category: "Utility",
  description: "Lists information about a user.",
  usage: "[user]",
  aliases: ['ui'],
  cooldown: 1,
  guildOnly: true,
  async execute(bot, message, args) {

    let user;

    if (!args[0]) {
      user = message.member
    } else {
      user = await find.guildMember(bot, message, args[0])
      if (!user) return message.channel.send("<:disagree:745003854017593354> You didn't provide a true user.");
    }

    let uUser = message.mentions.users.first() || message.author;

    let presenceMes;
    if (user.presence.activities[0]) {
      if (user.presence.activities[0].type == "PLAYING") {
        presenceMes = `Playing **${user.presence.activities[0].name}**`;
      } else if (user.presence.activities[0].type == "STREAMING") {
        presenceMes = `Streaming **${user.presence.activities[0].name}**`;
      } else if (user.presence.activities[0].type == "LISTENING") {
        presenceMes = `Listening **${user.presence.activities[0].name}**`;
      } else if (user.presence.activities[0].type == "WATCHING") {
        presenceMes = `Watching **${user.presence.activities[0].name}**`;
      } else if (user.presence.activities[0].type == "CUSTOM_STATUS") {
        if (user.presence.activities[0].emoji == null) {
          presenceMes = `Custom Status **${user.presence.activities[0].state}**`;
        } else  {
          presenceMes = `Custom Status ${user.presence.activities[0].emoji} **${user.presence.activities[0].state}**`;
        }
      } else {
        presenceMes = 'Something is wrong... Pls contract support';
      }
    } else {
      presenceMes = 'Nothing';
    }

    let joinposition;
    let arr = message.guild.members.cache.array();
    arr.sort((a, b) => a.joinedAt - b.joinedAt);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == user.id) joinposition = i;
    }
    let icon = "";
    let platforms = "";
    let plat = user.presence.clientStatus;
    if (plat == null || JSON.stringify(plat) == "{}") {
      platforms += "Mobile <:web:746672965663326268> - <:DE_StatusOffline:740518735798075413> Invisible";
      icon = "<:DE_StatusOffline:740518735798075413> "
    } else {
      if (plat.mobile) {
        if (plat.mobile === "online") {
          platforms += `Mobile <:web:746672965663326268> - <:DE_StatusOnline:740518688318554203> Online\n`
          icon = `<:DE_StatusOnline:740518688318554203>`
        } else if (plat.mobile === "idle") {
          platforms += `Mobile <:web:746672965663326268> - <:DE_StatusIdle:740518631292796928> Idle\n`
          icon = `<:DE_StatusIdle:740518631292796928>`
        } else if (plat.mobile === "dnd") {
          platforms += `Mobile <:web:746672965663326268> - <:DE_StatusDND:740518653207904286> Dnd\n`
          icon = `<:DE_StatusDND:740518653207904286`
        }
      }
      if (plat.web) {
        if (user.presence.activities[0]) {
          if (user.presence.activities[0].type === "STREAMING") {
            platforms += `:computer: Web - <:DE_StatusStreaming:746682746205896754> Streaming\n`
            icon = `<:DE_StatusStreaming:746682746205896754>`
          } else {
            if (plat.web === "online") {
              platforms += `:computer: Web - <:DE_StatusOnline:740518688318554203> Online\n`
              icon = `<:online2:723959335209664535>`
            } else if (plat.web === "idle") {
              platforms += `:computer: Web - <:DE_StatusIdle:740518631292796928> Idle\n`
              icon = `<:idle2:723959389006069841>`
            } else if (plat.web === "dnd") {
              platforms += `:computer: Web -  <:DE_StatusDND:740518653207904286> Dnd\n`
              icon = `<:dnd2:723959428679991336>`
            }
          }
        } else {
          if (plat.web === "online") {
            platforms += `:computer: Web - <:DE_StatusOnline:740518688318554203> Online\n`
            icon = `<:online2:723959335209664535>`
          } else if (plat.web === "idle") {
            platforms += `:computer: Web - <:DE_StatusIdle:740518631292796928> Idle\n`
            icon = `<:idle2:723959389006069841>`
          } else if (plat.web === "dnd") {
            platforms += `:computer: Web - <:DE_StatusDND:740518653207904286> Dnd\n`
            icon = `<:dnd2:723959428679991336>`
          }
        }
      }
      if (plat.desktop) {
        if (user.presence.activities[0]) {
          if (user.presence.activities[0].type === "STREAMING") {
            platforms += `:desktop: Desktop - <:DE_StatusStreaming:746682746205896754> Online`
            icon = `<:streaming2:724050154273112175>`
          } else {
            if (plat.desktop === "online") {
              platforms += `:desktop: Desktop - <:DE_StatusOnline:740518688318554203> Online\n`
              icon = `<:online2:723959335209664535>`
            } else if (plat.desktop === "idle") {
              platforms += `:desktop: Desktop - <:DE_StatusIdle:740518631292796928> Idle\n`
              icon = `<:idle2:723959389006069841>`
            } else if (plat.desktop === "dnd") {
              platforms += `:desktop: Desktop - <:DE_StatusDND:740518653207904286> Dnd\n`
              icon = `<:dnd2:723959428679991336>`
            }
          }
        } else {
          if (plat.desktop === "online") {
            platforms += `:desktop: Desktop - <:DE_StatusOnline:740518688318554203> Online\n`
            icon = `<:online2:723959335209664535>`
          } else if (plat.desktop === "idle") {
            platforms += `:desktop: Desktop - <:DE_StatusIdle:740518631292796928> Idle\n`
            icon = `<:idle2:723959389006069841>`
          } else if (plat.desktop === "dnd") {
            platforms += `:desktop: Desktop - <:DE_StatusDND:740518653207904286> Dnd\n`
            icon = `<:dnd2:723959428679991336>`
          }
        }
      }
    }

    let roles = `<@&${user._roles.join(">, <@&")}>`;
    if (roles.length > 1024) {
      roles = "Too many roles!"; //roles.slice(-(1024 - roles.length))
    }

    let content;
    if (user.lastMessage === null) {
      content = "N/A";
    } else {
      content = `> ${user.lastMessage}(${user.lastMessageID})`;
    }

    let badges = []
    if (user.user.flags) {
      user.user.flags.toArray().forEach(badge => {
        switch (badge) {
          case "DISCORD_EMPLOYEE":
            badges.push("<:DE_BadgeEmployee:746687505398759494> \`Discord Employee\`")
            break;
          case "DISCORD_PARTNER":
            badges.push("<:partner:746674945437990993> \`Discord Partner\`")
            break;
          case "HYPESQUAD_EVENTS":
            badges.push("<:DE_BadgeHypesquad:740518321971003394> \`Hypesquad Events\`")
            break;
          case "BUGHUNTER_LEVEL_1":
            badges.push("<:DE_BadgeBughunter:740518382683553792> \`Bug Hunter\`")
            break;
          case "BUGHUNTER_LEVEL_2":
            badges.push("<:bughunterlvl2:746687672659083324> \`Bug Hunter (LEVEL 2)\`")
            break;
          case "HOUSE_BRAVERY":
            badges.push("<:DE_BadgeBravery:740517956236083200> \`Hypesquad Bravery\`")
            break;
          case "HOUSE_BRILLIANCE":
            badges.push("<:DE_BadgeBrilliance:740518023655325727> \`Hypesquad Briliance\`")
            break;
          case "HOUSE_BALANCE":
            badges.push("<:DE_BadgeBalance:740517989564153947> \`Hypesquad Balance\`")
            break;
          case "EARLY_SUPPORTER":
            badges.push("<:DE_BadgeEarlySupporter:740518095923314689> \`Early Supporter\`")
            break;
          case "SYSTEM":
            badges.push("SYSTEM")
            break;
          case "VERIFIED_BOT":
            badges.push("<:DE_VerifiedBot:746687736949375067> \`Verified BOT\`")
            break;
          case "VERIFIED_DEVELOPER":
            badges.push("<:DE_BadgeBotDeveloper:740518125832896532> \`Verified BOT Developer\`")
            break;
        }
      })
    }

    icon += user.user.bot ? `<:bot:724052575405735997>` : (message.guild.owner.id === user.user.id ? `<:owner:724048854592520283>`: ``)
    const userinfoEmbed = new Discord.MessageEmbed()
      .setAuthor(`${user.user.tag}'s information`, user.user.avatarURL())
      .setThumbnail(user.user.avatarURL())
      .setTimestamp()
      .setColor('invisible')
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .addField('**USERNAME**', uUser.username , true)
      .addField('**ID**:', `${user.id}`, true)
      .addField("**NICKNAME:**", user.nickname ? user.nickname : "N/A")
      .addField("**STATUS:**", platforms, true)
      .addField("**PRESENCE:**", presenceMes, true)
      .addField("**JOIN POSITION:**",`#${joinposition + 1}`, true)
      .addField("**BADGES:**", badges.length >= 1 ? badges : "N/A")
      .addField("**LAST MESSAGE:**", content)
      .addField("**CREATED AT:**", `${uUser.createdAt.toLocaleDateString('en-US', {weekday: 'long',year: 'numeric',month: 'long',hour12: true,day: 'numeric'})}`)
      .addField("**JOINED AT:**", `${message.guild.joinedAt.toLocaleDateString('en-US', {weekday: 'long',year: 'numeric',month: 'long',hour12: true,day: 'numeric'})}`)
    message.channel.send(userinfoEmbed);
  }
};
