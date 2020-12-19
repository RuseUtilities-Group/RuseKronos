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
		tableIn += `<tr><th>${listOfDays[day].substring(0, listOfDays[day].length-1)[0].toUpperCase() + listOfDays[day].substring(0, listOfDays[day].length-1).slice(1) + " " + listOfDays[day][listOfDays[day].length-1]}</th></tr>`;
		period = 1;
		while(typeof it[listOfDays[day]][`Period ${period}`] != "undefined") {
			tableIn += "<tr>";

			startTime = it[listOfDays[day]][`Period ${period}`].startTime;
			teacher = it[listOfDays[day]][`Period ${period}`].teacher;
			subject = it[listOfDays[day]][`Period ${period}`].subject;
			room = it[listOfDays[day]][`Period ${period}`].room;

			if(teacher != "") {
				tableIn += `<td id="timetableTd1">P${period}: ${subject} <br></td>`;
			}
			else if (room == "sport"){
				tableIn += `<td id="timetableTd1">Sports</td>`;
			}
			else {
				tableIn += `<td id="timetableTd1">Free Period</td>`;
			}
			tableIn += `<td id="startTimeTd">${startTime}</td>`;

			tableIn += "</tr>";

			if((day % 5 != 2 && period == 3) || (day % 5 == 2 && period == 2)) {
				startTime = it[listOfDays[day]]["Recess"].startTime;
				tableIn += `<tr><td>Recess</td>`;
				tableIn += `<td id="startTimeTd">${startTime}</td>`;
				tableIn += "</tr>";
			}
			if((day % 5 != 2 && period == 5) || (day % 5 == 2 && period == 4)) {
				startTime = it[listOfDays[day]]["Lunch"].startTime;
				tableIn += `<tr><td>Lunch</td>`;
				tableIn += `<td id="startTimeTd">${startTime}</td>`;
				tableIn += "</tr>";
			}
			period++;
		}
		tableIn += `<tr><td>End of Day</td><td>${it[listOfDays[day]]["End of Day"].startTime}</td></tr>`
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