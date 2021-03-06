window.onload = () =>{
    getCountryData();
    getHistoricalData();
}

var map;
var infoWindow;
 function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: -13.1339, lng: 27.8493},
     zoom: 5,
     styles: mapStyle
   });
   infoWindow = new google.maps.InfoWindow();
 }


 const getCountryData = () =>{
     fetch("https://corona.lmao.ninja/v2/countries")
     .then((response)=>{
         return response.json()
     }).then((data)=>{
         showDataOnMap(data);
         showDataInTable(data);
     })
 }

 const getHistoricalData = () =>{
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=30")
  .then((response)=>{
      return response.json()
  }).then((data)=>{
      //showDataOnMap(data);
      //showDataInTable(data);
      let chartData = buildChartData(data);
      buildChart(chartData);
  })
 }

 const buildChartData = (data) =>{
   let chartData = [];
   for(let date in data.cases){
     let newDataPoint = {
       x: date,
       y: data.cases[date]
     }
     chartData.push(newDataPoint);
   }
   return chartData;
 }

 const buildChart = (chartData) => {
   var timeFormat = 'MM/DD/YY';
   var ctx = document.getElementById('myChart').getContext('2d'); 
   var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
  
      // The data for our dataset
      data: {
          datasets: [{
              label: 'Total Cases',
              backgroundColor: '#1d2c4d',
              borderColor: '#1d2c4d',
              data: chartData
          }]
      },
  
      // Configuration options go here
      options: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: 'll'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
          }
          }],
          yAxes: [{
            ticks: {
              callback: function(value, index, values){
                return numeral(value).format('0,0');
              }
            }
          }]
        }
      }
    });  
 }

 const showDataOnMap =(data)=>{
     data.map((country) =>{

        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }
        var countryCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country.casesPerOneMillion * 100
          });

          var html = `
               <div class="info-container">
                    <div class="info-flag" style="background-image: url(${country.countryInfo.flag})">
                    </div>
                    <div class="info-name">
                    ${country.country}
                    </div>
                    <div class="info-conformed">
                    Total: ${country.cases}
                    </div>
                    <div class="info-recoveries">
                    Recovered: ${country.recovered}
                    </div>
                    <div class="info-deaths">
                    Deaths: ${country.deaths}
                    </div>
               </div>
          `

          var infoWindow = new google.maps.InfoWindow({
              content: html,
              position: countryCircle.center

          });

          google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
          });
          google.maps.event.addListener(countryCircle, 'mouseout', function() {
            infoWindow.close();
          });
     })
 }


 const showDataInTable = (data) =>{
     var html = "";
     data.forEach((country)=>{
         html += `
         <tr>
           <td>${country.country}</td>
           <td>${country.cases}</td>
           <td>${country.recovered}</td>
           <td>${country.deaths}</td>
       </tr>
         `
     })
     document.getElementById('table-data').innerHTML = html;
 }