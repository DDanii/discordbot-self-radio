import { Client, VoiceChannel, Intents } from 'discord.js';
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter';
import * as WebRequest from 'web-request';

const player = createAudioPlayer();

let connection;

async function playSong() {

  try {
		entersState(connection, VoiceConnectionStatus.Ready, 30e3);
	} catch (error) {
		connection.destroy();
	}
	const resource = createAudioResource(process.env['DISCORDBOT_STREAM_LINK'], {
    inputType: StreamType.Raw,
	});
  
	player.play(resource);

	return entersState(player, AudioPlayerStatus.Playing, 15e3);
}

async function connectToChannel(channel: VoiceChannel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
	});
	
  return connection;
}

const client = new Client({
	ws: { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] },
});

client.login(process.env['DISCORDBOT_TOKEN']);


client.on('voiceStateUpdate', async (oldState, newState) =>{

  if (newState.member.user.id == 'todo self id') return; //TODO

  if (oldState.channel != null) {
    if (oldState.channel.members.size == 1) {
      if (isBotIn(oldState)) {
        onLogout(false);
      }
    }
  }
  if (newState.channel != null) {
    if (newState.channel.members.size == 1) {
      if (amIIN(newState)) {
        play(newState.channel);
      }else{
        if (isBotIn(newState)){
          onLogout(false);
        }
      }
    }
    if (newState.channel.members.size >= 2) {

      var login = !isBotIn(newState) && amIIN(newState);
      var logout = false;
      newState.channel.members.forEach(x => {
        if(x.user.id == process.env['DISCORDBOT_OWNER_ID']) return;
        if(!x.voice.deaf){
          login = false;
          if(isBotIn(newState))
            logout = true;
        }
      })

      if(login){
        play(newState.channel);
      }
      if(logout){
        onLogout();
      }
    }
  }

});

function isBotIn(state){
  return state.channel.members.get('') != null //TODO self id
}

function amIIN(state){
  return state.channel.members.get(process.env['DISCORDBOT_OWNER_ID']) != null
}

async function play(channel){

    try {
        connection = await connectToChannel(channel);
        await playSong();
        connection.subscribe(player);
    } catch (error) {
        console.error(error);
    }
}

async function onLogout(notify: boolean = true){
  connection.destroy();
  if(notify)
    WebRequest.post(process.env['DISCORDBOT_JOIN_WEBHOOK']);
}