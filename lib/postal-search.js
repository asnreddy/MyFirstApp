var Step = require('step');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.js', 'utf-8'));
var collection = initDb(config).collection(config.mongo.collection);

var processResults = function(err, postals,res) {
      if (err) {
        console.error("Failed to get postals: %s", err);
        res.send(err);
      } else {
        /*postals.forEach(function(postal) {
          console.log("Found: %s", JSON.stringify(postal));
        });*/
    	  
        console.log("ZIP search - Found %d postals", postals.length);
        res.send(postals);
      }
}
exports.findByZip = function (req, res, next) {
    var params = {
       dbCollection : collection,
       zipcode : req.params.zipcode.trim()
    };
    findPostals(params, function(err,postals){
    	processResults(err,postals,res);
    });
};

exports.findByZipRadius = function (req, res, next) {
    var params = {
      dbCollection : collection,
      zipcode : req.params.zipcode.trim(),
      radiusMiles : req.params.radius.trim()
    };
    findPostals(params, function(err,postals){
    	processResults(err,postals,res);
    });
};

exports.findByZipLimit = function (req, res, next) {
    var params = {
      dbCollection : collection,
      zipcode : req.params.zipcode.trim(),
      radiusMiles : req.params.radius.trim(),
      limit : parseInt(req.params.limit.trim())
    };
    findPostals(params, function(err,postals){
    	processResults(err,postals,res);
    });
};



/**
 * Find postal objects (objects with a postal/zipcode) within a specific radius from a zipcode, sorted in ascending order by nearest first.
 * @param params: object containing the following parameters:
 *                dbCollection - Name of a MongoDB collection object that we can query against. Required.
 *                selectorAttr - Name of the attribute in dbCollection that we can select zipcodes from. Defaults to "zipcode".
 *                zipcode - a zipcode to use as the basis of the search. Required.
 *                radiusMiles - radius in miles from the zipcode to search. Optional, uses 10 by default.
 * @callback: callback function that gets passed (err, postals) 
 *            where err is an error if encountered, or null otherwise. postals is an array of postal objects.
 */
exports.findPostals = function(params, callback) {
  findPostals(params,callback);
};

//local version
function findPostals(params, callback) {
  var paramDefaults = {
    selectorAttr : "zipcode"
  };
  if (!params || params === null) {
    throw new Error("No parameters object provided");
  }
  if (!params.dbCollection || params.dbCollection === null) {
    throw new Error("Database collection not provided");
  }
  if (!params.selectorAttr || params.selectorAttr === null) {
    params.selectorAttr = paramDefaults.selectorAttr;
  }
  if (!params.zipcode || params.zipcode === null) {
    throw new Error("Zipcode not provided");
  }
  if (!callback || callback === null) {
    throw new Error("No callback function provided");
  }
  // Extract the params:
  var dbCollection, selectorAttr, zipcode, radiusMiles, limit;  
  dbCollection = params.dbCollection;
  selectorAttr = params.selectorAttr;
  zipcode = params.zipcode;
  radiusMiles = params.radiusMiles ? parseInt(params.radiusMiles) : 10;
  limit = params.limit ? parseInt(params.limit) : 0;
  console.log('limit:'+limit+':');
  // Run the query:
  var query = {};
  query[selectorAttr] = zipcode.toString();
  Step(
    // Look up the zipcode and pass the matching document with lat/long coords to the next step:
    function zipcodeToCoords() {
      dbCollection.findOne(query, this);      
    },
    // Take the lat/long coords and search for other zipcodes nearby:
    function findNearCoords(err, postalObj) {
      if (err) throw err;
      if (!postalObj || postalObj === null) {
    	 return {};
        throw new Error("No postal object found for zipcode "+zipcode+" using document attribute "
          +selectorAttr+"; make sure postal data has been loaded.");
      }
      dbCollection.aggregate([
          { 
                "$geoNear": {
                    "near": {
                         "type": "Point",
                         "coordinates": postalObj.geometry.coordinates
                     },
                     "distanceField": "distance",
                     "maxDistance": radiusMiles,
                     "spherical": true,
                     "query": { "geometry.type": "Point" }
                 }
            },
            { 
                 "$sort": {"distance": 1} // Sort the nearest first
            } 
     ],
    // Finally invoke the user-specified callback to handle found zipcodes:
    callback
    );
    }
  );
}

/**
 * Convert the miles to radians.
 * @param miles
 * @return radians
 */
function milesToRadians(miles) {
  var EARTH_RADIUS_MILES = 3959; // miles
  return miles / EARTH_RADIUS_MILES;
}

exports.setUpIndexing = function(dbCollection) {
  console.log("Ensuring index on zipcode");
  dbCollection.ensureIndex( { zipcode: 1 } );
  console.log("Ensuring 2d geospatial index on loc");
  dbCollection.ensureIndex( { loc: "2dsphere" } );
};
function initDb(config) {
  var mongo = require('mongoskin');
  var authStr = config.mongo.auth ? (config.mongo.auth.name + ':' + config.mongo.auth.pass) + '@' : '';
  var connectStr = config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbname;
  var fullConnectStr = 'mongodb://'+authStr + connectStr + '?auto_reconnect=true';
  return mongo.db(fullConnectStr);
}
exports.initDb = function(config) {
  return initDb(config);
};