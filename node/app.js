var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const express = require('express');
var path = require('path');
const app = express();
const port = 80;
app.use(express.static(path.join(__dirname, 'public')));
app.use( '/css', express.static(__dirname + 'public/css') );

app.get('', (req, res) => {
    //res.sendFile(__dirname + '/tmpl/home.tmpl')
    //res.sendFile( 'c:/app/node/pionet/tmpl/home.tmpl')
    res.send( __dirname + '/tmpl/home.tmpl')
});

app.listen(port, () => console.info('Listening on a port ${port}'));