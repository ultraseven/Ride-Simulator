// JavaScript Document
var stop1 = [];
var stop2 = [];
var bus11 = [];
var bus12 = [];
var bus13 = [];
var bus21 = [];
var bus22 = [];
var bus23 = [];
var start11 = [];
var start12 = [];
var start21 = [];
var start22 = [];

var linename;

var d1r = 0;
var d2r = 0;

var linelist = [];

var refreshBusInterval = 10000;
var refreshStartInterval = 30000;
var TO_bus = 0;
var TO_start = 0;

function refreshBus() {
	getBus();
	TO_bus = setTimeout(refreshBus, refreshBusInterval);
}

function refreshStart() {
	getStart();
	TO_start = setTimeout(refreshStart, refreshStartInterval);
}

function init() {
	var il1 = window.location.pathname.replace('/', '');
	var il2 = window.location.href.split('?', 2)[1];
	var il = il1 || il2;
	if (il != undefined) {
		document.getElementById("ln").value = decodeURI(il);
		changeLine();
	}
	initLineList();
}

function initLineList() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			linelist = JSON.parse(http.responseText).sort();
		}
	}
	http.open("GET", 'line/all', true);
	http.send();
}



function searchLine() {
	var kw = document.getElementById("ln").value;
	if (kw.length == 0 || kw == '路') {
		document.getElementById("list").innerHTML = '';
		return;
	}
	var lstr = '<ul>';
	for (var i = 0, l = linelist.length; i < l; i++) {
		if (linelist[i].indexOf(kw) == 0) {
			lstr = lstr + "<li onclick=\"goLine(\'" + linelist[i] + "\')\">" + linelist[i] + '</li>';
		}
	}
	for (var i = 0, l = linelist.length; i < l; i++) {
		if (linelist[i].indexOf(kw) > 0) {
			lstr = lstr + "<li onclick=\"goLine(\'" + linelist[i] + "\')\">" + linelist[i] + '</li>';
		}
	}
	lstr = lstr + '</ul>';
	if (lstr == '<ul></ul>') {
		document.getElementById("list").innerHTML = '';
	} else {
		document.getElementById("list").innerHTML = lstr;
	}
}

function goLine(ln) {
	document.getElementById("ln").value = ln;
	changeLine();

}

function clear() {
	document.getElementById("ln").value = '';
	document.getElementById("rnt").innerHTML = '&nbsp;';
	document.getElementById("sns1").innerHTML = '';
	document.getElementById("sns2").innerHTML = '';
	document.getElementById("sne1").innerHTML = '';
	document.getElementById("sne2").innerHTML = '';
	document.getElementById("sts1").innerHTML = '';
	document.getElementById("sts2").innerHTML = '';
	document.getElementById("ste1").innerHTML = '';
	document.getElementById("ste2").innerHTML = '';
	document.getElementById("cont1").innerHTML = '';
	document.getElementById("cont2").innerHTML = '';
	document.getElementById("sm").style.backgroundColor = "#DDDDDD";
	document.title = '模拟运转';
	d1r = 0;
	d2r = 0;
}


function changeLine() {
	document.getElementById("list").innerHTML = '';
	var ln = document.getElementById("ln").value;
	if (ln != '') {
		start11 = [];
		start12 = [];
		start21 = [];
		start22 = [];
		window.clearInterval(TO_start);
		window.clearInterval(TO_bus);
		getLineInfo(ln);
	}
}


function getLineInfo(ln) {
	document.getElementById("sm").style.backgroundColor = "#FFCC00";
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var info = JSON.parse(http.responseText);
			getInfo(info);
		} else if (http.readyState == 4) {
			document.getElementById("sm").style.backgroundColor = "#FFDDDD";
		}
	}
	http.open("GET", 'info/' + encodeURIComponent(ln), true);
	http.send();
}



function getBus() {
	if (document.getElementById("ln").value == '') {
		return;
	}
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var bus = JSON.parse(http.responseText);
			loadBus(bus);
			document.getElementById("rnt").innerHTML = getTimeNow();
		} else if (http.readyState == 4) {
		}
	}
	http.open("GET", 'bus/' + linename, true);
	http.send();
}

function getStart() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var start = JSON.parse(http.responseText);
			loadStart(start);
		}
	}
	http.open("GET", 'start/' + linename, true);
	http.send();
}


function getStop() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var stop = JSON.parse(http.responseText);
			loadStop(stop);
			document.getElementById("sm").style.backgroundColor = "#DDDDDD";
		}
	}
	http.open("GET", 'stop/' + linename, true);
	http.send();
}

function getInfo(info) {
	clear();
	linename = info['linename'];
	document.title = linename + ' → 模拟运转';
	document.getElementById("ln").value = linename;
	if (info['success'] == 1) {
		document.getElementById("sns1").innerHTML = info["sns1"];
		document.getElementById("sns2").innerHTML = info["sns2"];
		document.getElementById("sne1").innerHTML = info["sne1"];
		document.getElementById("sne2").innerHTML = info["sne2"];
		document.getElementById("sts1").innerHTML = info["sts1"];
		document.getElementById("sts2").innerHTML = info["sts2"];
		document.getElementById("ste1").innerHTML = info["ste1"];
		document.getElementById("ste2").innerHTML = info["ste2"];
	}
	d1r = 0;
	d2r = 0;
	getStop();
}


function loadBus(bus) {
	bus11 = [];
	bus12 = [];
	bus13 = [];
	var b1 = bus["0"];
	for (var b in b1) {
		bus11.push(b1[b][0]);
		bus12.push(b);
		bus13.push(b1[b][1]);
	}
	[bus13, bus12, bus11] = arraysSort(bus13, bus12, bus11)
	bus21 = [];
	bus22 = [];
	bus23 = [];
	var b2 = bus["1"];
	for (var b in b2) {
		bus21.push(b2[b][0]);
		bus22.push(b);
		bus23.push(b2[b][1]);
	}
	[bus23, bus22, bus21] = arraysSort(bus23, bus22, bus21)
	makeStopBus();
}

function loadStart(start) {
	start11 = start["0"][0];
	start12 = start["0"][1];

	start21 = start["1"][0];
	start22 = start["1"][1];
}

function loadStop(stop) {
	stop1 = [];
	var s1 = stop["0"];
	for (var i = 0; i < s1.length; i++) {
		id = i;
		name = s1[i];
		stop1[id] = name;
	}
	stop2 = [];
	var s2 = stop["1"];
	for (var i = 0; i < s2.length; i++) {
		id = i;
		name = s2[i];
		stop2[id] = name;
	}

	makeStop();
}

function makeStop() {
	var cont1 = document.getElementById("cont1");
	var cont2 = document.getElementById("cont2");

	var str = '';
	for (var i = 0; i < stop1.length; i++) {
		str = str + '<div class="stop1">' + stop1[i] + '</div>';
	}
	cont1.innerHTML = str;

	str = '';
	for (var i = 0; i < stop2.length; i++) {
		str = str + '<div class="stop2">' + stop2[i] + '</div>';
	}
	cont2.innerHTML = str;

	refreshStart();
	refreshBus();
}

function makeStopBus() {
	var cont1 = document.getElementById("cont1");
	var cont2 = document.getElementById("cont2");
	var str = '';
	
	for (var k = start11.length - 1; k >= 0; k = k - 1) {
		cls = 'bus1 pd';
		str = str + '<div class="' + cls + '">' + '<span class="dis">' + start12[k] + '</span>' + start11[k] + '</div>';
	}
	for (var i = 0; i < stop1.length; i++) {
		for (var j = bus11.length - 1; j >= 0; j = j - 1) {
			if (bus11[j] == i) {
				cls = 'bus1 px';
				str = str + '<div class="' + cls + '">' + '<span class="dis">' + bus13[j] + '</span>' + bus12[j] + '</div>';
			}
		}
		str = str + '<div class="stop1" id="d1' + i + '" onclick="c1(' + i + ')">' + stop1[i] + '</div>';
	}
	cont1.innerHTML = str;
	c1(0);

	str = '';
	for (var k = start21.length - 1; k >= 0; k = k - 1) {
		cls = 'bus2 pd';
		str = str + '<div class="' + cls + '">' + start21[k] + '<span class="dis">' + start22[k] + '</span>' + '</div>';
	}
	for (var i = 0; i < stop2.length; i++) {
		for (var j = bus21.length - 1; j >= 0; j = j - 1) {
			if (bus21[j] == i) {
				cls = 'bus2 px';
				str = str + '<div class="' + cls + '">' + bus22[j] + '<span class="dis">' + bus23[j] + '</span>' + '</div>';
			}
		}
		str = str + '<div class="stop2" id="d2' + i + '" onclick="c2(' + i + ')">' + stop2[i] + '</div>';
	}
	cont2.innerHTML = str;
	c2(0);

}

function c1(i) {
	if (i == 0) {
		if (d1r != 0) {
			document.getElementById("d1" + d1r).style.color = "#F00";
		}
	} else if (i == d1r) {
		document.getElementById("d1" + i).style.color = "#000";
		d1r = 0;
	} else {
		if (d1r != 0) {
			document.getElementById("d1" + d1r).style.color = "#000";
		}
		document.getElementById("d1" + i).style.color = "#F00";
		d1r = i;
	}
}

function c2(i) {
	if (i == 0) {
		if (d2r != 0) {
			document.getElementById("d2" + d2r).style.color = "#F00";
		}
	} else if (i == d2r) {
		document.getElementById("d2" + i).style.color = "#000";
		d2r = 0;
	} else {
		if (d2r != 0) {
			document.getElementById("d2" + d2r).style.color = "#000";
		}
		document.getElementById("d2" + i).style.color = "#F00";
		d2r = i;
	}
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

function getTimeNow() {
	var today = new Date();
	var h = checkTime(today.getHours());
	var m = checkTime(today.getMinutes());
	var s = checkTime(today.getSeconds());
	return h + ":" + m + ":" + s;
}

function arraysSort(a1, a2, a3) {
	var arr_len = a1.length;
	for (var i = 0; i < arr_len; i++) {
		for (var j = 0; j < arr_len - i - 1; j++) {
			if (compareDistance(a1[j], a1[j + 1])) {
				aa1 = a1[j];
				aa2 = a2[j];
				aa3 = a3[j];
				a1[j] = a1[j + 1];
				a2[j] = a2[j + 1];
				a3[j] = a3[j + 1];
				a1[j + 1] = aa1;
				a2[j + 1] = aa2;
				a3[j + 1] = aa3;
			}
		}
	}
	return [a1, a2, a3];
}

function compareDistance(a, b) {
	var aa = 0;
	var bb = 0;
	if (a == '*') {
		aa = -1;
	} else {
		aa = parseInt(a);
	}
	if (b == '*') {
		bb = -1;
	} else {
		bb = parseInt(b);
	}
	if (aa > bb) {
		return true;

	} else {
		return false;
	}
}
