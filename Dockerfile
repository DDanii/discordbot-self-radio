FROM lsiobase/alpine:3.22

WORKDIR /usr/src/app

COPY bot.py .
COPY requirements.txt .

RUN apk add libffi-dev libsodium-dev python3-dev ffmpeg opus-dev build-base py3-pip
RUN ln -sf python3 /usr/bin/python

RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY rootfs /

RUN if [ -d /etc/services.d ]; then chmod -R 755 /etc/services.d; fi
