
Meteor.startup(function() {
  GoogleMaps.load();
  detectBrowser();
});

function detectBrowser() {
  var useragent = navigator.userAgent;
  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    console.log('on phone');
  } else {
    console.log('on web');
  }
  // var mapdiv = document.getElementById("map-container");
  //
  // if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
  //   mapdiv.style.width = '100%';
  //   mapdiv.style.height = '100%';
  //   console.log('on phone');
  // } else {
  //   mapdiv.style.width = '600px';
  //   mapdiv.style.height = '800px';
  //   console.log('on web');
  // }
};
