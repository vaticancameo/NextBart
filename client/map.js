var MAP_ZOOM = 15;

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
        },
        markerOptions: {
          icon: './circle.svg'
        }
      })

      //.bind("geocode:click", function(event, result){
      //   var map = $("input").geocomplete("map");
      //   console.log(result.G, result.K);
      //   // center = new google.maps.LatLng(result.G, result.K);
      //   // map.setCenter(center);
      // });
      var map = $("input").geocomplete('map');
      var stops = closestStops(latLng.lat, latLng.lng);

      stops.forEach(function(stop) {
        new google.maps.Marker({
          position: new google.maps.LatLng(stop.lat, stop.lon),
          map: map,
          title: stop.title,
          icon: './vehicle29.svg'
          // animation: google.maps.Animation.DROP,
        });
      })
      var station = closestStation(latLng.lat, latLng.lng);
      //bartTimes(station.abbr);
    }

  });
});
