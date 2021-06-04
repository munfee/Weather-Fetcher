window.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {

    const success = (pos) => {
      const { latitude: lat, longitude: long } = pos.coords;
      const http = new XMLHttpRequest(); // Get weather info through FCC proxy API
      const url = `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${long}`;

      let idObj = { currentUnit: 'C' }, idArr = ['location', 'img', 'unit', 'unit-icon']; // computed properties to assign id nodes in Object
      idArr.forEach(idNode => idObj[idNode] = document.getElementById(idNode));
      let newTextNode = function (parent, textNode) { // text node appending helper funtion
        if (parent.childNodes.length === 0) {
          parent.appendChild(textNode);
        } else parent.replaceChild(textNode, parent.childNodes[0]);
      }
      //----------------------------idObj methods 
      idObj.setLocation = function ({ name: city, sys: { country } }) { // parameters destructuring assignment
        let location = document.createTextNode(`${city}, ${country}`);
        newTextNode(this['location'], location);
      };

      idObj.setTemp = function ({ main: { temp } }) { // see line 17
        let unitNumber = document.createTextNode(`${this.currentUnit === 'C' ? parseFloat(temp).toFixed(1) : Math.round(temp * 1.8 + 32)}`);
        newTextNode(this['unit'], unitNumber);
        let unit = document.createTextNode(`°${this.currentUnit}`);
        newTextNode(this['unit-icon'], unit);
      };

      idObj.changeCurrentUnit = function (temp) {
        this.currentUnit = this.currentUnit === 'C' ? 'F' : 'C';
        this.setTemp(temp);
      }.bind(idObj);
      //-------------------------------
      
      let httpReq = () => {
      http.open("GET", url, true);
      http.send();

        http.onreadystatechange = () => {
          if (http.readyState === 4 && http.status === 200) {
            const data = JSON.parse(http.responseText);

            idObj.setLocation(data);
            idObj.setTemp(data)
            idObj['img'].className = data.weather[0].main.toLowerCase();
            idObj['unit-icon'].addEventListener("click", () => { idObj.changeCurrentUnit(data); });
            console.log('new call');
          }
        };
      }
      httpReq();
      setInterval(httpReq, 1000);
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