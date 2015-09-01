var MAP_ZOOM = 15;

Template.map.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  }
});

Template.map.onRendered(function() {

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
