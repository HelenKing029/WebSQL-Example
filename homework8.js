var locations = [{
  name: "Uptown",
  lat: 48.455813,
  lng: -123.375386
}, {
  name: "Downtown",
  lat: 48.424961,
  lng: -123.365695
}, {
  name: "Royal Oak",
  lat: 48.492316,
  lng: -123.388491
}];

var listElement = document.getElementById("locationList");

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 13,
  center: new google.maps.LatLng(48.463050, -123.312137),
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var infowindow = new google.maps.InfoWindow();
var markers = [];

var mydb;

//Test for browser compatibility
if (!window.openDatabase) {
  alert("WebSQL is not supported by your browser!");
} else {
  //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
  mydb = openDatabase("mylocation_db", "0.1", "A Database of Places I Like", 1024 * 1024);

  //create the cars table using SQL for the database using a transaction
  mydb.transaction(function (t) {
    t.executeSql("CREATE TABLE IF NOT EXISTS myloc1 (id INTEGER PRIMARY KEY ASC, nameloc TEXT, latitude TEXT, longitude TEXT)");
  });
}

//function to add the car to the database
function addLoc() {
  //check to ensure the mydb object has been created
  if (!mydb) {
    alert("db not found, your browser does not support web sql!");
  } else {
    //get the values of the make and model text inputs
    var nameloc = document.getElementById("nameloc").value;
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;

    //Test to ensure that the user has entered both a make and model
    if (nameloc === "" || latitude === "" || longitude === "") {
      alert("You must enter a make and model!");
      return;
    }

    console.log("Adding location:", nameloc, latitude, longitude);
    //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
    mydb.transaction(function (t) {
      t.executeSql("INSERT INTO myloc1 (nameloc, latitude, longitude) VALUES (?, ?, ?)", [nameloc, latitude, longitude]);
      outputLocations();
    });
  }
}


//function to remove a car from the database, passed the row id as it's only parameter

function deleteLoc(id) {
  //check to ensure the mydb object has been created
  if (!mydb) {
    alert("db not found, your browser does not support web sql!");
  } else {
    //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
    mydb.transaction(function (t) {
      t.executeSql("DELETE FROM myloc1 WHERE id=?", [id], outputLocations);
    });
  }
}

//function to get the list of cars from the database
function outputLocations() {
  //check to ensure the mydb object has been created
  if (!mydb) {
    alert("db not found, your browser does not support web sql!");
  } else {
    //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
    mydb.transaction(function (t) {
      t.executeSql("SELECT * FROM myloc1", [], updateLocations);
    });
  }
}

//function to output the list of cars in the database
function updateLocations(transaction, results) {
  console.log(transaction, results);

  locations = [];

  //Iterate through the results
  for (var i = 0; i < results.rows.length; i++) {
    var row = results.rows.item(i);
    locations.push({
      id: row.id,
      name: row.nameloc,
      lat: row.latitude,
      lng: row.longitude
    });
  }

  // clear list
  listElement.innerHTML = "";
  // clear map
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  for (var i = 0; i < locations.length; i++) {
    listElement.innerHTML += "<li>" + locations[i].name + " - " + locations[i].lat + " - " + locations[i].lng + " (<a href='javascript:void(0);' onclick='deleteLoc(" + locations[i].id + ");'>Delete Location</a>)";

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      title: locations[i].title,
      map: map
    });

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function (e) {
      map.setZoom(17);
      console.log(e);
      map.setCenter(e.latLng);
    });
  }
}

outputLocations();
