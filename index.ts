import { Client, VoiceChannel, Intents, VoiceState } from 'discord.js';
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

client.on('ready', async () =>{
  manage(client.channels.cache.filter((c, k, l) => {return c.type == 'voice' && (c as VoiceChannel).members.has(process.env['DISCORDBOT_OWNER_ID'])}).first() as VoiceChannel);
});

client.on('voiceStateUpdate', async (oldState, newState) =>{

  if (newState.member.user.id == client.user.id) return;

  if (oldState.channel != null) {
    manage(oldState.channel);
  }

  if (newState.channel != null) {
      manage(newState.channel);
  }
});

function manage(channel : VoiceChannel) : void{
  if(!channel){
    return;
  }
  var shouldBeIn = isOwnerIn(channel);

  channel.members.forEach(m => {
    if(m.user.id == process.env['DISCORDBOT_OWNER_ID'] || 
        m.user.id == client.user.id) return;
    if(!m.voice.deaf)
      shouldBeIn = false;
  });

  if(!shouldBeIn && isBotIn(channel)){
    onLogout(isOwnerIn(channel));
  }

  if(shouldBeIn && !isBotIn(channel)){
    play(channel);
  }
}

function isBotIn(channel : VoiceChannel) : boolean{
  return channel.members.get(client.user.id) != null
}

function isOwnerIn(channel : VoiceChannel) : boolean{
  let owner = channel.members.get(process.env['DISCORDBOT_OWNER_ID']);

  return owner != null
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

process.once('SIGTERM', function (code) {
  onLogout(false);
});