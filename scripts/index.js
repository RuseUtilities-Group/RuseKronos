//Made By Joshua Koh
var name1 = localStorage.getItem("name")
if(!localStorage.getItem("name")) name1= ""
var city = localStorage.getItem("weather")
if(!localStorage.getItem("weather")) city= "Carlingford,NSW"

if(!localStorage.getItem("classCheck")) localStorage.setItem("classCheck", "0")
if(!localStorage.getItem("breakCheck")) localStorage.setItem("breakCheck", "0")
if(!localStorage.getItem("timeCheck")) localStorage.setItem("timeCheck", "0")

try{
  if(localStorage.getItem("classCheck") === "1") document.getElementById("className").checked = true;
  if(localStorage.getItem("classCheck") === "0") document.getElementById("className").checked = false;
  if(localStorage.getItem("breakCheck") === "1") document.getElementById("showBreaks").checked = true;
  if(localStorage.getItem("breakCheck") === "0") document.getElementById("showBreaks").checked = false;
  if(localStorage.getItem("timeCheck") === "1") document.getElementById("showTimings").checked = true;
  if(localStorage.getItem("timeCheck") === "0") document.getElementById("showTimings").checked = false;
  var chk = document.getElementById("className").checked;
  if(chk == true) localStorage.setItem("classCheck", "1")
  if(chk == false) localStorage.setItem("classCheck", "0")
  var chk1 = document.getElementById("showBreaks").checked;
  if(chk1 == true) localStorage.setItem("breakCheck", "1")
  if(chk1 == false) localStorage.setItem("breakCheck", "0")
  var chk2 = document.getElementById("showTimings").checked;
  if(chk2 == true) localStorage.setItem("timeCheck", "1")
  if(chk2 == false) localStorage.setItem("timeCheck", "0")
  document.getElementById("nameInput").placeholder = name1;
  document.getElementById("weatherInput").placeholder = city;

} catch{
}

//Entering Name Area
function nameInputFunc() {
  var Name = document.getElementById("nameInput").value
  localStorage.setItem("name", Name);
  name1 = Name
  document.getElementById("nameInput").placeholder = name1;
}

function classNameFunc(){
  var chk = document.getElementById("className").checked;
  if(chk == true) localStorage.setItem("classCheck", "1")
  if(chk == false) localStorage.setItem("classCheck", "0")
}

function breaksShowFunc(){
  var chk = document.getElementById("showBreaks").checked;
  if(chk == true) localStorage.setItem("breakCheck", "1")
  if(chk == false) localStorage.setItem("breakCheck", "0")
}

function timingsShowFunc(){
  var chk = document.getElementById("showTimings").checked;
  if(chk == true) localStorage.setItem("timeCheck", "1")
  if(chk == false) localStorage.setItem("timeCheck", "0")
}

function weatherInputFunc() {
  var Name = document.getElementById("weatherInput").value
  localStorage.setItem("weather", Name);
  city = Name
  document.getElementById("weatherInput").placeholder = city;
}

//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

//Functions
 
function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  //Save to local - do this last
  //Save to local
  saveLocalTodos(todoInput.value);
  //
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    const todo = item.parentElement;
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", e => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    console.log(todo);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function(todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function(todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    todoInput.value = "";
    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //attach final Todo
    todoList.appendChild(todoDiv);
  });
}

//Adding Clock to the Website
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('time').innerHTML =
  h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
};

//Fetch API from OpenWeather
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=277e4ead61d59f325b8ecfd98dd8963b`).then(function (response) {
	// The API call was successful!
	return response.json();
}).then(function (data) {
  var currentTemp = Math.round(data.main.temp);
  var imageLogo = data.weather[0].icon;

  var link = `https://openweathermap.org/img/wn/${imageLogo}@2x.png`
  //console.log(imageLogo)
  document.getElementById("weatherLogo").src = link;
  document.getElementById("currentTemp").innerHTML = `${currentTemp}°`

});

//Fetch API From QuoteGen
fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    function rng(num){
      return Math.floor (Math.random() * (num - 1 + 1)) + 1;
    }
    const rng1 = rng(1643)
    document.getElementById("quotesBody").innerHTML = `${data[rng1].text}`
    if(data[rng1].author === null) return
    document.getElementById("quotesAuthor").innerHTML = `- ${data[rng1].author}`
  });

  //Greeting
  var myDate = new Date();
  var hrs = myDate.getHours();

  var greet;

  if (hrs < 12)
      greet = 'Good Morning';
  else if (hrs >= 12 && hrs <= 17)
      greet = 'Good Afternoon';
  else if (hrs >= 17 && hrs <= 24)
      greet = 'Good Evening';

  document.getElementById('greetingDiv').innerHTML = greet + " "+ name1;
  if(name1) document.getElementById('greetingDiv').innerHTML = greet + ", "+ name1;


function fonttRadioSelector(){
  var redHat = document.getElementById("Red Hat");
  var Roboto = document.getElementById("Roboto");
  var boutique = document.getElementById("Boutique")
  if(redHat.checked === true){
    localStorage.setItem("font", "Red Hat")
    document.getElementsByTagName('body').fontFamily = "Red Hat Text"
    console.log(1)
  } else if(Roboto.checked === true){
    localStorage.setItem("font", "Roboto")
    document.getElementsByTagName('body').fontFamily = "Roboto"
    console.log(2)
  } else if(boutique.checked === true){
    localStorage.setItem("font", "Verdana")
    document.getElementsByTagName('body').fontFamily = "Verdana"
    console.log(3)
  }
}