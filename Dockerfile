#FROM node:boron
#
#RUN mkdir -p /usr/src/app
#
#WORKDIR /usr/src/app
#
##ADD . /app
#
#COPY package.json /app
#
#RUN npm install
#
#COPY . /app

FROM node:4-onbuild

EXPOSE 8080



#RUN ["npm", "install"]

#RUN ["npm", "run", "build"]


#CMD ["npm", "run", "start"]

