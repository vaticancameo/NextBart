var MAP_ZOOM = 15;

Template.map.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  }
});

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
    console.log(latLng);
    if(GoogleMaps.loaded() && latLng) {

      $("input").geocomplete({
        map: $("#map"),
        location: [latLng.lat, latLng.lng],
        mapOptions: {
          zoom: 15
        },
        markerOptions: {
          draggable: true
        }
      });
    }

  });
});
