/** @format */
/**
 * Date and time
 * Local storage and local storage
 * Json
 * object
 */
if (localStorage.notificationData == undefined) {
	let myRequest = new XMLHttpRequest();
	myRequest.open("GET", "../notification.json");
	myRequest.send();
	myRequest.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			// localStorage.clear();
			localStorage.setItem("notificationData", this.responseText);
			localStorage.startTime = new Date();
			localStorage.setItem("firstLoopForSetDateFunction", true);
		}
	};
}
let myData = JSON.parse(localStorage.notificationData);
for (let i = 0; i < myData.length; i++) {
	//* notification box
	let notificationBox = document.createElement("div");
	document.querySelector(".body").appendChild(notificationBox);
	notificationBox.classList.add("notification-box");
	if (myData[i].read == false) {
		notificationBox.classList.add("unread");
	} //* avatar
	let avatar = document.createElement("img");
	notificationBox.appendChild(avatar);
	avatar.src = myData[i].avatar;
	avatar.alt = "avatar";
	//* notification info
	let notificationInfo = document.createElement("div");
	notificationBox.appendChild(notificationInfo);
	notificationInfo.classList.add("notification-info");
	//* info inside notificationInfo div
	let info = document.createElement("div");
	info.classList.add("info");
	notificationInfo.appendChild(info);
	//* div1 inside div1
	let div1 = document.createElement("div");
	info.appendChild(div1);
	//* p inside div1
	let p1 = document.createElement("p");
	div1.appendChild(p1);
	//* span1
	let span1 = document.createElement("span");
	p1.appendChild(span1);
	span1.classList.add("name");
	span1.textContent = myData[i].name;
	span1.after(" ");
	//* span2
	let span2 = document.createElement("span");
	p1.appendChild(span2);
	span2.classList.add("action");
	span2.textContent = myData[i].action;
	span2.after(" ");
	//* span3
	if (myData[i].actionPlace != undefined) {
		let span3 = document.createElement("span");
		p1.appendChild(span3);
		span3.classList.add("action-place");
		myData[i].actionPlace.type == "group"
			? span3.classList.add("group-type")
			: myData[i].actionPlace.type == "post"
			? span3.classList.add("post-type")
			: "";
		span3.textContent = myData[i].actionPlace.text;
	}
	//* time inside div1
	let actionTime = document.createElement("p");
	div1.appendChild(actionTime);
	actionTime.classList.add("action-time");
	actionTime.textContent = myData[i].time;
	//* img inside info
	if (myData[i].img != undefined) {
		let img = document.createElement("img");
		info.appendChild(img);
		img.classList.add("pictur-post");
		img.src = myData[i].img;
	}
	//* details inside notification-info
	if (myData[i].details != undefined) {
		if (myData[i].details.type == "message") {
			let detailsDiv = document.createElement("div");
			notificationInfo.appendChild(detailsDiv);
			detailsDiv.classList.add("details");
			let p = document.createElement("p");
			detailsDiv.appendChild(p);
			p.textContent = myData[i].details.itSelf;
		}
	}
}
// read notification function
let notifications = document.querySelectorAll(".body .notification-box");
function readNotification() {
	notifications.forEach((n, i) => {
		n.addEventListener("click", function () {
			this.classList.remove("unread");
			myData[i].read = true;
			localStorage.notificationData = JSON.stringify(myData);
			notificationCount();
		});
	});
}
readNotification();
// Mark all as read function
let markAsReadBtn = document.querySelector(".mark-as-read");
markAsReadBtn.onclick = function () {
	for (let i = 0; i < myData.length; i++) {
		myData[i].read = true;
		notifications[i].classList.remove("unread");
	}
	localStorage.notificationData = JSON.stringify(myData);
	notificationCount();
};
// Notifications count function
function notificationCount() {
	let notificationCount = document.querySelector(".notifications-count"),
		count = 0;
	for (let i = 0; i < myData.length; i++) {
		if (myData[i].read == false) {
			count++;
		}
	}
	if (count == 0) {
		notificationCount.remove();
	}
	notificationCount.textContent = count;
}
notificationCount();
// date function
function setDate() {
	let times = document.querySelectorAll(".action-time");
	let startTime = new Date(localStorage.startTime);
	for (let i = 0; i < myData.length; i++) {
		if (localStorage.firstLoopForSetDateFunction == "true") {
			if (myData[i].time.slice(myData[i].time.indexOf(" ") + 1) == "m") {
				myData[i].time =
					new Date(startTime) -
					1000 * 60 * myData[i].time.slice(0, myData[i].time.indexOf(" "));
			} else if (
				myData[i].time.slice(myData[i].time.indexOf(" ") + 1) == "hr"
			) {
				myData[i].time =
					new Date(startTime) -
					1000 * 60 * 60 * myData[i].time.slice(0, myData[i].time.indexOf(" "));
			} else if (
				myData[i].time.slice(myData[i].time.indexOf(" ") + 1) == "day"
			) {
				myData[i].time =
					new Date(startTime) -
					1000 *
						60 *
						60 *
						24 *
						myData[i].time.slice(0, myData[i].time.indexOf(" "));
			} else if (
				myData[i].time.slice(myData[i].time.indexOf(" ") + 1) == "week"
			) {
				myData[i].time =
					new Date(startTime) -
					1000 *
						60 *
						60 *
						24 *
						7 *
						myData[i].time.slice(0, myData[i].time.indexOf(" "));
			} else {
				myData[i].time = new Date(myData[i].time).getTime();
			}
		}
		times[i].textContent = countTime(myData[i].time);
	}
	if (localStorage.firstLoopForSetDateFunction == "true") {
		localStorage.notificationData = JSON.stringify(myData);
		localStorage.firstLoopForSetDateFunction = false;
	}
	function countTime(date) {
		let dateNow = new Date();
		let comparisonDate = dateNow - new Date(date);
		if (comparisonDate < 60 * 1000) return "Just now";
		else if (comparisonDate >= 60 * 1000 && comparisonDate < 1000 * 60 * 60)
			return `${Math.floor(comparisonDate / 1000 / 60)} m`;
		else if (
			comparisonDate > 1000 * 60 * 60 &&
			comparisonDate < 1000 * 60 * 60 * 24
		)
			return `${Math.floor(comparisonDate / 1000 / 60 / 60)} hr`;
		else if (
			comparisonDate > 1000 * 60 * 60 * 24 &&
			comparisonDate < 1000 * 60 * 60 * 24 * 7
		) {
			let time = Math.floor(comparisonDate / 1000 / 60 / 60 / 24);
			return `${time} ${time > 1 ? "days" : time == 1 ? "day" : ""}`;
		} else if (
			comparisonDate >= 1000 * 60 * 60 * 24 * 7 &&
			comparisonDate < 1000 * 60 * 60 * 24 * 7 * 4
		) {
			let time = Math.floor(comparisonDate / 1000 / 60 / 60 / 24 / 7);
			return `${time} ${
				time == 1 ? "week" : time > 1 && time <= 4 ? "weeks" : ""
			}`;
		} else if (comparisonDate > 1000 * 60 * 60 * 24 * 7 * 4) {
			if (new Date(date).getFullYear() == new Date().getFullYear()) {
				return `${new Date(date).getDate()} ${getMonth3Char(
					new Date(date).getMonth()
				)}`;
			} else {
				return `${new Date(date).getDate()} ${getMonth3Char(
					new Date(date).getMonth()
				)}, ${new Date(date).getFullYear()}
				`;
			}
		} else {
			return "Error";
		}
	}
}
setDate();
setInterval(() => {
	console.log("setDate();");
	setDate();
}, 1000 * 60);

// get first 3 chareckters from month name by month index
function getMonth3Char(monthIndex) {
	switch (monthIndex) {
		case 0:
			return "Jan";
		case 1:
			return "Feb";
		case 2:
			return "Mar";
		case 3:
			return "Apr";
		case 4:
			return "May";
		case 5:
			return "Jun";
		case 6:
			return "Jul";
		case 7:
			return "Aug";
		case 8:
			return "Sept";
		case 9:
			return "Oct";
		case 10:
			return "Nov";
		case 11:
			return "Dec";
	}
}
