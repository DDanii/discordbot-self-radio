discordbot-self-radio

A discord bot to play a radio stream if you are alone / no one else can hear the bot.

build:
tsc index.ts --downlevelIteration --esModuleInterop

environment variables:

DISCORDBOT_STREAM_LINK : Radio stream link example: https://25293.live.streamtheworld.com/Q_DANCE.mp3

DISCORDBOT_TOKEN : [Discord's developer portal](https://discordapp.com/developers/applications)

DISCORDBOT_OWNER_ID : [User id] (https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) to join to 


DISCORDBOT_JOIN_WEBHOOK : Optional, url to POST if someone joins to you