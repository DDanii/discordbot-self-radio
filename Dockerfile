FROM ivonet/alpine-python-s6

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY bot.py .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt 

COPY rootfs /
