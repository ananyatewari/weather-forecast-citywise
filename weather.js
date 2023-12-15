//Complete the Weather API Backend part using openweathermap api
const introBox = document.getElementById("intro-box");
const mainBox = document.getElementById("main-box");
const weatherBox = document.getElementById("weather");

const submit = document.getElementById("submit");
const inputField = document.getElementById("input-text");
const newInput = document.getElementById("input-new");
const newSubmit = document.getElementById("submit-new");

let state = 0;

window.onload = () => {
    mainBox.style.display = "none";
    weatherBox.style.display = "none";
};

document.getElementById("start").addEventListener("click", () => {
    introBox.style.display = "none";
    mainBox.style.display = "flex";
    inputField.placeholder.innerHTML = `Enter here &#129488;`
    state = 0;
});

inputField.addEventListener("focus", () => {
    inputField.classList.add("active");
});

inputField.addEventListener("blur", () => {
    inputField.classList.remove("active");
});

newInput.addEventListener("focus", () => {
    newInput.classList.add("active");
})

newInput.addEventListener("blur", () => {
    newInput.classList.remove("active");
})

const APIKEY = "9d8d208d52c68814b02f2f3cbb17fdde";

window.addEventListener("keydown",(e)=>{
    if(e.key == "Enter"){
        var cityname = inputField.value;
        fetchCity(cityname);
        
        var cityname = newInput.value;
        fetchCity(cityname);        
    }
    state++;
});

inputField.placeholder.innerHTML = `Enter here &#129488;`
newInput.placeholder.innerHTML = `Try for another place &#128526;`;

submit.addEventListener("click", () => {
    var cityname = inputField.value;
    fetchCity(cityname);
    inputField.placeholder.innerHTML = `Enter here &#129488;`
})

newSubmit.addEventListener("click", () => {
    var cityname = newInput.value;
    fetchCity(cityname);
    if (newInput.value.length == 0) {
        newInput.placeholder.innerHTML = `Try for another place &#128526;`;
    }
    if (state > 0) {
        newInput.placeholder = `INPUT NOT FOUND !`
    }
})

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];

function calculateDate() {
    const datediv = document.getElementById("date");
    var currentdate = new Date();
    var day = currentdate.getDate();
    var month = months[currentdate.getMonth()] 
    var year = currentdate.getFullYear()
    
    var today = `${day} ${month} ${year}`
    datediv.innerHTML = `${today}`;
}

// Progression 1: Create a function and fetch data using "fetch" from openweathermap api and display the data as given in reference image.
function fetchCity(cityname) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=",cityname,"&limit=1&appid=",APIKEY)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        console.log(response["0"]);
        console.log(response["0"].lat, response["0"].lon);
        fetchInfo(response["0"].lat, response["0"].lon);
    })
    .catch((error) => {
        console.log(error);
        inputField.value = "";
        if (state > 0 ) {
            if (inputField.value.length != 0) {
            inputField.placeholder = `INPUT NOT FOUND !`
            newInput.placeholder = `INPUT NOT FOUND !`
            }
        }
        else if (state == 0) {
            newInput.placeholder.innerHTML = `Try for another place &#128526;`;
            inputField.placeholder.innerHTML = `Enter here &#129488;`
        }
        
        if (newInput.value.length != 0){
            newInput.value = "";
            inputField.placeholder = `INPUT NOT FOUND !`
            // newInput.placeholder = `INPUT NOT FOUND !`
        }
    })
}

function fetchInfo(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        console.log(response)
        weatherBox.style.display = "flex";
        mainBox.style.display = "none";
        state = 0;
        weatherData(response)
    })
    .catch((error) => {
        console.log(error);
        console.log("Some indefinite error occured")
    })
}   

function weatherData(response) {
    let temp = response.main["feels_like"];
    temp -= 273.15;
    temp = temp.toFixed(1);

    let place = response.name;
    let country = response.sys.country;
    let description = response.weather["0"].description;
    let humidity = response.main.humidity

    let icondesc = response.weather[0].main
    fetchIcons(icondesc);
    calculateDate();

    const citycountrydiv = document.getElementById("city-country");
    const tempdiv = document.getElementById("temp");
    const humiddiv = document.getElementById("humid");
    const descriptiondiv = document.getElementById("description");
    
    citycountrydiv.innerHTML = `${place}, ${country}`;
    tempdiv.innerHTML = `${temp}<span style="font-size: 1.3rem;">&#8451;</span>`
    humiddiv.innerHTML = `${humidity}%`
    descriptiondiv.innerHTML = `${description}`
    
    state = 0;
}

const weathericons = [
    "./assets/cloudy.png",
    "./assets/storm.png",
    "./assets/smoke.png",
    "./assets/rain.png",
    "./assets/clear.png",
    "./assets/snow.png",
    "./assets/mist.png",
    "./assets/fog.png",
    "./assets/sand.png",
    "./assets/tornado.png"
]


function fetchIcons(main) {
    let icon = document.getElementById("showicon");
    let iconDiv = document.createElement("div");
    let result;
    
    if (main == "Clouds") {
        result = weathericons[0]
    }
    if (main == "Thunderstorm") {
        result = weathericons[1];
    } 
    else if (main == "Smoke" || main == "Dust" || main == "Ash") {
        result = weathericons[2];
    }
    else if (main == "Rain" || main == "Drizzle") {
        result = weathericons[3];
    }
    else if (main == "Clear") {
        result = weathericons[4];
    }
    else if (main == "Snow") {
        result = weathericons[5];
    }
    else if (main == "Mist") {
        result = weathericons[6];
    }
    else if (main == "Fog" || main == "Haze") {
        result = weathericons[7];
    }
    else if (main == "Sand") {
        result = weathericons[8];
    }
    else if (main == "Tornado" || main == "Squall") {
        result = weathericons[9];
    }
    icon.src = result
}
fetchIcons();
