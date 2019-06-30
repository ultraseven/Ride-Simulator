# Ride Simulator (模拟运转)

模拟运转是一种广泛流行的室内外运动方式，深受国内外年轻人的喜爱。

### 为什么有这个？

相比于[“上海交通”APP](http://jtw.sh.gov.cn/shjtsjkhd/index.html)所提供的公交车实时到站信息的繁琐低效显示方式，本项目基于其数据源，设计了一种改进的公交车实时信息显示界面。
本项目使用python的flask框架构建的后台服务，以web形式显示实时信息，使用浏览器查看。

### 界面及功能

![截屏](https://github.com/ultraseven/Ride-Simulator/blob/master/screenshots/360x640.png)
+ 网站形式，兼容主流浏览器
+ 线路起讫站，线路站点列表显示，左侧为上行，右侧为下行，站点顺序自上而下
+ 线路起点站首末班车时间
+ 线路起点站发车时间表（最多三辆，该时间表仅供参考，实际发车可能会有不同）
+ 站点间车辆名称显示（默认为车牌号），车名旁的灰色数字表示车辆距离下一站的距离（米）
+ 高亮车站名称，便于快速定位兴趣站点
+ 线路设定输入时有线路名称提示
+ 车辆定位信息刷新间隔为10秒

## 项目概览

### 后台需求

+ Python 3.4+
+ 'pip install shbus' [hebingchang/shanghai-realtime-bus](https://github.com/hebingchang/shanghai-realtime-bus) 数据源完全基于该项目的成果，感谢该项目！
+ 'pip install flask'
+ chrome (或其他浏览器)

### 调试运行

	python rsserver.py
	
然后用浏览器访问http://127.0.0.1:5000

### 部署

+ gunicorn + nginx, 不妨参考[此处](https://spacewander.github.io/explore-flask-zh/13-deployment.html)

### 线路直达URL

+ http://127.0.0.1:5000/71路 或 http://127.0.0.1:5000/71

### 车辆改名

可以将车牌号替换成自定义的名称（例如自编号）。
在data/BusName文件夹中放入以.csv为后缀名的文件，程序启动时会自动载入表格内的对应关系，具体格式参考文件夹中已有表格。
本项目不提供更多的“车牌-自编号”数据。

# 授权方式

+ MIT License


