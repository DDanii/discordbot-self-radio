FROM ivonet/alpine-python-s6

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY bot.py .

RUN pip install -r /usr/src/app/requirements.txt 

COPY rootfs /
