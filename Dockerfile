FROM node:6.9

WORKDIR /app

ADD . /app


RUN ["npm", "install"]

RUN ["npm", "run", "build"]


CMD ["npm", "run", "start"]
