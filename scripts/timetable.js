// By Chris Ahn and Ethan Du Toit
var listOfDays = ['mondayA', 'tuesdayA', 'wednesdayA', 'thursdayA', 'fridayA', 'mondayB', 'tuesdayB', 'wednesdayB', 'thursdayB', 'fridayB'];

function gen_table(json) {
	table = document.getElementById("timetable");
	tableIn = "";
	it = json.timetableData;
	if (it === undefined) {
		console.log ("Error: Variable 'it' is not defined.");
		it = {};
	}

	var period;
	var startTime;
	var teacher;
	var room;
	for(var day = 0; day < 10; day++) {
		if(day % 5 == 0) {
			tableIn += "<tr id=\"Weeks\">";
		}
		tableIn += "<td id=\"timetableTd\"><table id=\"timetableDay\">";
		tableIn += `<tr><th style="padding-left: 14px">${listOfDays[day].substring(0, listOfDays[day].length-1)[0].toUpperCase() + listOfDays[day].substring(0, listOfDays[day].length-1).slice(1) + " " + listOfDays[day][listOfDays[day].length-1]}</th></tr>`;
		period = 1;
		while(typeof it[listOfDays[day]][`Period ${period}`] !== "undefined") {
			tableIn += "<tr>";

			startTime = it[listOfDays[day]][`Period ${period}`].startTime;
			teacher = it[listOfDays[day]][`Period ${period}`].teacher;
			subject = it[listOfDays[day]][`Period ${period}`].subject;
			room = it[listOfDays[day]][`Period ${period}`].room;

			if(startTime.startsWith("9") || startTime.startsWith("8")) startTime = "0" + startTime

			if((day % 5 != 2 && period == 3) || (day % 5 == 2 && period == 2)) {
				startTime = it[listOfDays[day]]["Recess"].startTime;
				tableIn += `<tr><td style="padding-left: 14px;">Recess</td>`;
				tableIn += `<td id="startTimeTd" style="padding-left: 7px"></td>`;
				tableIn += `<td id="startTimeTd" style="padding-left: 7px">${startTime}</td>`;
				tableIn += "</tr>";
			}
			if((day % 5 != 2 && period == 5) || (day % 5 == 2 && period == 4)) {
				startTime = it[listOfDays[day]]["Lunch"].startTime;
				tableIn += `<tr><td style="padding-left: 14px;">Lunch</td>`;
				tableIn += `<td id="startTimeTd" style="padding-left: 7px"></td>`;
				tableIn += `<td id="startTimeTd" style="padding-left: 7px">${startTime}</td>`;
				tableIn += "</tr>";
			}
			if(teacher !== "") {
				tableIn += `<td id="timetableTd1" style="padding-left: 14px;">P${period}: ${subject} <br></td>`;
			}
			else if (room === "Sport"){
				tableIn += `<td id="timetableTd1" style="padding-left: 14px;">Sports</td>`;
			}
			else if (room === "Scripture"){
				tableIn += `<td id="timetableTd1" style="padding-left: 14px;">Scripture</td>`
			}
			else {
				tableIn += `<td id="timetableTd1" style="padding-left: 14px;">Free Period</td>`;
			}
			tableIn += `<td id="startTimeTd" style="padding-left: 7px">${room}</td>`;
			tableIn += `<td id="startTimeTd" style="padding-left: 7px">${startTime}</td>`;
			tableIn += "</tr>";
			period++;
		}
		tableIn += `<tr><td style="padding-left: 14px">End of Day</td><td></td><td style="padding-left: 7px">${it[listOfDays[day]]["End of Day"].startTime}</td></tr>`
		tableIn += "</table></td>";
		if(day % 5 == 4) {
			tableIn += "</tr>";
		}
	}
	table.innerHTML = tableIn;
}

if (localStorage.getItem("personalTimetable") === null) {
	alert("You have not uploaded a timetable, and appear \nto have reached this location by accident. \nWe are escorting you back to the main page. \n\n\nPlease do not resist.");
	window.location.href = "./upload.html";
}
else {
	json = JSON.parse(localStorage.getItem("personalTimetable"));
	console.log(json);
	gen_table(json);
}