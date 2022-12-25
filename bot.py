import os
import signal
import ctypes
import ctypes.util
import logging
from sys import stdout
import requests
import discord
from discord import FFmpegPCMAudio


# Define logger
logger = logging.getLogger('mylogger')

logger.setLevel(logging.DEBUG) # set logger level
logFormatter = logging.Formatter\
("%(name)-12s %(asctime)s %(levelname)-8s %(filename)s:%(funcName)s %(message)s")
consoleHandler = logging.StreamHandler(stdout) #set streamhandler to stdout
consoleHandler.setFormatter(logFormatter)
logger.addHandler(consoleHandler)


DISCORDBOT_TOKEN = os.getenv('DISCORDBOT_TOKEN')
DISCORDBOT_STREAM_LINK = os.getenv('DISCORDBOT_STREAM_LINK')
DISCORDBOT_OWNER_ID = os.getenv('DISCORDBOT_OWNER_ID')
DISCORDBOT_JOIN_WEBHOOK = os.getenv('DISCORDBOT_JOIN_WEBHOOK')

intents = discord.Intents.default()

client = discord.Client(intents=intents)


#@client.command(aliases=['p', 'pla'])
#async def play(ctx, url: str = DISCORDBOT_STREAM_LINK):
#   channel = ctx.message.author.voice.channel
async def play(channel, url: str = DISCORDBOT_STREAM_LINK):
    global player

    logger.debug("ctypes - Find opus:")
    a = ctypes.util.find_library('opus')
    logger.debug(a)
 
    logger.debug("Discord - Load Opus:")
    b = discord.opus.load_opus(a)
    logger.debug(b)
    
    logger.debug("Discord - Is loaded:")
    c = discord.opus.is_loaded()
    logger.debug(c)

    player = await channel.connect()
    player.play(FFmpegPCMAudio(url))

def is_owner_in(channel: discord.VoiceChannel):
    return any(m.id == int(DISCORDBOT_OWNER_ID) for m in channel.members)

def is_bot_in(channel: discord.VoiceChannel):
    return any(m.id == client.user.id for m in channel.members)

async def on_logout(notify = True):
  #if  connection.state.status != VoiceConnectionStatus.Destroyed :
    logger.debug("player stop")
    player.stop()

    if notify:
        requests.post(DISCORDBOT_JOIN_WEBHOOK, timeout=30)

async def manage(channel: discord.VoiceChannel):
    if not channel:
        return

    should_be_in = is_owner_in(channel)

    for member in channel.members:
        if member.id == int(DISCORDBOT_OWNER_ID) or member.id == client.user.id:
            continue

        if not member.voice.deaf:
            should_be_in = False

    if not should_be_in and is_bot_in(channel):
        await on_logout(is_owner_in(channel))

    if should_be_in and not is_bot_in(channel):
        await play(channel)

# @client.command(aliases=['s', 'sto'])
# async def stop(ctx):
#     player.stop()

@client.event
async def on_ready():
    logger.info('Bot Ready')
    for channel in client.get_all_channels():
        if isinstance(channel, discord.VoiceChannel) and is_owner_in(channel):
            await manage(channel)
            return

@client.event
async def on_voice_state_update(member, before, after):
    if member.id == client.user.id:
        return

    await manage(before.channel)
    await manage(after.channel)

async def sigterm_handler(_signo, _stack_frame):
    logger.info("Bot shutting down")
    await on_logout(False)

signal.signal(signal.SIGTERM, sigterm_handler)

client.run(DISCORDBOT_TOKEN)
