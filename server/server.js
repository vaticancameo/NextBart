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
        Stations.upsert({name: station.name}, {
          "name" : station.name,
          "abbr" : station.abbr,
          "gtfs_latitude" : parseFloat(station.gtfs_latitude),
          "gtfs_longitude" : parseFloat(station.gtfs_longitude),
          "address" : station.address,
          "city" : station.city,
          "county" : station.county,
          "state" : station.state,
          "zipcode" : station.zipcode
        });
      })
    });
  })
}
