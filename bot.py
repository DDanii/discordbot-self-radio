import os
import signal
import requests
import discord
import asyncio

from discord import FFmpegPCMAudio

DISCORDBOT_TOKEN = os.getenv('DISCORDBOT_TOKEN')
DISCORDBOT_STREAM_LINK = os.getenv('DISCORDBOT_STREAM_LINK')
DISCORDBOT_OWNER_ID = os.getenv('DISCORDBOT_OWNER_ID')
DISCORDBOT_JOIN_WEBHOOK = os.getenv('DISCORDBOT_JOIN_WEBHOOK')

intents = discord.Intents.default()

client = discord.Client(intents=intents)

async def main():
    await client.start(DISCORDBOT_TOKEN)

asyncio.run(main())

#@client.command(aliases=['p', 'pla'])
#async def play(ctx, url: str = DISCORDBOT_STREAM_LINK):
#   channel = ctx.message.author.voice.channel
async def play(channel, url: str = DISCORDBOT_STREAM_LINK):
    global player
    try:
        player = await channel.connect()
    except:
        pass
    player.play(FFmpegPCMAudio(url))

def is_owner_in(channel):
    owner = channel.members.get(DISCORDBOT_OWNER_ID);

    return owner != None

def is_bot_in(channel):
    return channel.members.get(client.user.id) is not None;

async def on_logout(notify = True):
  #if  connection.state.status != VoiceConnectionStatus.Destroyed :
    player.stop()

    if notify:
        requests.post(DISCORDBOT_JOIN_WEBHOOK)

def manage(channel):
    if not channel:
        return

    should_be_in = is_owner_in(channel)

    for member in channel.members:
      if member.user.id == DISCORDBOT_OWNER_ID or member.user.id == client.user.id: 
          return

      if not member.voice.deaf:
          should_be_in = False

    if not should_be_in and is_bot_in(channel):
        on_logout(is_owner_in(channel))

    if should_be_in and not is_bot_in(channel):
        play(channel)

@client.command(aliases=['s', 'sto'])
async def stop(ctx):
    player.stop()

@client.event
async def on_ready():
    print('Bot Ready')
    print(client.voice_clients)

def sigterm_handler(_signo, _stack_frame):
    player.stop()

signal.signal(signal.SIGTERM, sigterm_handler)
