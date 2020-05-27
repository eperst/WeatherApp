var cityData = {};
var displayed;
var cities;
var promiseArray = [];
var menu = false;
const api_key = 'bf309e9dfd66cb64d7bc3927b9538d99';
var menuIndex;
var c;

function setData(data) {
	changeBackground(data.weather[0].main);
	document.getElementById("displayedCity").innerHTML = data.name;
	let date = new Date(data.dt * 1000);
	let day;
	switch(date.getDay()) {
		case 0:
			day = "Sunday";
			break;
		case 1:
			day = "Monday";
			break;
		case 2:
			day = "Tuesday";
			break;
		case 3:
			day = "Wednesday";
			break;
		case 4:
			day = "Thursday";
			break;
		case 5:
			day = "Friday";
			break;
		case 6:
			day = "Saturday";		
	}
	document.getElementById("currentDay").innerHTML = day;
	document.getElementById("currentTemp").innerHTML = data.main.temp + " °C";
	document.getElementById("description").innerHTML = data.weather[0].description;
	document.getElementById("humidity").innerHTML = data.main.humidity + "%";
	date = new Date(data.sys.sunrise * 1000);
	document.getElementById("sunrise").innerHTML = date.getHours() + "h " + date.getMinutes() + "min";
	date = new Date(data.sys.sunset * 1000);
	document.getElementById("sunset").innerHTML = date.getHours() + "h " + date.getMinutes() + "min";
	document.getElementById("wind-direction").innerHTML = data.wind.deg + "°";
	document.getElementById("wind-speed").innerHTML = data.wind.speed+ " m/s";
}

function changeBackground(weather) {
	if(weather === 'Rain' ) {
		document.body.style.backgroundImage = "url('../images/rain_glass.jpg')";
    } else if (weather === "Clouds"){
    	document.body.style.backgroundImage = "url('../images/cloudy.jpg')";
    } else if (weather === "Clear"){
    	document.body.style.backgroundImage = "url('../images/clear.jpg')";
    } else if(weather === "Thunderstorm") {
    	document.body.style.backgroundImage = "url('../images/thunder.jpg')";
    } else if(weather === "Drizzle") {
    	document.body.style.backgroundImage = "url('../images/rain.jpg')";
    } else if(weather === "Snow") {
    	document.body.style.backgroundImage = "url('../images/snow.jpg')";
    }
}

function getCurrent(city) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + api_key;
		xhr.open('GET', url);
		xhr.onreadystatechange = function() {
			if(this.readyState === 4) {
				   let data = JSON.parse(this.responseText);
				   cityData[city] = data;
				   resolve();
			      }
		};
		xhr.onerror = function() {
		      reject(Error("Network Error"));
		    };
		xhr.send("");
	});
}

function fillArray() {
	cityData = {};
	let i;
	for(i = 0; i < cities.length; i++) {
		promiseArray.push(getCurrent(cities[i]));
	}
	Promise.all(promiseArray).then(function () {
		console.log(displayed);
		if(displayed >= cities.length) {
			displayed = 0;
		}
		setData(cityData[cities[displayed]]);
	            	 }
	             );
}



function change_page(){
	  window.location.href = "week.html";
} 


function setMenu() {
	menu = !menu;
	if(menu) {
		let i;
		for(i = 1; i <= 10; i++) {
			if(cities.includes(document.getElementById("c" + i).textContent)) {
				document.getElementById("icon" + i).style.display = "flex";
			}
		}
		for(i = 1; i <= 10; i++) {
			if(document.getElementById("c" + i).textContent === cities[displayed]) {
				menuIndex = i;
				if(i > 5) {
					c = true;
				} else {
					c = false;
				}
				document.getElementById("c" + i).style.textDecoration = "underline";
			}
		}
		document.getElementById("menu-overlay").style.display = "flex";
	} else {
		document.getElementById("c" + menuIndex).style.textDecoration = "none";
		document.getElementById("menu-overlay").style.display = "none";
		if(displayed >= cities.length) {
			displayed = 0;
		}		
	}	
}

function underline(i1, i2) {
	document.getElementById("c" + i1).style.textDecoration = "none";
	document.getElementById("c" + i2).style.textDecoration = "underline";
}

function addCity(city) {
	if(!cities.includes(city)) {
		cities.push(city);
	}
}

function removeCity(city) {
	cities.splice(cities.indexOf(city), 1);
}


//Initialize function
var init = function () {
	menu = false;
	menuIndex = 1;
	let home = localStorage.getItem("home");
	let current = localStorage.getItem("current");
	cities = JSON.parse(localStorage.getItem("cities"));
	if(cities === null || cities === undefined) {
		cities = ["Budapest", "London", "Rome", "Tokyo"];
	}
	if(current === null || current === undefined) {
		current = home;
		displayed = cities.indexOf(current);
	}
	if(current === null || current === undefined) {
		displayed = 0;
	} else {
		displayed = cities.indexOf(current);
	}

	
    fillArray();
	document.addEventListener('visibilitychange', function() {
        if(document.hidden){
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: {		//LEFT arrow
    		if(menu) {
    			if(c) {
    				let from = menuIndex;
    				menuIndex -= 5;
    				underline(from, menuIndex);
    				c = false;
    			}
    		} else {
    			if(displayed === 0) {
        			displayed = cities.length - 1;
        		} else {
        			displayed--;
        		}
        		setData(cityData[cities[displayed]]);
    		}
    	}
    		break;
    	case 38: //UP ARROW
    		 {
	    		if(menu) {
	    			if(menuIndex === 6) {
	    				c = false;
	    			}
	    			if(menuIndex > 1) {
	    				underline(menuIndex, --menuIndex);
	    			} else {
	    				menuIndex = 10;
	    				underline(1, 10);
	    			}
	    		} else {
	    			localStorage.setItem("home", cities[displayed]);
	    		}
    		 }
    		break;
    	case 39:  {	//RIGHT arrow
    		if(menu) {
    			if(!c) {
    				let from = menuIndex;
    				menuIndex += 5;
    				underline(from, menuIndex);
    				c = true;
    			}
    		} else {
    			if(displayed === cities.length - 1) {
	    			displayed = 0;
	    		} else {
	    			displayed++;
	    		}
	    		setData(cityData[cities[displayed]]);
    		}
    		
    	}
    		break;
    	case 40:  {	//DOWN arrow
	    		if(menu) {
	    			if(menuIndex === 5) {
	    				c = true;
	    			}
	    			if(menuIndex < 10) {
	    				underline(menuIndex, ++menuIndex);
	    			} else {
	    				menuIndex = 1;
	    				underline(10, 1);
	    			}
	    			
	    		} else {
	    			localStorage.setItem("lat", cityData[cities[displayed]].coord.lat);
		    		localStorage.setItem("lon", cityData[cities[displayed]].coord.lon);
		    		localStorage.setItem("current", cities[displayed]);
		    		localStorage.setItem("cities", JSON.stringify(cities));
		    		change_page();
	    		}
    		}
    		break;
    	case 13: //OK button
    	{
    		if(!menu) {
         		setMenu();
    		} else {
    			if(cities.includes(document.getElementById("c" + menuIndex).textContent)) {
    				if(cities.length > 1) {
    					document.getElementById("icon" + menuIndex).style.display = "none";
        				removeCity(document.getElementById("c" + menuIndex).textContent);
    				}
    			} else {
    				document.getElementById("icon" + menuIndex).style.display = "flex";
    				addCity(document.getElementById("c" + menuIndex).textContent);
    			}
    		}
    	}	
    		break;
    	case 10009: //RETURN button
    		{
    			if(menu) {
    				fillArray();
             		setMenu();
           
    			} else {
    				tizen.application.getCurrentApplication().exit();
    			}
    		}
		
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
};


window.onload = init;
window.setInterval(function() {
	fillArray(); //update arraydata every hour
}, 3600000);
