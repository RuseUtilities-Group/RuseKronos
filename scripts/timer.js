// By Chris Ahn and Ethan Du Toit and Joshua Koh
//function visibilitychange(){
//	if (document.hidden) {
//	document.title = `${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject} in ${timeTilHMS()}`;
//	} else {
//	document.title = "Dashboard";
//	}
//  }
//window.addEventListener('visibilitychange', handleTabChange);
if (!localStorage.getItem("personalTimetable")) {
	window.location.href = "./landing.html"
}
var audio = new Audio("./scripts/bell.mp3");
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
	return (Math.floor((daysFrom(jan1, today) - 2) / 7) % 2) ? 'B' : 'A';
	// this is fragile
	// but the week a b system is fucked anyway ...
	// How fragile this code is... You have to change the - 3 thingy every year coz the year offsets all the time
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

var dateElement = document.getElementById("date");
const d = new Date();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
dateElement.innerHTML = `${days[d.getDay()]} ${week()}, ${ordinal_suffix_of(d.getDate())} of ${months[d.getMonth()]}, ${d.getFullYear()}`


//console.log(week())
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
		//console.log ("Uh oh");
		it = {};
	}
	for(var [k, v] of Object.entries(it)) {
		if(k.startsWith("P")) var k1 = k.split("eriod ")[0] + k.split("eriod ")[1];
		else k1 = k;
		tstr += "<tr><td id=\"time1\">";
		if(v.room == "Sport"){
			tstr += `<div class="timeSubtext">${k1}: Sport</div>`
		} else if(localStorage.getItem("breakCheck") === "1" &&  (v.room === "Recess"|| v.room === "Lunch"||v.room === "End of Day"||v.room === "Assembly"||v.room === "Transition"))  tstr += `<div class="timeSubtext">${v.room} - ${v.startTime}<div>`;
		else if(v.room === "Recess"||v.room === "Lunch"||v.room === "End of Day"||v.room === "Assembly"||v.room === "Transition");
		else if(localStorage.getItem("timeCheck") === "1" && addDetails && !v.room){
			if(localStorage.getItem("classCheck") === "1") tstr += `<div class="timeSubtext">${k1}: <b>${v.class1}</b> with ${v.teacher} - ${v.startTime}<div>`;
			else if(localStorage.getItem("classCheck") === "0") tstr += `<div class="timeSubtext">${k1}: <b>${v.subject}</b> with ${v.teacher} - ${v.startTime}<div>`;
		} else if(addDetails && !v.room) {
			if(localStorage.getItem("classCheck") === "1") tstr += `<div class="timeSubtext">${k1}: <b>${v.class1}</b> with ${v.teacher}<div>`;
			else if(localStorage.getItem("classCheck") === "0") tstr += `<div class="timeSubtext">${k1}: <b>${v.subject}</b> with ${v.teacher}<div>`;
		} else if(!v.room && !v.teacher) tstr += `<div class="timeSubtext">${k1}: Free Period<div>`;
		else if(localStorage.getItem("timeCheck") === "1" && addDetails && v.room != ""){
			if(localStorage.getItem("classCheck") === "1") tstr += `<div class="timeSubtext">${k1}: <b>${v.class1}</b> with ${v.teacher} at ${v.room} - ${v.startTime}<div>`;
			else if(localStorage.getItem("classCheck") === "0") tstr += `<div class="timeSubtext">${k1}: <b>${v.subject}</b> with ${v.teacher} at ${v.room} - ${v.startTime}<div>`;
		}else if(addDetails && v.room != "") {
			if(localStorage.getItem("classCheck") === "1") tstr += `<div class="timeSubtext">${k1}: <b>${v.class1}</b> with ${v.teacher} - ${v.room}<div>`;
			else if(localStorage.getItem("classCheck") === "0") tstr += `<div class="timeSubtext">${k1}: <b>${v.subject}</b> with ${v.teacher} - ${v.room}<div>`;
		} else if(v.subject === "Place Holder") tstr += <div class="timeSubtext">${k1}: Sport<div>`;
		tstr += "</td><td id=\"time2\">";
		tstr += "</td></tr>";
		times.push({periodName: k, timeFrom: timeStringToMS(v.startTime)});
	}
	try{
		table.innerHTML = tstr;
	} catch(error){
		setTimeout(function() {
			location.reload(); 
		  }, 1500);
	}
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
	var extraPeriod;
	var subject;
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
	periodCountdown.innerHTML = `${timeTilHMS()}`
	//console.log(timeTilHMS())
	if(tt <= 10000 && localStorage.getItem("alarmCheck") === "1") audio.play();
	if(tt <= 1000) location.reload();
	if(tt > 118200000)  document.getElementById("classTitle").innerHTML = "MONDAY'S CLASSES";
	else if(tt > 31800000) document.getElementById("classTitle").innerHTML = "TOMORROW'S CLASSES";
	try{
		period.innerHTML = `Next Event at ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].startTime} in`;
		if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Sport"){
			extraPeriod = "Sport";
			subject = "Sport";
		} else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Lunch"){
			extraPeriod = "Lunch";
			subject = "Lunch";
		} else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Recess"){
			extraPeriod = "Recess";
			subject = "Recess";
		} else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "End of Day"){
			extraPeriod = "End of Day";
			subject = "End of Day";
		} else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Assembly"){
			extraPeriod = "Assembly";
			subject = "Assembly";
		} else if(json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room === "Transition"){
			extraPeriod = "Transition";
			subject = "Transition";
		} else if(localStorage.getItem("classCheck") === "1"){
			extraPeriod = `${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].class1} with ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].teacher}<br>in Room ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room}`
			subject = json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].class1
		} else if(!json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room){
			extraPeriod = `${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject} with ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].teacher}`
			subject = json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject
		}else{
			extraPeriod = `${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject} with ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].teacher}<br>in Room ${json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].room}`
			subject = json.timetableData[dateNamesTo[day()].toLowerCase() + week()][times[next].periodName].subject
		}
		periodInfo.innerHTML = extraPeriod;
		setInterval(function(){
			document.querySelector('title').textContent = `${subject} in ${timeTilHMS()}`;
		}, 1000);
	} catch{}
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
