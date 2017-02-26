var firebase = require('firebase');

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDaxfHggITB6xgUisng-De2gv-6cazokPk",
    authDomain: "eatwell-ef0a5.firebaseapp.com",
    databaseURL: "https://eatwell-ef0a5.firebaseio.com",
    storageBucket: "eatwell-ef0a5.appspot.com",
    messagingSenderId: "62698950727"
  };

firebase.initializeApp(config);

// Get a database reference to our posts
var db = firebase.database();

module.exports = {

	// Attach an asynchronous callback to read the data at our posts reference
	getNutritionInfo: function(foodDescription){
		foodDescription = foodDescription.trim();
		var ref = db.ref("FOOD");
		ref.on("value", function(snapshot) {
			var value = snapshot.val();
			var result = value[foodDescription]['HEALTH LABELS'];
			return result;
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
	},
	getFoodsToAvoid: function(medCondition){
		var ref = db.ref("FOODSTOAVOID");
		ref.on("value", function(snapshot) {
			//console.log(snapshot.val());
			var result = snapshot.val();
			return result;
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});  
	},
	updateDB: function(food){
		var ref = db.ref("FOODSEATEN");
		ref.on("value", function(snapshot) {
			if(food=="APPLE"){	calorieVal = "115Cal";	ref.push({ "APPLE" : [calorieVal, "1"]});}
			if(food=="ORANGE"){	calorieVal = "87Cal";	ref.push({ "ORANGE" : [calorieVal, "1"]});}
			if(food=="BAR"){	calorieVal = "90Cal";	ref.push({ "GRANOLA BAR" : [calorieVal, "1"]});}
			if(food=="PASTA"){	calorieVal = "300Cal";	ref.push({ "PLAIN CHEESE PIZZA" : [calorieVal, "1"]});}
			if(food=="MAC"){	calorieVal = "563Cal";	ref.push({ "BIG MAC" : [calorieVal, "1"]});}
			if(food=="COFFEE"){	calorieVal = "100KCal";	 ref.push({ "COFFEE" : [calorieVal, "1"]});}
			
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

	}
};

