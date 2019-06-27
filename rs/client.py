import os
import csv
import shbus.realtime
import shbus.lineinfo

def readTableFromDir(path, postfix=".csv"):
	data = dict()
	if os.path.isdir(path):
		files = os.listdir(path)
		for file in files:
			if not os.path.isdir(file):
				if os.path.splitext(file)[1] == postfix:
					with open(os.path.join(path,file),'r') as f:
						reader = csv.reader(f)
						for row in reader:
							if len(row) >= 2:
								data[row[0].strip()] = row[1].strip()
	return data

class RSClient(shbus.realtime.client):
	stationNumCache = dict()
	LineNameTable = readTableFromDir('data/LineName')
	BusNameTable = readTableFromDir('data/BusName')

	
	def getAllLines(self):
		return list(self.lines)
		
	def hasLine(self, line):
		if line in self.lines:
			return True
		else:
			return False
		
	def getStationNum(self, line_name, direction=True):
		if direction:
			dir = 0
		else:
			dir = 1
		if (line_name not in RSClient.stationNumCache.keys()):
			response = self.getRealtimeBus(line_name)
			RSClient.stationNumCache[line_name] = \
				[len(response.info.routes[0].names),
				 len(response.info.routes[1].names)]
		return RSClient.stationNumCache[line_name][dir]
			
	def getBusesByStopID(self, line_name, stopID=1, direction=True):
		return self.getRealtimeBus(line_name, stopID, direction, False)

	def getAllBusesByDirection(self, line_name, direction=True):
		car = dict()

		stop = self.getStationNum(line_name, direction) - 1
		while(stop > 0):
			buses = self.getBusesByStopID(line_name, stop, direction)
			dis_max = min(stop, 20)
			dis_n1 = 0
			dis_n2 = 0
			if hasattr(buses,'items'):
				for bus in buses.items:
					if not hasattr(bus, 'stops'): continue
					dis = bus.stops
					pz = self.transBusName(bus.vehicle)
					if (dis == 'null' or dis == '' or dis<1):
						pass
					elif (dis == 1):
						dis_n1 += 1
						if (pz not in car.keys() or car[pz][1]=="*"):
							car[pz] = [stop, bus.distance]
					else:
						car[pz] = [stop - dis + 1, "*"]
						dis_n1 += 1
						dis_n2 = 1
						if (dis_max > dis):
							dis_max = dis
			dis_max -= 1
			if (dis_max > 1): dis_max -= 1
			if (dis_n1 == 0): break 
			if (dis_n2 == 0 and dis_n1 < 3): break 
			if (dis_n2 == 0 and dis_n1 == 3): dis_max = 1
			stop=stop-dis_max
		
		return car
		
	def getAllBuses(self, line_name):
		return {"0":self.getAllBusesByDirection(line_name, True),
				"1":self.getAllBusesByDirection(line_name, False)}
		
	def getStations(self, line_name):
		response = self.getRealtimeBus(line_name)
		RSClient.stationNumCache[line_name] = \
			[len(response.info.routes[0].names),
			 len(response.info.routes[1].names)]
		return {"0":list(response.info.routes[0].names),
				"1":list(response.info.routes[1].names)}
		
	def getStartTimeByDirection(self, line_name, direction=True):
		car_pz = list()
		start_time = list()
		buses = self.getBusesByStopID(line_name, 0, direction)
		if hasattr(buses,'items'):
			for bus in buses.items:
				if hasattr(bus, 'time'):
					car_pz.append(self.transBusName(bus.vehicle))
					start_time.append(bus.time)
		return [car_pz,start_time]
		
	def getStartTime(self, line_name):
		return {"0":self.getStartTimeByDirection(line_name, True),
				"1":self.getStartTimeByDirection(line_name, False)}

	def getInfo(self, line_name):
		basic_info = shbus.lineinfo.LineInfo(self.transLineName(line_name))
		
		info = dict()
		
		info["success"] = 1
		info["linename"] = line_name
		info["sts1"] = basic_info.up.early_time
		info["ste1"] = basic_info.up.last_time
		info["sts2"] = basic_info.down.early_time
		info["ste2"] = basic_info.down.last_time

		info["sns1"] = basic_info.up.first_station
		info["sne1"] = basic_info.up.last_station
		info["sns2"] = basic_info.down.first_station
		info["sne2"] = basic_info.down.last_station

		return info
		
	def transLineName(self, line_name):
		if line_name in RSClient.LineNameTable:
			return RSClient.LineNameTable[line_name]
		else:
			return line_name
		
	def transBusName(self, pz):
		if pz in RSClient.BusNameTable:
			return RSClient.BusNameTable[pz]
		else:
			return pz
		
