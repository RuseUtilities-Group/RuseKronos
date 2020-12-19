// By Chris Ahn and Ethan Du Toit
let next = 0;
let jsonPath = 'Scripts/';
let times = [];
let today = new Date();
let jan1 = new Date();
let addDetails = false;
jan1.setMonth(0);
jan1.setDate(1);
jan1.setHours(0,0,0,0);
function day() {return today.getDay();}
let dateNamesFrom = {"sunday":0, "monday":1, "tuesday":2, "wednesday":3,
	"thursday":4, "friday":5, "saturday":6}
let dateNamesTo = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
	"Friday", "Saturday"]
today.setHours(0,0,0,0);

function daysFrom(date1, date2) {
	let ndate1 = new Date(date1.getTime());
	let ndate2 = new Date(date2.getTime());
	ndate1.setHours(0,0,0,0);
	ndate2.setHours(0,0,0,0);
	return Math.round((ndate2 - ndate1) / (1000 * 60 * 60 * 24));
}
function week() {
	return (Math.floor((daysFrom(jan1, today) - 4) / 7) % 2) ? 'B' : 'A';
	// this is fragile
	// but the week a b system is fucked anyway ...
}

function timeTil() {
	return (times[next].timeFrom + today.getTime()) - Date.now();
}
function timeTilHMS() {
	let tt = timeTil();
	let s = Math.floor(tt / 1000) %60;
	let m = Math.floor(tt / (1000 * 60)) %60;
	let h = Math.floor(tt / (1000 * 60 * 60));
	return String(h).padStart(2, '0') + ':' +
		String(m).padStart(2, '0') + ':' +
		String(s).padStart(2, '0');
}
function timeStringToMS(timeString) {
	let splut = timeString.split(":")
		.map(function(x) {return parseInt(x, 10);});
	console.assert(splut.length == 2, "Valid time string 1");
	console.assert(splut[0] < 24, "Valid time string 2");
	console.assert(splut[1] < 60, "Valid time string 3");
	return 1000*(splut[0]*60*60 + splut[1]*60);
}
function gen_table(json) {
	table = document.getElementById("times");
	console.log(table);
	tstr = "";
	it = json.timetableData[dateNamesTo[day()].toLowerCase() + week()];
	if (it === undefined) {
		console.log ("Uh oh");
		it = {};
	}

	for(const [k, v] of Object.entries(it)) {
		tstr += "<tr><td id=\"time1\">";
		tstr += k;
		if(addDetails && v.room != "") {
			tstr += `: ${v.subject}<br><div class="timeSubtext">at ${v.room} with ${v.teacher}<div>`;
		}
		tstr += "</td><td id=\"time2\">";
		tstr += v.startTime;
		tstr += "</td></tr>";
		times.push({periodName: k, timeFrom: timeStringToMS(v.startTime)});
	}
	table.innerHTML = tstr;
	times.sort(function(a, b) {return a.timeFrom - b.timeFrom;});
}

function updateDay() {
	document.getElementById("day").innerHTML = dateNamesTo[day()];
}

function moveDay(json) {
	while (next == times.length) {
		//this only occurs in the event that
		//the next period is tomorrow
		next = 0;
		times = [];
		console.log(next, times.length)
		today.setDate(today.getDate()+1); //tomorrow comes today
		gen_table(json);
		updateDay();
	}
}
function update(json) {
	timer = document.getElementById("timer");
	period = document.getElementById("period");
	moveDay(json);
	let tt = timeTil();   
	while (tt < 0) {
		console.log("iteration");
		next++;
		moveDay(json);
		tt = timeTil();
	}
	timer.innerHTML = timeTilHMS();
	if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject != "") {
		period.innerHTML = `${times[next].periodName}: ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject}`;
	}
	else {
		period.innerHTML = times[next].periodName;
	}
}

let xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', jsonPath + 'bellTimes.json', true);
xhr.onload = function () {
	if (localStorage.getItem("personalTimetable") === null) {
		json = xhr.response;
	}
	else {
		json = JSON.parse(localStorage.getItem("personalTimetable"));
		addDetails = true;
	}
	console.log(json);
	gen_table(json);
	updateDay();
	update(json);
	window.setInterval(update, 1000);
};
xhr.send();