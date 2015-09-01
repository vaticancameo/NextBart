var BART = 'http://api.bart.gov/api/stn.aspx?key=MW9S-E7SL-26DU-VV8V';

Meteor.startup(function() {
  getStations();
})

function getStations() {
  HTTP.get(BART + '&cmd=stns', function(err, res) {
    xml2js.parseString(res.content, function(err, results) {
      var stations = results.root.stations[0].station;
      stations = JSON.parse('['+JSON.stringify(stations).replace(/[\[\]]/g,'')+']');
      stations.forEach(function(station) {
        Stations.upsert({name: station.name}, station);
      })
    });
  })
}
