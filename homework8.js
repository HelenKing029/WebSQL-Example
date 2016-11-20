//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("location_db", "0.1", "A Database of Locations I Like", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS location (id INTEGER PRIMARY KEY ASC, make TEXT, model TEXT)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}

//function to output the list of cars in the database

function updateLocationList(transaction, results) {
		console.log(transaction);
    console.log(results);
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("locationList");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

        listholder.innerHTML += "<li>" + row.nameloc + " - " + row.latitude +  " - " + row.longitude + " (<a href='javascript:void(0);' onclick='deleteLoc(" + row.id + ");'>Delete Location</a>)";
    }

}

//function to get the list of cars from the database

function outputLocations() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("SELECT * FROM location", [], updateLocationList);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

//function to add the car to the database

function addLoc() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var place = document.getElementById("nameloc").value;
        var latitude = document.getElementById("latitude").value;
        var longitude = document.getElementById("longitude").value;

        //Test to ensure that the user has entered both a make and model
        if (place !== "" && latitude !== "" && longitude !== "") {
            console.log(place, latitude, longitude);
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function(t) {
                t.executeSql("INSERT INTO location (place, latitude, longitude) VALUES (?, ?)", [place, latitude, longitude]);
                outputLocations();
            });
        } else {
            alert("You must enter a place, latitude and longitude!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }

    //function to remove a car from the database, passed the row id as it's only parameter

function deleteLoc(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("DELETE FROM location WHERE id=?", [id], outputLocations);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

outputLocations();


    //MAPPING FUNCTION //

var locations = [
    [
        "Uptown",
        48.455813,
         -123.375386
    ],
    [
            "Downtown",
        48.424961, 
        -123.365695
    ],
    [
        "Royal Oak",
        48.492316, 
        -123.388491
    ],
]



    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(48.462432, -123.311960),     
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker = [];
    var i;

    for (i = 0; i < locations.length; i++) { 
    console.log(i);
    console.log("marker: ",marker);
      marker[i] = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });


      google.maps.event.addListener(marker[i], 'click', function(e) {
          map.setZoom(17);
          console.log(e);
          map.setCenter(e.latLng);
        });

    }
}
