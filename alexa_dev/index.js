var Alexa = require('alexa-sdk');
var base64 = require('base-64');
var urlencode = require('urlencode');
var request = require('request');
//var d3 = require('d3-request');


var app_ID = "amzn1.ask.skill.6cf7010c-c48c-465f-8dd7-fa1852af791e";
var total_calories = 100;
var foodItem;
var ICD10_values = ["Z91011", "Milk allergy"];
var myHealthConditions = {
    "Problems": [
        {
            "FreeText": "Milk Allergy"
        }
    ]
};


exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = app_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {

    'AskIntent': function() {
        foodItem = (this.event.request.intent.slots.food.value != null) ? (this.event.request.intent.slots.food.value) : (this.event.request.intent.slots.drink.value);
        this.emit('AskHelper');
        
    },

    'TellIntent': function () {
        myHealthConditions.Problems[0].FreeText = this.event.request.intent.slots.condition.value;
        this.emit('TellHelper');

    },
    
    'AteIntent': function () {
        this.emit('AteHelper'); 
    },
    
    'AskHelper': function () {
        var k = JSON.stringify(all_data.Food[foodItem].diet_labels.toString())+JSON.stringify(all_data.Food[foodItem].health_labels.toString());
        var l = all_data.FoodsToAvoid[ICD10_values[0]];
        var count = 0;
        l.forEach(function(d){
            if(k.indexOf(d+"_FREE") == -1){
                tem += (" "+d+"_FREE");
                count += 1;
            }
        });
        if(count==0){
            this.emit(':tell', 'Yes, you can go ahead and have the ' + foodItem);
        }
        else{
            this.emit(':tell', 'I would advise you not to have the ' + foodItem + ' due to your ' + ICD10_values[1]);
        }
        
    },
    
    'TellHelper': function () {
        var self = this;
        var options1 = {
            self: self,
            method: 'POST',
            url: 'https://ipl-nonproduction-customer_validation.e-imo.com/api/v3/actions/categorize',
            'Content-Type': 'application/json',
            headers:
            {
                'Content-Type':'application/json',
                accept: 'application/json',
                authorization: 'Basic ' + base64.encode('9250e76fa8da4f42b9061d4b69f887f9' + ':' +  'AF9AC67D32F8BF7609EDAEF56EF3F82DFF7630214CCB824215DBA17F413E4425')
            },
            body: JSON.stringify(myHealthConditions)
        };
        
        request(options1, function callback(error, response, body) {
            var that = this;
            if (error) callback(error);
            var result = JSON.parse(response.body).Categories[0].Problems[0].Details;
            ICD10_values[0] = result.ICD10.replace('.','');
            ICD10_values[1] = result.IMOTitle;
            //result = JSON.stringify(result);
            options1.self.emit(':tell', 'Okay, I got you. Your records are updated.');
            return; //result.toString();
        });
    },
    
    'AteHelper': function () {
        foodItem = (this.event.request.intent.slots.food.value != null) ? (this.event.request.intent.slots.food.value) : (this.event.request.intent.slots.drink.value);
        var h = (all_data.Food[foodItem].Calories.search('kCal')==-1)?(parseInt(all_data.Food[foodItem].Calories.replace('Cal',''))/1000):parseInt(all_data.Food[foodItem].Calories.replace('kCal',''));
        total_calories += h;
        this.emit(':tell','Alright, today your calorie count is ' + total_calories + ' kCal so far.');
    }
  
};



var all_data = {
	"FoodsToAvoid":{
		"Z91010": ["PEANUT", "NUTS", "NUTMEG"],
		"Z91011": ["MILK", "CHEESE", "SOY", "CREAM"],
		"Z91012": ["MILK", "EGGS"],
		"Z91013": ["FISH", "SEAFOOD", "SHRIMP", "OCTOPUS", "CRAB", "LOBSTER"],
		"Z91018": ["NUTS", "NUTMEG"],
		"Z9102": ["ADDITIVES", "ADDED_SUGARS", "ARTIFICIAL"],
		"Z91030": ["HONEY", "BEEWAX"],
		"Z91040": ["APPLE", "AVOCADO", "BANANA", "CARROT", "CELERY", "CHESTNUT", "KIWI", "MELONS", "PAPAYA", "RAW_POTATO", "RAW_TOMATO"],
		"Z91041": ["CANDY", "CAKE", "BREAKFAST_CEREAL", "MILK", "CHEESE", "SOY", "CREAM", "ARTIFICIAL", "ADDITIVES"],
		"Z90041": ["GLUTEN", "MILLET", "QUINOA", "RICE", "GRAHAM_FLOUR", "DURUM"],
		"Z82041": ["FAT", "SALT", "ADDED_SUGARS", "HIGH_CARBS", "HIGH_CHOLESTROL"],
		"E1136": ["ADDED_SUGARS", "FRUITS", "HIGH_FAT", "CAKE", "DRIED_FRUIT"]
	},
	"Food": {
		"apple": {
			"Name": ["Apple", "Raw_Apple"],
			"Ingredients": "Apple",
			"Measure": "Large",
			"Calories": "115Cal",
			"Weight": "223g",
			"Retained Weight": "223g",
			"Nutrients": {
				"Protien": "0.57980g",
				"Fat": "0.3791g",
				"Carbohydrate": "30.7963g",
				"Energy": "115.96kCal",
				"Sodium": "4g",
				"Sugar": "23.1697g"
			},
			"diet_labels": ["LOW_FAT", "LOW_SODIUM"],
			"health_labels": ["FAT_FREE", "LOW_FAT_ABS", "LOW_POTASSIUM", "KIDNEY_FRIENDLY", "VEGAN", "VEGETARIAN", "PESCATARIAN", "PALEO", "DAIRY_FREE", "GLUTEN_FREE", "WHEAT_FREE", "EGG_FREE", "MILK_FREE", "PEANUT_FREE", "TREE_NUT_FREE", "SOY_FREE", "FISH_FREE", "SHELLFISH_FREE", "PORK_FREE", "RED_MEAT_FREE", "ALCOHOL_FREE", "NO_OIL_ADDED", "NO_SUGAR_ADDED", "KOSHER", "CHEESE_FREE", "CREAM_FREE", "EGGS_FREE", "SEAFOOD_FREE"]
		},
	"orange": {
		"Name": ["Orange", "Raw", "Fruits"],
		"Ingredients": "Orange",
		"Measure": "Large",
		"Calories": "87Cal",
		"Weight": "184g",
		"Retained Weight": "170g",
		"Nutrients": {
			"Protien": "3.7g",
			"Fat": "0.2g",
			"Carbohydrate": "22g",
			"Energy": "87kCal",
			"Sugar": "17.1697g",
			"VitaminC": "1.5g"
		},
		"diet_labels": ["LOW_FAT", "LOW_SATURATED_FAT", "HIGH_VITAMINC", "MODERATE_SUGAR"],
		"health_labels": ["FAT_FREE", "LOW_FAT_ABS", "KIDNEY_FRIENDLY", "VEGAN", "VEGETARIAN", "PESCATARIAN", "PALEO", "DAIRY_FREE", "GLUTEN_FREE", "WHEAT_FREE", "EGG_FREE", "MILK_FREE", "PEANUT_FREE", "TREE_NUT_FREE", "SOY_FREE", "FISH_FREE", "SHELLFISH_FREE", "PORK_FREE", "RED_MEAT_FREE", "ALCOHOL_FREE", "NO_OIL_ADDED", "NO_SUGAR_ADDED", "KOSHER"]
	},
	"granola bar": {
		"Name": ["Granola Bar", "Nature Valley Oats and Honey Bar", "Nutri Bar", "Snack Bar", "Breakfast Bar"],
		"Ingredients": ["Whole Grain Oats", "Sugar", "Canola Oil", "Rice Flour", "Honey", "Salt", "Brown Sugar Syrup", "Baking Soda", "Soy", "Lecithin", "Natural Flavor"],
		"Measure": "Regular",
		"Calories": "90Cal",
		"Weight": "30g",
		"Retained Weight": "28g",
		"Nutrients": {
			"Protien": "4g",
			"Fat": "6g",
			"Carbohydrate": "30g",
			"Sodium": "1.6g",
			"Energy": "87kCal",
			"Sugar": "17.1697g",
			"VitaminC": "1.5g"
		},
		"diet_labels": ["LOW_FAT", "LOW_SATURATED_FAT", "HIGH_VITAMINC", "MODERATE_SUGAR"],
		"health_labels": ["VEGAN", "VEGETARIAN", "PESCATARIAN", "PALEO", "DAIRY_FREE", "GLUTEN_FREE", "EGG_FREE", "SOY_FREE", "FISH_FREE", "SHELLFISH_FREE", "PORK_FREE", "RED_MEAT_FREE", "ALCOHOL_FREE", "NO_OIL_ADDED", "KOSHER"]
	},
	"big mac": {
		"Name": ["Burger", "Beef Burger", "Big Mac", "Cheese Burger"],
		"Ingredients": ["Sesame seed bun", "Beef", "American Cheese", "Lettuce", "Pickles", "Onion", "Olive oil", "Lemon juice", "Orange juice", "Paprika", "Worcestershire sauce", "Mustard", "Vinegar", "Cream", "Chili sauce", "Tomato purée", "Ketchup", "Tabasco sauce"],
		"Measure": "Regular",
		"Calories": "563Cal",
		"Weight": "219g",
		"Retained Weight": "219g",
		"Nutrients": {
			"Protien": "27g",
			"Fat": "35g",
			"Carbohydrate": "44g",
			"Energy": "563Cal",
			"Cholestrol": "79mg",
			"Potassium": "396mg",
			"Sodium": "1007mg"
		},
		"diet_labels": ["HIGH_FAT", "HIGH_CARBS", "LOW_VITAMIN", "HIGH_SODIUM", "HIGH_CHOLESTROL"],
		"health_labels": ["PESCATARIAN", "PALEO", "DAIRY_FREE", "GLUTEN_FREE", "WHEAT_FREE", "EGG_FREE", "MILK_FREE", "PEANUT_FREE", "TREE_NUT_FREE", "SOY_FREE", "FISH_FREE", "SHELLFISH_FREE", "PORK_FREE", "ALCOHOL_FREE", "NO_OIL_ADDED", "NO_SUGAR_ADDED", "KOSHER"]
	},
	"shrimp pasta": {
		"Name": ["Shrimp Pasta"],
		"Ingredients": ["Fettuccine", "Shrimp", "Garlic", "Parmesan Cheese", "Oregano", "Basil", "Heavy cream", "Milk", "Black pepper"],
		"Measure": "2 cups",
		"Calories": "300Cal",
		"Weight": "250g",
		"Retained Weight": "250g",
		"Nutrients": {
			"Protien": "27.6g",
			"Fat": "14.5g",
			"Carbohydrate": "17.1g",
			"Energy": "563Cal",
			"Cholestrol": "277.6mg",
			"Potassium": "248mg",
			"Sodium": "386.6mg"
		},
		"diet_labels": ["HIGH_FAT", "HIGH_CARBS", "LOW_VITAMIN", "HIGH_SODIUM", "HIGH_CHOLESTROL"],
		"health_labels": [ "PEANUT_FREE", "TREE_NUT_FREE", "SOY_FREE", "FISH_FREE", "PORK_FREE", "ALCOHOL_FREE", "NO_OIL_ADDED", "NO_SUGAR_ADDED", "KOSHER"]
	}
}
}