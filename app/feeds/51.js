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

 // Oil Boilers - Detailed Fuel Consumption and Building Data
 // 
 // Detailed data on NYC buildings with oil boilers, including fuel consumption,
 // BBL, building owner/management info, deadline for complying with Audit and
 // Retrocommissioning Law, building type and year constructed, number of floors
 // and residential units, Condo/Coop status, and more.

var caches   = require('memory-cache'),
    Deferred = require('Deferred'),
    request  = require('request');

module.exports = function () {
    "use strict";

    var url = 'http://data.cityofnewyork.us/api/views/jfzu-yy6n/rows.json',
        cacheIds = {
            all: 'feed51all',
            betaville: 'feed51betaville'
        };

    return {
        load: {
            forBetaville : function () {
                var cacheId = cacheIds.betaville,
                    deferred = Deferred(),
                    opendata = caches.get(cacheId);

                if (!opendata) {
                    request(url, function (error, response, body) {
                        var i = 0,
                            facility = {},
                            entry,
                            details;

                        if (!error && response.statusCode == 200) {
                            opendata = [];

                            body = JSON.parse(body);

                            for (var i = 0; i < body.data.length; i++) {
                                facility = {};

                                entry = body.data[i];
                                details = JSON.parse(entry[9][0]);

                                facility.id = entry[8];

                                if (details) {
                                    facility.address = details.address;
                                    facility.city = details.city;
                                    facility.state = details.state;
                                    facility.zip = details.zip;
                                }

                                facility.lat = entry[9][1];
                                facility.lng = entry[9][2];

                                facility.numberSixOil = (entry[24] === '#6');
                                facility.multiFuel = (entry[21] === 'DUAL FUEL');
                                facility.boilerCapacity = entry[18];

                                opendata.push(facility);
                            }

                            // Add to cache.
                            caches.put(cacheId, opendata, 86400000); // Cache timeout: 1 day - TODO: Move to config file.

                            deferred.resolve(opendata);
                        }
                    });
                } else {
                    deferred.resolve(opendata);
                }

                return deferred.promise();
            },

            forAll : function () {
                var cacheId = cacheIds.all,
                    deferred = Deferred(),
                    opendata = caches.get(cacheId);

                if (!opendata) {
                    request(url, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            opendata = JSON.parse(body);

                            // Add to cache.
                            caches.put(cacheId, opendata, 86400000); // Cache timeout: 1 day - TODO: Move to config file.

                            deferred.resolve(opendata);
                        }
                    });
                } else {
                    deferred.resolve(opendata);
                }

                return deferred.promise();
            }
        }
    };
 };