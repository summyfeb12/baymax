var base64 = require('base-64');
var urlencode = require('urlencode');
var request = require('request');

module.exports = {

    getMedicalTerminology: function(myHealthConditions){
        targetUrl = 'https://ipl-nonproduction-customer_validation.e-imo.com/api/v3/actions/categorize';

        var options = {
            url: targetUrl,
            'Content-Type': 'application/json',
            headers: {
                'Authorization':'Basic ' + base64.encode('9250e76fa8da4f42b9061d4b69f887f9' + ':' +  'AF9AC67D32F8BF7609EDAEF56EF3F82DFF7630214CCB824215DBA17F413E4425'),
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body: myHealthConditions
        };
        request.post(options, function(error, response){
            //console.log('Hey I\'m here');
            if(!error && response.statusCode === 200) {
                 return response;
               }
            else {console.log(response);}
        });
    },
    checkIfCanEat: function(x, y, z){
        console.log(x + " " + y + " " + z);
    }

};