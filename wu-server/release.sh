BUILD_TIME=`date "+%Y%m%d%H%M"`
SERVER_HOST="root@120.79.161.225"
SERVER_PATH="/opt/wuReader"
IMAGE_NAME="hub.c.163.com/wuyafeijs/reader-server:$BUILD_TIME"

# echo "清理过时的镜像"
# docker images | awk '/^hub.c.163.com\/wuyafeijs\/reader-server[ ]+/ { print \$3 }' | xargs docker rmi
# docker build -t $IMAGE_NAME .
# docker push $IMAGE_NAME
rsync -cavzP --delete-after ./ --exclude-from='.rsync-exclude' root@120.79.161.225:$SERVER_PATH
ssh $SERVER_HOST "\
  cd $SERVER_PATH; \
  docker kill reader-server; \
  docker rm reader-server; \
  echo "清理过时的镜像"; \
  docker images | awk '/^hub.c.163.com\/wuyafeijs\/reader-server[ ]+/ { print \$3 }' | xargs docker rmi ; \
  docker build -t $IMAGE_NAME .;\
  docker run --name reader-server -p 12333:12333 -p 26666:26666 -p 8080:5000 -d --restart=always $IMAGE_NAME; \
  exit; \
  "
echo "\033[40;32m\n"
echo "Image: $IMAGE_NAME"; \
# echo "Image run success."
echo "\033[0m"
