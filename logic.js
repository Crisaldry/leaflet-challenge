// fetch the data from the URL : Significant Earthquakes in the last 30 days
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

// create the map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
  });
  
  // add the tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(myMap);
  
  
  // read the earthquake data from the USGS API
  d3.json(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
  ).then(function (data) {
    // create a function to determine the marker size based on earthquake magnitude
    function markerSize(magnitude) {
      return magnitude * 4;
    }
  
    // create a function to determine the marker color based on earthquake depth
    function markerColor(depth) {
      if (depth < 10) {
        return "#7CFC00";
      } else if (depth < 30) {
        return "#FFD700";
      } else if (depth < 50) {
        return "#FFA500";
      } else if (depth < 70) {
        return "#FF8C00";
      } else if (depth < 90) {
        return "#FF4500";
      } else {
        return "#FF0000";
      }
    }
  
    // add a marker for each earthquake
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).bindPopup(
          "<h3>" +
            feature.properties.place +
            "</h3><hr><p>" +
            new Date(feature.properties.time) +
            "</p><p>" +
            "Magnitude: " +
            feature.properties.mag +
            "</p><p>" +
            "Depth: " +
            feature.geometry.coordinates[2] +
            "</p>"
        );
      },
    }).addTo(myMap);
    // create a legend for the map
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    depths = [-10, 10, 30, 50, 70, 90],
    labels = [];

  div.innerHTML += "<h4>Earthquake Depth</h4>";

  // loop through the depth intervals and generate a label with a colored square for each interval
  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(myMap);

})

