# maccmspro
## 1. 使用说明
maccms_pro版本的docker镜像源文件，可使用docker build命令构建
```
docker build -t maccmspro:v1.0.1 .
```
## 2.项目介绍
1. 基于nginx搭建的服务器环境，如果需要构建成其他环境，请修改Dockerfile文件
2. 镜像集成nginx、php
3. 如果需要自定义需要修改Dockerfile里面的步骤
