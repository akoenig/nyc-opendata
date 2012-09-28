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

var Deferred = require('Deferred');

module.exports = function () {
    "use strict";

    return {
        consume : function () {
            var deferred = Deferred();

            

            return deferred.promise();
        }
    };
 };