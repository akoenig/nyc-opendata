/*
 * NYC OpenData - API wrapper
 *
 * A wrapper around the official NYC OpenData API which provides
 * a simplification and caching.
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2012, André König (andre.koenig -[at]- gmail [*dot*] com)
 *
 */

var app,
    express = require('express'),
    http = require('http'),
    path = require('path');

app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

require('./app/')(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log("nycopendata server listening on port " + app.get('port'));
});