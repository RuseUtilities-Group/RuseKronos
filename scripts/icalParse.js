//By Chris Ahn
function icalParse() {

	const file = document.getElementById('myFile').files[0];
	if(file.size > 1000000) {
		alert("File is too large.");
		return;
	}

	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onloadend = function(e) {
			var data;
			try {
				data = ICAL.parse(e.target.result);
			}
			catch(err) {
				alert("Your file appears to be invalid. \nPlease try again");
			}
			resolve(data);
		};
		fileReader.onerror = function(e) {
			reject(e);
		}
		fileReader.readAsText(file);
	});
}

function getTemplate() {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
		xhr.open('GET', '/scripts/bellTimes.json', true);
		xhr.onloadend = function (e) {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			reject(e);
		};
		xhr.send();
	});
}

async function icalProcess() {
	try {
		//Wait for icalParse() to finish
		var jcalData = await icalParse();
		var jsonData = await getTemplate();
		console.log(jcalData);

		//Extract events (i.e periods) from jcal
		var jcalDataComp = new ICAL.Component(jcalData);
		var events = jcalDataComp.getAllSubcomponents("vevent");

		console.log(jcalData);
		console.log(events);

		//IMPORTANT:
		// //	Sentral starts the timetable from wednesday week A
		// //	So keep that in mind when reading the below code
		// //
		// //Also the people running sentral are comedians, the dates
		// //are completely wrong, so I have to work off of the periods
		// //instead. Comedy as usual.
		//
		//	SIKE you thought
		//	Fools sentral does not comply to your mortal demands of
		//	"consistency" and "reliability" or even "basic correctness".
		//	They WILL start on whichever day they want and they WILL laugh
		//	at your foolish attempts to achieve any kind of order.
		//
		//	As such, it is tacitly assumed by default they start on Wednesday
		//	and when the blood moon rises over Saturn another day is chosen.
		//	In such cases a unique identifying day, Monday week B, with a length
		//	of 8 periods, is chosen as the identifier, with the timetable starting
		//	on the next day, tuesday.
		//
		//Additional Notes:
		//	start time is in .dtstart
		//	teacher's name is in .description
		//	subject is in .summary
		//	location is in .location

		var listOfDays = ['wednesdayA', 'thursdayA', 'fridayA', 'mondayB', 'tuesdayB', 'wednesdayB', 'thursdayB', 'fridayB', 'mondayA', 'tuesdayA'];
		var curDay = 0;

		var prevPeriod = 0;
		var offset = 0

		for(var i = 0; i < events.length; i++) {
			var description = events[i].getFirstPropertyValue('description');
			var tAndP = description.split("\n");
			var period = parseInt(tAndP[1].split(" p.")[1], 10);

			if (Number.isNaN(period)) {
				continue;
			}
			if(prevPeriod > period) {
				if(prevPeriod == 8) { 
					//Reset back to first period monday
					offset = i
					//Modify the list
					listOfDays = ['tuesdayB', 'wednesdayB', 'thursdayB', 'fridayB', 'mondayA', 'tuesdayA', 'wednesdayA', 'thursdayA', 'fridayA', 'mondayB'];
					break;
				}
			}

			prevPeriod = period;
		}

		prevPeriod = 0;

		for(var i = offset; i < events.length; i++) {
			// console.log(events[i]);
			//Read in values from the JSON file
			var eventStart = events[i].getFirstPropertyValue('dtstart');
			var eventEnd = events[i].getFirstPropertyValue('dtend');
			var description = events[i].getFirstPropertyValue('description');
			var summary = events[i].getFirstPropertyValue('summary');
			var lctn = events[i].getFirstPropertyValue('location');

			//Dealing with time
			// var periodStart = new Date(Date.UTC(eventStart.year, eventStart.month, eventStart.day, eventStart.hour, eventStart.minute, 0, 0))
			var periodStart = new Date(Date.UTC(1, 1, 1, eventStart.hour, eventStart.minute, 0, 0))
			periodStart.setDate(1);
			// // periodStart = new Date(periodStart.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

			// var periodEnd = new Date(Date.UTC(eventEnd.year, eventEnd.month, eventEnd.day, eventEnd.hour, eventEnd.minute, 0, 0))
			var periodEnd = new Date(Date.UTC(1, 1, 1, eventEnd.hour, eventEnd.minute, 0, 0))
			periodEnd.setDate(1);
			// periodEnd = new Date(periodEnd.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

			var hours = periodStart.getHours();
			var minute = periodStart.getMinutes();

			//Dealing with the description elements
			var tAndP = description.split("\n");
			var teacher = tAndP[0].split("  ")[1];
			var period = parseInt(tAndP[1].split(" p.")[1], 10);

			//Dealing with the summary elements
			var subject = summary.split(": ")[1];

			//Dealing with the location elements
			var room = lctn.split(": ")[1];

			//Bounds check
			if (Number.isNaN(period)) {
				prevPeriod = 1000;
				continue;
			}
			else if(prevPeriod > period) {
				curDay += 1;
			}

			if(!(curDay < 10)) {
				break;
			}

			console.log(i);
			console.log("day: " + curDay);
			console.log("period: " + period)

			// console.log(jsonData.timetableData[listOfDays[curDay]]);
			// jsonData.timetableData[listOfDays[curDay]][`Period ${period}`];
			if(curDay % 5 == 0 && period > 4) {
				console.log("what")
			}
			jsonData.timetableData[listOfDays[curDay%10]][`P${period}`].startTime = `${hours}:${minute.toString().padStart(2, '0')}`;
			jsonData.timetableData[listOfDays[curDay%10]][`P${period}`].periodLength = (Math.abs(periodEnd - periodStart) / (1000 * 60)).toString();
			jsonData.timetableData[listOfDays[curDay%10]][`P${period}`].teacher = teacher;
			jsonData.timetableData[listOfDays[curDay%10]][`P${period}`].subject = subject;
			jsonData.timetableData[listOfDays[curDay%10]][`P${period}`].room = room;

			// console.log(periodStart);
			// console.log(periodEnd);
			// console.log(hours + ":" + minute.toString().padStart(2, '0'));
			// console.log(Math.abs(periodEnd - periodStart) / (1000 * 60));
			// console.log(period);
			// console.log(teacher);
			// console.log(room);
			// console.log(listOfDays[curDay]);

			prevPeriod = period;

			// jsonTimetable["teacher"] = events[i].getFirstPropertyValue('description');
		}
		console.log(jsonData);
		localStorage.setItem("personalTimetable", JSON.stringify(jsonData));
		window.location.href = "/index.html";
	} catch(err) {
		console.log(err);
    }
}