var MAP_ZOOM = 15;

Template.map.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  }
});

Template.map.onRendered(function() {

  this.autorun(function() {
    console.log('autorun');
    var latLng = Geolocation.latLng();
    console.log(latLng);
    if(GoogleMaps.loaded() && latLng) {
      //inserts autocomplete form
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
