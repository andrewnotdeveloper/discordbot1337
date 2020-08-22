//Mongoose
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kuina:f74fTSkq7jzxMIFq@kuina.jwcr7.mongodb.net/kuina?retryWrites=true&w=majority" , {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

//Discord
const Discord = require('discord.js');
const bot = new Discord.Client({ disableMentions: "everyone" });

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

["commands", "events"].forEach(handler => {
  require(`./util/handlers/${handler}`)(bot, db);
});

bot.login('NzA0NTc3NTAzNjY2MzcyNjA5.XqfK7w.DPrWubNOJvOomrmfqw_BQwhOIBc');
