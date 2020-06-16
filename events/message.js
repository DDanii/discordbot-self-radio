const ytdl = require('ytdl-core');
const kick = require("../commands/kick");
const shell = require("shelljs");
const fs = require("fs");
const {client, Attachment } = require('discord.js');
const types = ["gif", "jpeg", "jpg", "png"];
module.exports = async (client, message) => {
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
  if (m.startsWith('!play')) {
    // Only try to join the sender's voice channel if they are in one themselves
    console.log(message.member.voiceStates);
    if (message.member.voice.channel != null) {
      const connection = await message.member.voice.channel.join();
	console.log(m.split(" ")[1]);
      const dispatcher = connection.play(ytdl(message.content.split(" ")[1]+"/", {filter: 'audioonly' }));
      dispatcher.setVolume(0.5);
      dispatcher.on('error', error =>{console.log(error)});
      dispatcher.on('finish', () => {
        console.log('Finished playing!');
        dispatcher.destroy();
        connection.disconnect();
      });
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
};
