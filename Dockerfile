FROM library/node:slim

COPY . /app

# disable strict-ssl in order to avoid error with self-signed certificates
RUN npm config set strict-ssl false

# get lates npm version
RUN npm i npm@latest -g

RUN cd /app \
  && npm install --production

WORKDIR /app

CMD ["node", "jabber_env_bot.js", "DEBUG=bot"]