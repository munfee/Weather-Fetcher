window.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {

    const success = (pos) => {
      const { latitude: lat, longitude: long } = pos.coords;
      const http = new XMLHttpRequest(); // Get weather info through FCC proxy API
      const url =
        `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${long}`;

      http.open("GET", url, true);
      http.send();

      http.onreadystatechange = () => {
        if (http.readyState === 4 && http.status === 200) {
          const data = JSON.parse(http.responseText);
          // --------------------TODO : destructuring assignment to unclog constant assignment
          console.log(data);
          const city = document.createTextNode(data.name + ", ");
          const country = document.createTextNode(data.sys.country);
          const celsius = document.createTextNode(parseFloat(data.main.temp).toFixed(1));
          const fahr = document.createTextNode(
            Math.round(data.main.temp * 1.8 + 32)
          );
          // -------------------TODO : querySelectorAll loop to assign ID constants 
          const cityNode = document.getElementById("ville");
          const countryNode = document.getElementById("pays");
          const tempNode = document.getElementById("temp");
          const img = document.getElementById("img");
          const unit = document.getElementById("unit");
          const unitIcon = document.getElementById("unit-icon");

          img.className = data.weather[0].main.toLowerCase();
          cityNode.insertBefore(city, cityNode.childNodes[0]);
          countryNode.appendChild(country);

          unit.textContent = "C";
          unitIcon.innerHTML = " &#176;";
          tempNode.insertBefore(celsius, document.getElementById("unit-icon"));

          unit.addEventListener("click", function () { // Temp unit toggling
            this.classList.toggle("fahr");
            if (this.classList.contains("fahr")) {
              this.textContent = "F";
              tempNode.replaceChild(fahr, tempNode.childNodes[0]);
            } else {
              this.textContent = "C";
              tempNode.replaceChild(celsius, tempNode.childNodes[0]);
            }
          });
        }
      };
    }

    const error = (e) => {
      let errMsg = `<p id="error">${e.code}: ${e.message}<br>Please activate Geolocation to retrieve weather information</p>`;
      document.body.innerHTML = errMsg;
    }

    navigator.geolocation.getCurrentPosition(success, error); //TODO : User gesture to ask geolocation
  }
  // ------------------Time formatting in DOM
  let refreshInfo = () => {
    let [hour, min] = [new Date().getHours(), new Date().getMinutes()];
    let minutesFormat = () => {
      if (min < 10) return "0" + min;
      return min;
    };
    let hourDisplay = document.getElementById("hour");
    hourDisplay.innerHTML = `<p>${hour}<span>:</span>${minutesFormat()}</p>`;
    //------------------Assign sunMoon icon position and appearance depending on current time
    const yAxisValues = [16.5, 11, 9.5, 8, 7.5, 7, 6.5]; // preset y axis position values for icon
    const sunMoon = document.querySelector('#sunMoon-icon');
    let posLeft, posTop;
    sunMoon.className = 'fas fa-sun';
    if (hour < 6 || hour >= 18) { sunMoon.className = 'fas fa-moon'; hour -= 12; }
    posLeft = -34 + (((hour - 6) / 12) * 68) + (min / 60) * ((1 / 12) * 68);
    posTop = yAxisValues[Math.abs(Math.abs(hour - 12) - 6)];
    sunMoon.style.left = `${posLeft}vw`;
    sunMoon.style.top = `${posTop}vw`;
  }
  setInterval(refreshInfo, 1000);
});