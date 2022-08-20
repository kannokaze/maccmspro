#FROM php:7.2.4-fpm
FROM php:7.3.33-fpm-alpine3.15
#alpine国内镜像及修改方法
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
MAINTAINER kannokaze <1131429439@qq.com>
LABEL description="php-fpm nginx 镜像，已开启FCGI nginx，可用于web服务，也可以用于运行 cli 程序。"

#查看系统版本
RUN cat /proc/version
ENV TIMEZONE Asia/Shanghai
ENV PHP_MEMORY_LIMIT 512M
ENV MAX_UPLOAD 50M
ENV PHP_MAX_FILE_UPLOAD 200
ENV PHP_MAX_POST 100M

USER root

#1、PHP源码文件目录自带扩展 docker-php-ext-install直接安装
#2、pecl扩展 因为一些扩展不包含在PHP源码文件中，PHP 的扩展库仓库中存在。用 pecl install 安装扩展，再用 docker-php-ext-enable 命令 启用扩展
#3、其他扩展 一些既不在 PHP 源码包，也不再 PECL 扩展仓库中的扩展，可以通过下载扩展程序源码，编译安装的方式安装
# 扩展版本号定义
#redis 扩展
ENV PHPREDIS_VERSION 5.3.4
ENV SWOOLE_VERSION 4.5.2

# 扩展依赖
RUN apk update \
RUN  apk add \
        curl \
        wget \
        git \
        zip \
        libz-dev \
        libssl-dev \
        libnghttp2-dev \
        libpcre3-dev \
        libmemcached-dev \
		sendmail \
        zlib1g-dev \
		passwd \
		g++ \
		pcre \
		pcre-devel \
		gcc \
		gcc-c++ \
		autoconf \
		automake \
		make \
		zlib-dev \
		openssl \
		openssl-devel \
		glibc-devel
RUN apk add sudo
RUN sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' \
      -i /etc/sudoers

#时区扩展
RUN apk add tzdata \
  && cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime \
  && echo "${TIMEZONE}" > /etc/timezone

#GD库扩展
#RUN apk add freetype-dev
#RUN docker-php-source extract
#RUN cd /usr/src/php/ext/gd
#RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/freetype2
#RUN docker-php-ext-install gd

#RUN apk add libwebp-dev libjpeg-turbo-dev libpng-dev  freetype-dev
#RUN docker-php-source extract
#RUN cd /usr/src/php/ext/gd
#RUN docker-php-ext-configure gd --with-webp-dir=/usr/include/webp --with-jpeg-dir=/usr/include --with-png-dir=/usr/include --with-freetype-dir=/usr/include/freetype2
#RUN docker-php-ext-install gd
#RUN cd /usr/src && docker-php-source delete

RUN apk add libwebp-dev libjpeg-turbo-dev libpng-dev  freetype-dev
RUN docker-php-ext-configure gd --with-webp-dir --with-jpeg-dir --with-png-dir --with-zlib-dir --with-freetype-dir
RUN docker-php-ext-install gd

# zip 扩展
RUN apk add libzip-dev && docker-php-ext-install zip

# Mysqli 扩展 自带 直接安装即可(当前数据库使用的mysqli查询的)
RUN docker-php-ext-install mysqli
# PDO 扩展 自带 直接安装即可
RUN docker-php-ext-install pdo_mysql
# Bcmath 扩展 自带 直接安装即可
RUN docker-php-ext-install bcmath

#RUN set -xe \
#    && apk add --no-cache --virtual .phpize-deps $PHPIZE_DEPS

# Redis 扩展下载 pecl本地安装 开启扩展
#RUN wget http://pecl.php.net/get/redis-${PHPREDIS_VERSION}.tgz -O /tmp/redis.tgz \
#    && pecl install /tmp/redis.tgz \
#    && rm -rf /tmp/redis.tgz \
#    && docker-php-ext-enable redis

# Composer安装
#RUN curl -sS https://getcomposer.org/installer | php \
#   && mv composer.phar /usr/local/bin/composer \
#   && composer self-update --clean-backups
# Swoole 扩展安装 开启扩展
#RUN pecl install https://pecl.php.net/get/swoole-4.5.2.tgz \
#    && docker-php-ext-enable swoole

#添加用户
# 创建www 组和www 用户，用于运行nginx，否则用root 权限太大太危险
RUN addgroup -S nginx && adduser -DHS -s /sbin/nologin -G nginx nginx

#nginx安装 apk 方式默认开机启动 默认安装目录 /etc/nginx
RUN apk add nginx=1.20.2-r1
RUN chown -R nginx:nginx /var/lib/nginx
EXPOSE 80

COPY / /usr/share/nginx/html
RUN chown -R www-data:www-data /usr/share/nginx/html

# 配置default.conf替换默认设置
RUN rm
-rf /etc/nginx/http.d/default.conf
ADD default.conf /etc/nginx/http.d

# 启动nginx，启动之前先检查一下配置文件是否正确
RUN nginx -t
ENTRYPOINT php-fpm -D  && nginx -g "daemon off;"
