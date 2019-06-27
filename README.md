# Ride Simulator (模拟运转)

模拟运转是一种广泛流行的室内外运动方式，深受国内外年轻人的喜爱。

### 为什么有这个？

相比于[“上海交通”APP](http://jtw.sh.gov.cn/shjtsjkhd/index.html)所提供的公交车实时到站信息的繁琐低效显示方式，本项目基于其数据源，设计了一种改进的公交车实时信息显示界面。
本项目使用python的flask框架构建的后台服务，以web形式显示实时信息，使用浏览器查看。

## 项目概览

### 需求

+ Python 3.4+
+ [shbus](https://github.com/hebingchang/shanghai-realtime-bus) 数据源完全基于该项目的成果，再次感谢该项目！
+ requests pycryptodome protobuf flask
+ chrome (或其他浏览器)

### 调试运行

	python rsserver.py
	
然后用浏览器访问http://127.0.0.1:5000

### 部署

+ gunicorn + nginx, 不妨参考[此处](https://spacewander.github.io/explore-flask-zh/13-deployment.html)

### 线路直达URL

+ http://127.0.0.1:5000/71路 或 http://127.0.0.1:5000/71

# 授权方式

+ MIT License


