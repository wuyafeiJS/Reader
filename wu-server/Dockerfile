FROM 	hub.c.163.com/library/node:8.4-slim
MAINTAINER wuyafei <wuyafeidevo@163.com>

RUN mkdir -p /opt/reader-server
ADD . /opt/reader-server

COPY ./ /opt/reader-server
WORKDIR /opt/reader-server
# RUN npm config set registry http://10.2.144.44:8081/repository/npm && \
#   NODEJS_ORG_MIRROR=http://10.2.144.44:8081/repository/node npm i --production --verbose
RUN npm i

EXPOSE 5000

CMD NODE_ENV=production node index.js
