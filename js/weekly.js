var rawData;
const api_key = 'bf309e9dfd66cb64d7bc3927b9538d99';

function setDataDay(data, i) {
	let date = new Date(data.daily[i].dt * 1000);
	changeBackground(data.current.weather[0].main);
	if(i === 0) {
		document.getElementById("displayedCity").innerHTML = localStorage.getItem("current");
	}
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
	document.getElementById("d" + i).innerHTML = day;
	document.getElementById("p" + i + "_0").innerHTML = data.daily[i].temp.day + " °C";
	document.getElementById("p" + i + "_1").innerHTML = data.daily[i].weather[0].description;
	document.getElementById("p" + i + "_2").innerHTML = data.daily[i].humidity + "%";
	date = new Date(data.daily[i].sunrise * 1000);
	document.getElementById("p" + i + "_3").innerHTML = date.getHours() + "h " + date.getMinutes() + "min";
	date = new Date(data.daily[i].sunset * 1000);
	document.getElementById("p" + i + "_4").innerHTML = date.getHours() + "h " + date.getMinutes() + "min";
	document.getElementById("p" + i + "_5").innerHTML = data.daily[i].wind_deg;
	document.getElementById("p" + i + "_6").innerHTML = data.daily[i].wind_speed+ " m/s";
}

function changeBackground(weather) {
	if(weather === 'Rain') {
		document.body.style.backgroundImage = "url('../images/rain_glass.jpg')";
    } else if (weather === "Clouds"){
    	document.body.style.backgroundImage = "url('../images/cloudy.jpg')";
    } else if (weather === "Clear"){
    	document.body.style.backgroundImage = "url('../images/cloudy.jpg')";
    }
}

function getForecast(lat, lon) {
	console.log(lat);
	console.log(lon);
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		const url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat.toString() + "&lon=" + lon.toString() +"&exclude=hourly,minutely&units=metric&appid=" + api_key;
		xhr.open('GET', url);
		xhr.onreadystatechange = function() {
			if(this.readyState === 4) {
				   rawData = JSON.parse(this.responseText);
				   resolve();
			}
		};
		xhr.onerror = function() {
		      reject(Error("Network Error"));
		    };
		xhr.send("");
	});
}

function fillPage() {
	let i;
	for(i = 0; i < 5; i++) {
		setDataDay(rawData, i);
	}
}


function fillArray() {
	getForecast(localStorage.getItem("lat"), localStorage.getItem("lon")).then(function () {
		let i;
		let j;
	    for(i = 0; i < 5; i++) {
	    	let newDiv = document.createElement("div");
	    	newDiv.className = "column box";
	    	let dayP = document.createElement("p");
	    	dayP.setAttribute("id", "d" + i.toString());
    		newDiv.appendChild(dayP);
	    	for(j = 0; j < 7; j++) {
	    		let newContent = document.createElement("p");
	    		let s = "p" + i.toString() + "_" + j.toString();
	    		newContent.setAttribute("id", s);
	    		newDiv.appendChild(newContent);
	    	}
	    	document.getElementById("mainContainer").appendChild(newDiv);
	    }
	    fillPage();
	  });
}



function change_page(){
	  window.location.href = "index.html";
} 



//Initialize function
var init = function () {
    fillArray();
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: 
    		break;
    	case 38:  {
    		change_page();
    		}//UP arrow
    		break;
    	case 39:
    		break;
    	case 40: 
    		break;
    	case 13: //OK button
    		break;
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
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

