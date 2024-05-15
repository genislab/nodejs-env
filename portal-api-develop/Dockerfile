FROM node

COPY . /src
WORKDIR /src
RUN npm install -g typescript@latest
RUN npm install
EXPOSE 80
ENTRYPOINT ["npm", "start"]

