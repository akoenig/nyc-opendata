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

 // Map of Electricity Consumption by ZIP Code - 2010
 // 
 // 2010 electricity consumption in kWh and GJ, by ZIP code, building type, and utility company.

var caches   = require('memory-cache'),
    Deferred = require('Deferred'),
    request  = require('request'),
    underscore = require('underscore');

module.exports = function () {
    "use strict";

    var url = 'http://data.cityofnewyork.us/api/views/dhry-6nsv/rows.json',
        cacheIds = {
            all: 'feed53all',
            betaville: 'feed53betaville'
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
                            rawEntry,
                            rawDetails,
                            consumptionEntry;
                        
                        body = JSON.parse(body);

                        if (!error && response.statusCode === 200) {
                            opendata = [];

                            for (i = 0; i < body.data.length; i++) {
                                rawEntry = body.data[i];

                                if (rawEntry[8]) {
                                    rawDetails = JSON.parse(rawEntry[8][0]);

                                    if (rawDetails) {
                                        consumptionEntry = underscore.find(opendata, function (consumption) {
                                            return (consumption.zip === rawDetails.zip);
                                        });

                                        if (!consumptionEntry) {
                                            consumptionEntry = {};
                                            consumptionEntry.zip = rawDetails.zip;
                                            consumptionEntry.lat = rawEntry[8][1];
                                            consumptionEntry.lng = rawEntry[8][2];
                                        }

                                        switch (rawEntry[9]) {
                                            case 'Commercial':
                                                consumptionEntry.commercial = rawEntry[10] / 1000;
                                            break;

                                            case 'Industrial':
                                                consumptionEntry.industrial = rawEntry[10] / 1000;
                                            break;

                                            case 'Institutional':
                                                consumptionEntry.institutional = rawEntry[10] / 1000;
                                            break;

                                            case 'Large Residential':
                                                if (!consumptionEntry.residential) {
                                                    consumptionEntry.residential = 0;
                                                }

                                                consumptionEntry.residential += (rawEntry[10] / 1000);
                                            break;

                                            case 'Small Residential':
                                                if (!consumptionEntry.residential) {
                                                    consumptionEntry.residential = 0;
                                                }

                                                consumptionEntry.residential += (rawEntry[10] / 1000);
                                            break;
                                        }

                                        opendata.push(consumptionEntry);
                                    }
                                }
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
                        if (!error && response.statusCode === 200) {
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