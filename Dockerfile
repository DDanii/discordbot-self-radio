FROM ivonet/alpine-python-s6

# Create app directory
WORKDIR /usr/src/app

RUN pip install -r requirements.txt 

# Bundle app source
COPY bot.py .

COPY rootfs /

#CMD [ "node", "index.js" ]
