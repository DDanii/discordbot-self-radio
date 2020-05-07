const kick = require("../commands/kick");
const shell = require("shelljs");
const fs = require("fs");
const {client, Attachment } = require('discord.js');
module.exports = (client, message) => {
  let m =  message.content.toLowerCase();
  if (message.content.startsWith("!kick")) {
    return kick(message);
  }
  if (m == ("ip")){
    message.reply(""+(shell.exec("myip")));
  }
  if (m == "dunno"){
    message.delete();
    message.reply("¯\\_(ツ)_/¯");
  }
  if (message.content == ":A"){
    message.delete();
    message.reply("( ͡° ͜ʖ ͡°)");
  }
  console.log(m);
  console.log(m.split(" ").length);
  if (m.split(" ").length == 1){
    console.log("asd");
    ["gif", "jpeg", "jpg", "png"].forEach(e =>
    {
      console.log(e);
      if (fs.existsSync("/stuff/" + m + '.' + e)){
        message.delete();
        message.reply(new Attachment("/stuff/" + m + "." + e));
      }
    });
  }
};
