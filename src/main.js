const { invoke } = window.__TAURI__.tauri;
const { Command } = window.__TAURI__.shell;

// search when enter is pressed
document.querySelector("#ingredient-input").addEventListener('keypress', function(e) {
	if (e.key === 'Enter') {
		search();
	}
})

// highly repetetive js functions to render the available recipe buttons
function display0() {
	let line = document.querySelector("#button0").innerHTML;
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<link rel='stylesheet' href='/recipestyle.css' />" +
	"<body>" +
	line +
	"</body>"
	);
	console.log("Attemp to display completed.")
}
function display1() {
	let line = document.querySelector("#button1").innerHTML;
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<link rel='stylesheet' href='/recipestyle.css' />" +
	"<body>" +
	line +
	"</body>"
	);
	console.log("Attemp to display completed.")
}
function display2() {
	let line = document.querySelector("#button2").innerHTML;
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<link rel='stylesheet' href='/recipestyle.css' />" +
	"<body>" +
	line +
	"</body>"
	);
	console.log("Attemp to display completed.")
}
function display3() {
	let line = document.querySelector("#button3").innerHTML;
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<link rel='stylesheet' href='/recipestyle.css' />" +
	"<body>" +
	line +
	"</body>"
	);
	console.log("Attemp to display completed.")
}
function display4() {
	let line = document.querySelector("#button4").innerHTML;
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<link rel='stylesheet' href='/recipestyle.css' />" +
	"<body>" +
	line +
	"</body>"
	);
	console.log("Attemp to display completed.")
}
function display5() {
	let line = document.querySelector("#button5").innerHTML;
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<link rel='stylesheet' href='/recipestyle.css' />" +
	"<body>" +
	line +
	"</body>"
	);
	console.log("Attemp to display completed.")
}

// literally just reloads the page
function reload_page() {
	console.log("Reloading...")
	window.location.reload();
}
function home() {
	window.open("index.html", "_self");
	console.log("Opened homepage");
}

// almost identical to the search function, except that it doesn't care about the ingredients
async function random_search() {
	console.log("Attempting to query a random recipe.");
	document.querySelector("#boxes").textContent = "Searching...";
	const command = new Command("run-py-random", ["../src-tauri/src/search.py"]);
		command.on('close', data => {
			console.log(`command finished with code ${data.code} and signal ${data.signal}`)
		});
		command.on('error', error => {
			invoke("error");
			console.error(`command error: "${error}"`)}
		);
		command.stdout.on('data', line => {
			document.querySelector("#boxes").outerHTML = line;
			console.log(`command stdout: "${line}"`)
		});
		command.stderr.on('data', line => {
			invoke("error")
			console.log(`command stderr: "${line}"`)}
		);
		const child = await command.spawn();
		console.log('pid:', child.pid);
}

async function search() {
	let ingredients = document.querySelector("#ingredient-input").value
	if (ingredients != "") {
		console.log("searching: ", ingredients);
		await invoke("search", {ingredient : ingredients});
		document.querySelector("#boxes").textContent = "Searching...";
		const command = new Command("run-py-search", ["../src-tauri/src/search.py", ingredients]);
		command.on('close', data => {
			console.log(`command finished with code ${data.code} and signal ${data.signal}`)
		});
		command.on('error', error => {
			console.error(`command error: "${error}"`)}
		);
		command.stdout.on('data', line => {
			document.querySelector("#boxes").outerHTML = line;
			console.log(`command stdout: "${line}"`)
		});
		command.stderr.on('data', line => {
			console.log(`command stderr: "${line}"`)}
		);
		const child = await command.spawn();
		console.log('pid:', child.pid);
		
		// document.querySelector("#recipe-box").textContent = ingredients;
  	} else {
		document.querySelector("#boxes").textContent = "Please enter an ingredient";
	}
  	// await invoke("search", {ingredient : document.querySelector("#ingredient-input").value});
}

function about_us() {
	let newWindow = window.open("recipe.html", "_self");
	newWindow.document.write(
	"<!DOCTYPE html>" +
	"<html lang='en'>" +
	  "<head>" +
		"<meta charset='UTF-8' />" +
		"<link rel='shorcut icon' href='#' />" +
		"<link rel='stylesheet' href='/recipestyle.css' />" +
		"<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
		"<title>About the authors</title>" +
		"<script type='module' src='/main.js' defer></script>" +
		"<style>" +
		  ".logo.vanilla:hover {" +
			  "filter: drop-shadow(0 0 2em #ffe21c);" +
		  "}" +
		"</style>" +
	  "</head>" +
	  "<button id='return' type='submit' onclick='home()' style='position:fixed; top:10px; right:9px;'>Back</button>" +
	"<body><h1> Welcome to the Recipe Finder!!!</h1>" +
	"<div><p>You may enter one or more ingredients to the search bar (separated by commas) and generate recipes that include those ingredients! " +
	"The purpose of this app is to reduce waste in our fridge and pantry as it is very easy to forget about what he have in there. "+
	"108 billion pounds of food is wasted in the United States alone! It is important for us to be more conscious on what we are buying and utilizing all of them without wasting it.</p><br>" +
	"<p>Don't know what to make? Click on the surprise me button for a random recipe as an inspiration!</p>" + 
	"<h2> Meet the Creators </h2>" +
	"<p> Zhihong and Jennifer are both (super) seniors but are finally graduating this month! As we prepare to start our full time jobs, it will be important for us to not forget about the food we have in our fridge and to create yummy recipes with them. This app will help us be creative with what we are cooking throughout our busy weeks. </p>" +
	"</div></body>" +
	"</html>"
	);
	console.log("Attemp to display authors info completed.")
}
window.search = search;
window.display0 = display0;
window.display1 = display1;
window.display2 = display2;
window.display3 = display3;
window.display4 = display4;
window.display5 = display5;
window.reload_page = reload_page;
window.home = home;
window.random_search = random_search;
window.about_us = about_us;