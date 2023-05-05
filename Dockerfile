FROM node:14.16.0-slim

WORKDIR /src

COPY . . 

RUN npm install

RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

EXPOSE 3000

CMD /wait && npm run start