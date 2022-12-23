FROM ivonet/alpine-python-s6

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY bot.py .

RUN pip install -r requirements.txt 

COPY rootfs /
