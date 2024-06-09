
document.addEventListener("DOMContentLoaded", function () {
  GetData();

  let levels = ["Level 1", "Level 2", "Level 3"];
  let currentLevel = 0;
  let car = $('#car');
  let frame = $('#frame');
  let gameStarted = false;
  let parkingLines = [];
  let keys = {};
  let position = { top: 50, left: 50, angle: 0 };
  const speed = 0.5;
  const rotationSpeed = 1;

  // random yaranan levellere uygun buton yaradilmasi
  function createLevelsButtons() {
    levels.forEach((level, index) => {
      let button = $('<button>').text(level).attr('id', `level-${index + 1}`).prop('disabled', index !== 0);
      button.on('click', () => startLevel(index));
      $('.levels-board .container').append(button);
    });
  }
  createLevelsButtons();

  // oyuna baslama butonuna click eventi
  $("#startBtn").on("click", () => {
    $(".game-start").css({ "opacity": 0, "visibility": "hidden" });
    $(".levels-board").css({ "opacity": 1, "visibility": "visible" });
  });

  // secilen leveli baslatmaq
  function startLevel(level) {
    currentLevel = level;
    $(".levels-board").css({ "opacity": 0, "visibility": "hidden" });
    $(".game-board").css({ "opacity": 1, "visibility": "visible" });
    gameStarted = true;
    resetCarPosition();
    generateParkingLines();
    enableCarMovement();
  }

  // masinin positonu sifirlanir
  function resetCarPosition() {
    position = { top: 50, left: 50, angle: 0 };
    car.css({ top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(0deg)' });
  }

  // random 2 dene xettin generate olunmasi
  function generateParkingLines() {
    parkingLines.forEach(line => line.remove());
    parkingLines = [];
    let line1 = $('<div>').addClass('parking-line');
    let line2 = $('<div>').addClass('parking-line');

    let randomTop = Math.random() * 60 + 20;
    line1.css({ top: `${randomTop}%` });
    line2.css({ top: `${randomTop + 20}%` });

    $('#frame').append(line1, line2);
    parkingLines.push(line1, line2);
  }

  function enableCarMovement() {
    $(document).on('keydown', (e) => {
      keys[e.key] = true;
    });

    $(document).on('keyup', (e) => {
      keys[e.key] = false;
    });



    // masini hereket etdirmek 
    // ve her defe harasa deyende masinin positionunu yoxlayan funksiyaya gondermek
    function updateCarPosition() {
      if (!gameStarted) return;

      let nextPosition = { ...position };

      if (keys['ArrowUp']) {
        nextPosition.top -= speed * Math.cos(position.angle * Math.PI / 180);
        nextPosition.left += speed * Math.sin(position.angle * Math.PI / 180);
      }
      if (keys['ArrowDown']) {
        nextPosition.top += speed * Math.cos(position.angle * Math.PI / 180);
        nextPosition.left -= speed * Math.sin(position.angle * Math.PI / 180);
      }
      if (keys['ArrowLeft']) {
        nextPosition.angle -= rotationSpeed;
      }
      if (keys['ArrowRight']) {
        nextPosition.angle += rotationSpeed;
      }

      let frameRect = frame[0].getBoundingClientRect();
      let carRect = car[0].getBoundingClientRect();
      let carWidth = carRect.width;
      let carHeight = carRect.height;

      if (carRect.left < frameRect.left) {
        nextPosition.left = position.left;
      }
      if (carRect.right > frameRect.right) {
        nextPosition.left = position.left;
      }
      if (carRect.top < frameRect.top) {
        nextPosition.top = position.top;
      }
      if (carRect.bottom > frameRect.bottom) {
        nextPosition.top = position.top;
      }

      position = nextPosition;

      car.css({
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: `translate(-50%, -50%) rotate(${position.angle}deg)`
      });

      checkCollisions(position);

      requestAnimationFrame(updateCarPosition);
    }

    requestAnimationFrame(updateCarPosition);
  }


  // neticenin yoxlanilmasi
  // ve oyunu bitiren funksiyanin ona uygun cagirilmasi

  function checkCollisions(position) {
    let carRect = car[0].getBoundingClientRect();
    let frameRect = frame[0].getBoundingClientRect();

    if (
      carRect.left < frameRect.left ||
      carRect.top < frameRect.top ||
      carRect.right > frameRect.right ||
      carRect.bottom > frameRect.bottom
    ) {
      endGame(false);
      return;
    }

    for (let line of parkingLines) {
      let lineRect = line[0].getBoundingClientRect();
      if (
        carRect.left < lineRect.right &&
        carRect.right > lineRect.left &&
        carRect.top < lineRect.bottom &&
        carRect.bottom > lineRect.top
      ) {
        endGame(false);
        return;
      }
    }

    let line1Rect = parkingLines[0][0].getBoundingClientRect();
    let line2Rect = parkingLines[1][0].getBoundingClientRect();

    if (
      carRect.left > line1Rect.right &&
      carRect.right < line2Rect.left &&
      carRect.top > line1Rect.top &&
      carRect.bottom < line2Rect.bottom
    ) {
      endGame(true);
      return;
    }

  }


  // oyunun neticeye uygun bitirilmesi 
  function endGame(win) {
    gameStarted = false;
    $(".game-end").css({ "opacity": 1, "visibility": "visible" });
    $("#end-message").text(win ? "Congratulations! Successfully parked car." : "You lose. Try again.");

    $("#okey-btn").one('click', () => {
      if (win) {
        currentLevel++;
        if (currentLevel < levels.length) {
          $(`#level-${currentLevel + 1}`).prop('disabled', false);
          $(".game-end").css({ "opacity": 0, "visibility": "hidden" });
          $(".levels-board").css({ "opacity": 1, "visibility": "visible" });
        } else {
          resetGame();
        }
      } else {
        resetGame();
      }
    });
  }

  // oyunun resetlenmesi leveller olan ekrana qayitmasi
  function resetGame() {
    currentLevel = 0;
    $(".game-end").css({ "opacity": 0, "visibility": "hidden" });
    $(".game-board").css({ "opacity": 0, "visibility": "hidden" });
    $(".levels-board").css({ "opacity": 1, "visibility": "visible" });
    $(".levels-board button").prop('disabled', true);
    $("#level-1").prop('disabled', false);
    resetCarPosition();
  }
});




// hava statusu ucun fetch atilib ekrana cixarilmasi

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







