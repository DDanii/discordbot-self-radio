FROM ivonet/alpine-python-s6

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY bot.py .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt 

RUN apk add libffi-dev libsodium-dev python3-dev ffmpeg

COPY rootfs /

RUN if [ -d /etc/services.d ]; then chmod -R 755 /etc/services.d; fi