FROM node:carbon

WORKDIR ./app

COPY . .

RUN npm i

CMD [ 'npm' 'run' 'build' ]
