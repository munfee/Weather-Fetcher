window.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------------------------defining object to store weather data 
  let idObj = { currentUnit: 'C' }, idArr = document.querySelectorAll('body [id]'); // computed properties to assign id nodes in Object
  idArr.forEach(idNode => idObj[idNode.id] = idNode);

  let newTextNode = function (parent, textNode) { // text node appending helper funtion
    if (parent.childNodes.length === 0) {
      parent.appendChild(textNode);
    } else parent.replaceChild(textNode, parent.childNodes[0]);
  }
  //----------------------------idObj methods 
  idObj.setLocation = function (city, country) { // parameters destructuring assignment
    let location = document.createTextNode(`${city}, ${country}`);
    newTextNode(this['location'], location);
  };

  idObj.setTemp = function (temp) { // see line 17
    let unitNumber = document.createTextNode(`${this.currentUnit === 'C' ? parseFloat(temp).toFixed(1) : Math.round(temp * 1.8 + 32)}`);
    newTextNode(this['unit'], unitNumber);
    let unit = document.createTextNode(`°${this.currentUnit}`);
    newTextNode(this['unit-icon'], unit);
  };

  idObj.changeCurrentUnit = function (temp) {
    this.currentUnit = this.currentUnit === 'C' ? 'F' : 'C';
    this.setTemp(temp);
  };

  console.table(idObj);
  //--------------------------------------------------------------------------------------------------------------------------------
  if (navigator.geolocation) {

    const success = (pos) => {
      const { latitude: lat, longitude: long } = pos.coords;
      const url = `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${long}`;

      let httpReq = () => {
        const http = new XMLHttpRequest(); // Get weather info through FCC proxy API
        http.open("GET", url, true);
        http.send();

        http.onreadystatechange = () => {
          if (http.readyState === 4 && http.status === 200) {
            const data = JSON.parse(http.responseText);
            console.log(data);

            idObj.setLocation(data.name, data.sys.country);
            idObj.setTemp(data.main.temp)
            idObj['img'].className = data.weather[0].main.toLowerCase();
            idObj['unit-icon'].onclick = function () { idObj.changeCurrentUnit(data.main.temp); };
            console.log('GET');
          }
        };
      }
      httpReq();
      setInterval(httpReq, 10000);
    }

    const error = (e) => {
      let errMsg = `<p id="error">${e.code}: ${e.message}<br>Please activate Geolocation to retrieve weather information</p>`;
      document.body.innerHTML = errMsg;
    }

    navigator.geolocation.getCurrentPosition(success, error); //TODO : User gesture to ask geolocation
  }
  // ------------------Time formatting in DOM
  let refreshInfo = () => {
    let d = new Date();
    let [hour, min, sec] = [d.getHours(), d.getMinutes(), d.getSeconds()];
    let format = (time) => {
      if (time < 10) return "0" + time;
      return time;
    };

    idObj['hour'].innerHTML = `<p>${hour}<span>:</span>${format(min)}<span>:</span>${format(sec)}</p>`;
    //------------------Assign idObj['sunMoon-icon'] icon position and appearance depending on current time
    let yAxisValues = [16.5, 11, 9.5, 8, 7.5, 7, 6.5]; // preset y axis position values for icon
    yAxisValues = [...yAxisValues, ...(yAxisValues.slice(0, 6).reverse())];
    if (hour < 6 || hour >= 18) {
      idObj['sunMoon-icon'].className = 'fas fa-moon';
      hour -= 12;
    }
    let posLeft = -34 + (((hour - 6) / 12) * 68) + (min / 60) * ((1 / 12) * 68);
    let posTop = yAxisValues[hour - 6] + ((yAxisValues[hour - 5]-yAxisValues[hour - 6])*(min/60));
    idObj['sunMoon-icon'].style.left = `${posLeft}vw`;
    idObj['sunMoon-icon'].style.top = `${posTop}vw`;
    if (hour < 7) document.querySelector('.fa-sun').style.color = `rgb(255, ${125 + min * 1.5}, 0)`;
    if (hour >= 17) document.querySelector('.fa-sun').style.color = `rgb(255, ${215 - min * 1.5}, 0)`;
  }
  setInterval(refreshInfo, 1000);
});