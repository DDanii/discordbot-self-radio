require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const ms = require("./minestat");

fs.readdir("/stuff/discord-bot/events/", (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`/stuff/discord-bot/events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventHandler(client, ...args));
  });
});

setInterval(function() {
  let j = {};
  let players = 0;
  ms.init('192.168.0.59', 25565, function(result){ if(ms.online){ players = ms.current_players;}else{players = 'OFFLINE'} });
  client.user.setActivity('MC:'+players,{ type: 0 }).then(console.log)
  console.log(client.user);
  client.guilds.forEach((item, index) =>{
    item.members.forEach((member, key, map) =>{
      if(member.presence.status != "offline" && member.presence.status != "dnd" && !member.user.bot && member.user.avatarURL != null){
        id =member.user.avatarURL.replace("=2048", "=16");
        j[id] = member.presence.status;
      }
    })
  });
  console.log(j);
    fs.writeFile("/var/www/html/discord/index.php", JSON.stringify(j, null, 2) , (err) => {
      if(err) console.log(err);
    });
},600000, null);

client.login(process.env.BOT_TOKEN);
