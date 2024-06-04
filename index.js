
// Weather status fetching

let url = "https://api.openweathermap.org/data/2.5/weather?q=Baku&appid=71c9b63ff2dd29a06f37a2e36e904f4d";

async function SendRequest(url) {
  return fetch(url).then((response) => response.json());
}

function GetData() {
  SendRequest(url)
    .then((data) => {
      let weatherMain = data.weather[0].main;
      let temperature = data.main.temp;

      switch (weatherMain) {
        case "Clouds":
          $("#weatherImg").attr("src", "/images/cloudy.png");
          break;
        case "Clear":
          $("#weatherImg").attr("src", "/images/clear.png");
          break;
        case "Rain":
          $("#weatherImg").attr("src", "/images/rainy.png");
          break;
        case "Drizzle":
          $("#weatherImg").attr("src", "/images/drizzle.png");
          break;
        case "Mist":
          $("#weatherImg").attr("src", "/images/mist.png");
          break;
        default:
          $("#weatherImg").attr("src", "/images/clear.png");
          break;
      }

      $("#desc").text(`${Math.round(temperature - 273.15)}°C`);
      $("#city").text(data.name);
    })
    .catch((error) => {
      console.error(error);
    });
}

$(document).ready(function () {
  GetData();
});




// Game starting process

$("#startBtn").on("click", () => {
  StartGame();
})


function StartGame() {
  $(".game-start").css({ "opacity": 0, "visibiltiy": "hidden" });
}
