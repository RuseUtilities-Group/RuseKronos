// By Chris Ahn and Ethan Du Toit and Joshua Koh
let next = 0;
let jsonPath = 'scripts/';
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
	tstr = "";
	it = json.timetableData[dateNamesTo[day()].toLowerCase() + week()];
	if (it === undefined) {
		console.log ("Uh oh");
		it = {};
	}
	for(var [k, v] of Object.entries(it)) {
		tstr += "<tr><td id=\"time1\">";
		if(v.room == "Sport"){
			tstr += `<div class="timeSubtext">${k}: Sport</div>`
		}else if(!v.room){
			switch(k){
				case "P1": k = "Period 1"
				break;
				case "P2": k = "Period 2"
				break;
				case "P3": k = "Period 3"
				break;
				case "P4": k = "Period 4"
				break;
				case "P5": k = "Period 5"
				break;
				case "P6": k = "Period 6"
				break;
				case "P7": k = "Period 7"
				break;
				case "P8": k = "Period 8"
				break;
			}
			if(!v.room && k !== "Recess" && k !== "Assembly" && k !=="Lunch" && k !== "End of Day")
			tstr +=  `<div class="timeSubtext">${k} - ${v.startTime}</div>`

		}else if(addDetails && v.room) {
			tstr += `<div class="timeSubtext">${k}: ${v.subject} with ${v.teacher} - ${v.room}<div>`;
		}
		tstr += "</td><td id=\"time2\">";
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
		today.setDate(today.getDate()+1); //tomorrow comes today
		gen_table(json);
		updateDay();
	}
}
function update(json) {
	periodCountdown = document.getElementById("periodCountdown")
	periodInfo = document.getElementById("periodInfo")
	period = document.getElementById("period");
	moveDay(json);
	let tt = timeTil();   
	while (tt < 0) {
		next++;
		moveDay(json);
		tt = timeTil();
	}
	period.innerHTML = `Next Event at ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].startTime}`
	periodCountdown.innerHTML = `${timeTilHMS()}`
	if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Sport") periodInfo.innerHTML = "Sport";
	else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Lunch") periodInfo.innerHTML = "Lunch";
	else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Recess") periodInfo.innerHTML = "Recess";
	else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "End of Day") periodInfo.innerHTML = "End of Day";
	else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Assembly") periodInfo.innerHTML = "Assembly";
	else if(!json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject) period.innerHTML = `${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].name} in`;
	else periodInfo.innerHTML = `${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject} with ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].teacher}<br>in Room ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room}`
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
	gen_table(json);
	updateDay();
	update(json);
	window.setInterval(update, 1000);
};
xhr.send();
