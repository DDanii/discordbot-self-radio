import sys
import os
import signal
import logging
from sys import stdout
import requests
import discord
import asyncio
import threading
from discord import FFmpegPCMAudio

# Define logger
logger = logging.getLogger('bot')

logger.setLevel(logging.DEBUG) # set logger level
logFormatter = logging.Formatter\
("%(asctime)s [%(levelname)-8s] %(name)-12s: %(message)s")
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

    player = await channel.connect()
    player.play(FFmpegPCMAudio(url))

def is_owner_in(channel: discord.VoiceChannel):
    return any(m.id == int(DISCORDBOT_OWNER_ID) for m in channel.members)

def is_bot_in(channel: discord.VoiceChannel):
    return any(m.id == client.user.id for m in channel.members)

async def on_logout(notify = True):
    logger.debug("on_logout")
    if 'player' in globals():
        logger.info("player stop")
        await player.disconnect()

    if notify and DISCORDBOT_JOIN_WEBHOOK:
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

def async_runner():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.run_until_complete(on_logout(False))
    loop.close()

def shutdown(sig, frame):
    logger.info("Received exit signal ...")
    thread = threading.Thread(target=async_runner)
    thread.start()
    sys.exit(0)

signals = (signal.SIGHUP, signal.SIGTERM, signal.SIGINT)
for s in signals:
    signal.signal(s, shutdown)

client.run(DISCORDBOT_TOKEN)
