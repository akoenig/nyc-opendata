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

module.exports = function (app) {
    "use strict";

    var feeds = (function () {
        var datasources = {
            '51': require('./feeds/51')(),
            '53': require('./feeds/53')()
        };

        return {
            get : function (id) {
                return datasources[id];
            }
        };
    }());

    app.get('/feed/:id', function (req, res) {
        var id = req.params.id,
            feed = feeds.get(id),
            betaville = req.query.betaville;

        if (betaville) {
            feed.load.forBetaville()
                .done(function (result) {
                    res.json(result);
                });
        } else {
            feed.load.forAll()
                .done(function (result) {
                    res.json(result);
                });
        }
    });
};