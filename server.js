'use strict';

var express = require('express'),
        app = express(),
        port = process.env.PORT || 3000;

var pub = __dirname + '/public';
   
app.configure(function(){
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(pub));
        app.use(express.errorHandler());
});

app.listen(port);