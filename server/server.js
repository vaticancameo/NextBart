var BART = 'http://api.bart.gov/api/stn.aspx?key=MW9S-E7SL-26DU-VV8V';
var BUS = 'http://services.my511.org/Transit2.0/ ';
var TOKEN = 'b1e2b68f-ce35-4448-9bab-6639e577d192';
var count = 0;
var getStops = function (agency, tag) {
  HTTP.get('http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a='+agency+'&r='+tag, function (err, res) {
    if (err) {
      console.log("Error getting stops for route: ", err);
    }
    xml2js.parseString(res.content, function (err, parsedJson) {
      if (err) {
        console.log("Error getting stops for Route "+ tag);
      }
      var stops = parsedJson.body.route[0].stop;
      _.each(stops, function (obj) {
        Stops.upsert({stopId: obj.$.stopId}, {
          tag: obj.$.tag,
          title: obj.$.title,
          lat: parseFloat(obj.$.lat),
          lon: parseFloat(obj.$.lon),
          stopId: obj.$.stopId
        }, function(err, docs) {
          count += docs.numberAffected;
          console.log(count + ' docs changed so far');
        });
      });
    });
  });
};

var getRoutes = function(agency) {
  if (Stops.find().count()) {
    console.log('stops already stored in db');
    return;
  }
  HTTP.get('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=' + agency, function (err, res) {
    //converts XML from NextBus API to JSON
    if (err) {
                console.log("Error getting all Routes: ", err);
              }
    xml2js.parseString(res.content, function (err, parsedJson){
      var routes = parsedJson.body.route;
      _.each(routes, function (obj) {
        getStops(agency, obj.$.tag);
      });
    });
  });
};

var getStations = function() {
  if(Stations.find().count()) {
    console.log('stations already stored in db');
    return;
  }
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

Meteor.startup(function() {
  getStations();
  getRoutes('sf-muni');
  getRoutes('actransit')
})
