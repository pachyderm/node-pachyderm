FROM siomiz/node-opencv:2.4.x

WORKDIR /

COPY package*.json /

RUN npm install

COPY edges.js /edges.js

CMD ["node", "edges.js"]