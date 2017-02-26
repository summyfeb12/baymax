var express = require('express');
var fs = require('fs');
var url = require('url');

var endpoints = require('./endpoints.js');

var dbconnect = require('./dbconnect.js');

var app = express();

var myHealthConditions = JSON.stringify({
                "Problems": [
                    {
                        "FreeText": "Milk Allergy",
                    },
                    {
                        "FreeText": "High Cholestrol",
                    }
                ]
        });

app.get('/checkfood', function(req, res){
    
    myHealth = endpoints.getMedicalTerminology(myHealthConditions);
    
    var queryObject = url.parse(req.url,true).query;
    var userQuery = ((queryObject['userQuery']).trim()).toUpperCase();
    
    if(userQuery.startsWith("CAN I")){
        var foodDescription = userQuery.substring(userQuery.indexOf("eat") + 4);
        foodDescription = foodDescription.trim().toUpperCase();
        foodDescription = (foodDescription.substring(foodDescription.lastIndexOf(" "))).trim();
        answer = "";
        if(foodDescription=="APPLE"){
            answer = "Yes, you can have any apple. Apple is a low-fat and low-sodium food. It is good for your health.";
        }
        else if(foodDescription=="ORANGE"){
            answer = "Yes, you can have any orange. Orange is high on Vitamin C is a low-sodium food. It is good for your health.";
        }
        else if(foodDescription=="MAC"){
            answer = "I recommend you not to have it. 1 Big Mac has 563 calories and has high-fat, high-cholestrol and high sodium. Definitely not got food you since you have High Cholestrol.";
        }
        else if(foodDescription=="PIZZA"){
            answer = "I would definitely not go for that if I were you. You are lactose intolerant and Pizza has cheese. Lot of cheese!";
        }
        else if(foodDescription=="MAC"){
            answer = "I recommend you not to have it. 1 Big Mac has 563 calories and has high-fat, high-cholestrol and high sodium. Definitely not got food you since you have High Cholestrol.";
        }
        else if(foodDescription=="COFFEE"){
            answer = "Yes. You can have 1 cup of coffee. But, you have already had 2 cups since the early morning. You are nearing the maximum Caffeine level for the day.";
        }
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.write(answer);
        res.end();
    }
    else if(userQuery.startsWith("I HAD") || userQuery.startsWith("I ATE")){   
        var foodDescription = userQuery.trim().toUpperCase();
        foodDescription = (foodDescription.substring(foodDescription.lastIndexOf(" "))).trim();
        dbconnect.updateDB(foodDescription);
        answer = "OK. Your records have been updated.";
        
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.write(answer);
        res.end();
    }          
    //console.log(JSON.parse(medTerminology));
    
    //nutritionInfo = myendpoints.getNutritionInfo("apple"); 

});

app.listen('3000');
