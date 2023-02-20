FROM crazymax/alpine-s6

# Create app directory
WORKDIR /usr/src/app

ENV S6_KEEP_ENV=1

# Bundle app source
COPY bot.py .
COPY requirements.txt .

RUN apk add libffi-dev libsodium-dev python3-dev ffmpeg opus-dev build-base py3-pip

RUN pip install --no-cache-dir -r requirements.txt 

COPY rootfs /

RUN if [ -d /etc/services.d ]; then chmod -R 755 /etc/services.d; fi