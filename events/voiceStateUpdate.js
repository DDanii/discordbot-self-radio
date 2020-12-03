const { client, Attachment } = require('discord.js');

module.exports = async (client, oldState, newState) => {
  if (newState.member.user.id == '599524816219013165') return;
  if (oldState.channel != null) {
    if (oldState.channel.members.size == 1) {

      if (oldState.channel.members.first().user.username == "ddanii95") {
        play(oldState.channel);
      }
      if (oldState.channel.members.get('599524816219013165') != null) {
        oldState.channel.leave();
      }
    }
  }
  if (newState.channel != null) {
    if (newState.channel.members.size == 1) {
      console.log(newState.channel.members.first().user.username);
      if (newState.channel.members.first().user.username == "ddanii95") {
        play(newState.channel);
      }
    }
    if (newState.channel.members.size == 3 && newState.channel.members.get('599524816219013165') != null) {
      newState.channel.leave();
    }
  }
};

async function play(channel){
  const connection = await channel.join();
  const dispatcher = connection.play("http://127.0.0.1:7999/radio");
  connection.on('disconnect', () => { dispatcher.destroy(); })
  dispatcher.setVolume(0.5);
  dispatcher.on('error', error => { console.log(error) });
  dispatcher.on('finish', () => {
    console.log('Finished playing!');
    dispatcher.destroy();
    connection.disconnect();
  });
}