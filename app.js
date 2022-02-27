const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const port = 80;
var util = require('util')
const axios = require('axios');
const qs = require('qs')


//Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use( '/css', express.static(__dirname + 'public/css') );
app.use( '/img', express.static(__dirname + 'public/img') );
app.use( '/js', express.static(__dirname + 'public/js') );

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('home', { title :'Home page - welcome!'})
});

app.get('/about', (req, res) => {
    res.render('about', { title :'About us info'})
});

app.get('/search/container/:containerId', (req, res) => {

    try {
        validate('container', req.params.containerId);

        axios.get('http://test-api.marvilix.com/container/' + req.params.containerId )
            .then((response) => {
                callbackSuccess(response.data, res);
            }).catch((err) => {
                callbackError(err.message, res);
            });
    } catch(err){
        callbackError(err.message, res);
    }
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/send-sms', (req, res) => {

	try {
        validate('container', req.body.containerID);
        validate('phone-number', req.body.number);

		axios({
		  method: 'post',
		  url: 'http://test-api.marvilix.com/container/' + req.body.containerID + '/sms',
		  data: qs.stringify({
			PhoneNumber: req.body.number
		  }),
		  headers: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		  }
		}).then((response) => {
			response.data.message = "Your phone number was successfully registered";
			callbackSuccess(response.data, res);
		}).catch((err) => {
			callbackError(err.message, res);
		});
		
	} catch(err){
		callbackError(err.message, res);
	}
	
});
app.listen(port, () => console.info(`Listening on a port ${port}`));

function callbackSuccess(response, res) {
    res.status(200).end(JSON.stringify(response));
}

function callbackError(e, res) {
	var response = {
				"code": -1,
				"errorMessage": e,
				"data": ""
			};
	process.stdout.write(e);
    res.status(401).end(JSON.stringify(response));
}

function validate(field, value) {
    console.log(field, value);
	switch(field) {
        case 'container':
            if(!value || value.length<7 || !value.match(/^[a-z0-9]+$/i)) {
                console.log('Incorrect container ID');
                throw new Error('Incorrect container ID');
            }
            break;
        case 'phone-number':
            if(!value || value.length!=10 || !value.match(/^\d+$/)) {
                console.log('Phone number must be 10 digits');
                throw new Error('Phone number must be 10 digits');
            }
            break;
	}
	return true;
}