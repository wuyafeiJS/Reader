## RN+dva+node+mongo+nginx+docker 从开发到部署，全栈入坑指引！

### 前言

作为一个优秀前端er，除了要精通前端基础外，其他的如后台，运维，linux等都要有所了解。这样你才能对自己所负责的项目有一个整体的把握，不同端开发思维的碰撞，有助于你形成良好的代码习惯，写出高效优质的代码。话不多说，我们开始吧！

### 背景

这是个学习型的项目，还有些需要优化的地方，项目是参考 [https://github.com/dlyt/YCool](https://github.com/dlyt/YCool) ,利用dva代替redux（个人认为dva比redux好学啊有木有，觉得redux概念不好理解的完全可以从dva入手啊，学完dva，redux秒懂）, 然后新增了一些功能。利用工作之余的时间写出来，希望能帮助到大家~

### 目录结构
```
.
├── wu-server                // 后台服务
│   ├── Dockerfile           // dockfile
│   ├── README.md
│   ├── bin                  // 入口文件
│   │   └── server.js
│   ├── config               // 配置目录
│   │   ├── env
│   │   ├── index.js
│   │   └── passport.js      // 登录认证服务
│   ├── index.js
│   ├── nginx.conf           // nginx 配置
│   ├── package-lock.json
│   ├── package.json
│   ├── release.sh           // 一键部署shell脚本
│   └── src
│       ├── middleware       // 中间件
│       ├── models           // mongo model
│       ├── modules          // 接口目录
│       └── utils            // 公用工具
└── wyfReader                // app端    
    ├── App.js
    ├── __tests__
    │   └── App.js
    ├── app
    │   ├── containers       // UI组件
    │   ├── images
    │   ├── index.js
    │   ├── libs             // 公用库
    │   ├── models           // dva models
    │   ├── router.js        // 路由
    │   ├── services         // 接口服务
    │   └── utils
    ├── app.json
    ├── index.js
    ├── jsconfig.json
    ├── package-lock.json
    ├── package.json
    └── yarn.lock
```
### 前端 

即RN项目，仅做了ios端的兼容（偷个懒^-^）。完全版的dva包含了react-router，我们这边不需要，所以只用了[dva-core](https://github.com/dvajs/dva/tree/master/packages/dva-core)

基本功能：
>* 小说搜索，动态结果列表显示，支持模糊搜索。
>*  加入书架，阅读，小说删除功能
>* 登录注册功能，node实现验证码

#### 效果图
![](http://og1m0yoqf.bkt.clouddn.com/1.gif)
![](http://og1m0yoqf.bkt.clouddn.com/2.gif)
![](http://og1m0yoqf.bkt.clouddn.com/3.gif)

### 后端

框架采用的koa2，passport作为登录认证，cheerio实现爬虫。

基本功能：
>* 提供小说操作相关的所有api
>* 提供登录注册相关api
>* node实现svg验证码
>* 定期自动更新小说爬虫

#### 部署

运行`sh release.sh`即可实现一键部署。

流行的有两种方案：pm2和docker，现在docker这么流行，咱果断选择它，写了一个自动构建脚本：release.sh

大概流程就是: 把代码上传到自己主机上面 > 构建镜像 > 然后以守护进程方式运行。

如果还想更近一步的实现自动部署的话，可以试试[travis CI](https://www.travis-ci.org/) 开源免费。它可以通过git的钩子，直接在提交到git的时候自动运行构建脚本

#### nginx 了解一下


它是一个高性能的HTTP和反向代理服务区。学习成本很低，这里咱只是简单的用nginx做了一下代理。
```
server {
  listen 80;
  location / {
    root /opt/html;
    index index.html index.html;
  }
  location /server/ {
    expires -1;
    add_header Cache-Control no-cache,no-store;
    proxy_pass http://120.79.161.255:8080/;
  }
}
```
就是原先咱需写端口访问如： http://120.79.161.255:8080/ 现在直接访问http://120.79.161.255/server/ 即可，是不是变漂亮了很多？

当然nginx远不止这点功能，比如你可以用它做负载均衡、解决跨域问题、处理缓存 防盗链等HTTP相关问题，处理起来也很容易，只需在配置文件加上相关配置即可，有兴趣朋友可以深入一下。不过话说现在service mesh好像比较流行，Envoy好像想取代它的样子~~哈哈，扯远了~


### 总结

总的来说这个项目算是一个全栈练手项目，也没有花多长时间。有些地方还是有点粗糙的，
但是不妨碍大家学习。还有些概念和工具只是大概提了一下，目的是给初学的朋友留下一个印象（万一今后有用到呢~）。感兴趣的朋友可以基于这个多多优化，加上自己idea。最后，欢迎`star & fork！！！`



