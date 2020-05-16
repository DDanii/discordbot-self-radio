const kick = require("../commands/kick");
const shell = require("shelljs");
const fs = require("fs");
const {client, Attachment } = require('discord.js');
const types = ["gif", "jpeg", "jpg", "png"];
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
  if (m == "map"){
    message.delete();
    message.reply(new Attachment("http://192.168.0.59/output.png"));
  }
  if (m == "save" && message.attachments.first() != undefined){
    types.forEach(t =>
    {
      let tmp = message.attachments.first().url.split(".");
      if (tmp[tmp.length - 1] == t){
        let name = message.attachments.first().url.split("/");
        console.log(shell.exec("wget " + message.attachments.first().url + " -O /stuff/" + message.attachments.first().filename));
      }
    });
  }
  if (m.split(" ").length == 1){
    console.log("asd");
    types.forEach(e =>
    {
      if (fs.existsSync("/stuff/" + m + '.' + e)){
        message.delete();
        message.reply(new Attachment("/stuff/" + m + "." + e));
      }
    });
  }
};
