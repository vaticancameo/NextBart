var MAP_ZOOM = 15;
var map;

var pythagoras = function(lat1, lng1, lat2, lng2) {
  var toRadians = function(deg) {
    return deg * (Math.PI/180)
  }
  var φ1 = toRadians(lat1),
     φ2 = toRadians(lat2),
     λ1 = toRadians(lng1),
     λ2 = toRadians(lng2),
     x = (λ2-λ1) * Math.cos((φ1+φ2)/2),
     y = (φ2-φ1);
     return Math.sqrt(x*x + y*y) * 6371 //radius of earth in km;
};

var closestStation = function(lat, lng) {
  var stations = [];
  Stations.find({
    gtfs_latitude: {$gte: lat - 0.022, $lte: lat + 0.022 },
    gtfs_longitude: {$gte: lng - 0.022 , $lte: lng + 0.022}
  }, {fields: {abbr: 1, name: 1, gtfs_latitude: 1, gtfs_longitude: 1}})
  .forEach(function(s) {
    stations.push({
      name: s.name,
      abbr: s.abbr,
      dist: pythagoras(lat,lng,s.gtfs_latitude,s.gtfs_longitude)
    });
  });
  if (stations.length === 1) {
    return stations[0];
  } else if (stations.length === 0) {
    return "No nearby station found";
  } else {
    var start = stations.pop();
    var closest = stations.reduce(function(memo, current) {
      return current.dist < memo.dist ? current : memo;
    }, start);
    return closest;
  }

}

Template.map.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  }
});

Template.map.events({
  'click #search': function() {
     $("input").trigger("geocode");
  }
})

Template.map.onRendered(function() {
  //fix mobile tap issue with fastclick
  $(document).on({
    'DOMNodeInserted': function() {
      $('.pac-item, .pac-item span', this).addClass('needsclick');
    }
  }, '.pac-container');
  //end of fix
  this.autorun(function() {
    var latLng = Geolocation.latLng();
    Session.set('loc', latLng);
    if(GoogleMaps.loaded() && latLng) {

      $("input").geocomplete({
        map: $("#map"),
        location: [latLng.lat, latLng.lng],
        mapOptions: {
          zoom: 15
        }
      }).bind("geocode:click", function(event, result){
        var map = $("input").geocomplete("map");
        console.log(result.G, result.K);
        // center = new google.maps.LatLng(result.G, result.K);
        // map.setCenter(center);
      });
      console.log(closestStation(latLng.lat, latLng.lng));

    }

  });
});
