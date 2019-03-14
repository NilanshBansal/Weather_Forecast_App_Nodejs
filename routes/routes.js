var express = require('express');
var router = express.Router();
var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
var app_id = '&APPID=21185ad0ea8886e8f0c7f3bc1bb4daa9&units=metric';
var axios = require('axios');
var forecast_url = 'http://api.openweathermap.org/data/2.5/forecast?q=' 

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Weather Forecast Application' });
});

router.get('/graph', function (req, res, next) {
  res.render('graph');
});

router.get('/weather', function (req, res, next) {
  axios.get(url+ req.query.place + app_id)
    .then(function (response) {
      temp = null
      pressure = null
      humidity = null
      if (response.hasOwnProperty('data') && response.data.hasOwnProperty('main')){
        temp = response.data.main.temp;
        pressure = response.data.main.pressure;
        humidity = response.data.main.humidity;
      }
      return res.render('weather', { temp,pressure,humidity});
    })
    .catch(function (error) {
      console.log(error);
      res.status(400);
      return res.send(error);
    });
});


router.get('/weather_forecast', function (req, res, next) {
  axios.get(forecast_url+ req.query.place + app_id)
    .then(function (response) {
      items = []
      output = []
      if (response.hasOwnProperty('data') && response.data.hasOwnProperty('list')){
        items = response.data.list;
      }
      for(var i=0;i< items.length;i++){
        time = items[i].dt_txt.substring(10);
        if(time.indexOf("12:00:00") > -1){
          temp = items[i].main.temp;
          pressure = items[i].main.pressure;
          humidity = items[i].main.humidity;
          date = items[i].dt_txt.split(" ")[0];
          output.push({temp,pressure,humidity,date});
        }
      }
      return res.render('forecast', {'forecast':output,'place':req.query.place});
    })
    .catch(function (error) {
      console.log(error);
      res.status(400);
      return res.send(error);
    });
});

module.exports = router;

