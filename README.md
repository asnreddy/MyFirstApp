# pincode-search

A node.js module that both creates a MongoDB collection of INDIA postal codes and provides geo-spatial searching on them given a source zipcode and radius. Based on the Geonames database [www.geonames.org](http://www.geonames.org) which is licensed under a Creative Commons Attribution 3.0 License.


## Download Geonames Postal Codes for the INDIA
[http://download.geonames.org/export/zip/IN.zip](http://download.geonames.org/export/zip/IN.zip)

Replace any multiple tabs between fields with single tab in the IN.txt file. This would prevent data load failures.

## Configuration

I recommend creating a copy of config.js called local.config.js and adding it to your .gitignore so your MongoDB configuration settings do not get persisted in git.

## Loading Postal Codes into MongoDB from the Command-Line

Saves postal code documents in MongoDB using [geospatial indexes](http://www.mongodb.org/display/DOCS/Geospatial+Indexing).

Example (be sure to npm install the dependencies listed under "NPM Dependencies" first):

<pre><code>
java -cp mongo-java-driver-3.3.0.jar;. com.test.PinCodesUtility
</code></pre>

To rerun the load delete the collection first
<pre><code>
db.postal_codes.drop()
</code></pre>

## Querying Postal Codes by Source Zipcode and Radius

### Command-Line

This test searches for the 10 closest postal objects within a 4 mile radius of zipcode 744201:

<pre><code>
node test/test-find-query.js -c ./config.js -z 744201 -r 1
Using MongoDB settings in configuration file: ./config.js
Found: {"_id":"57dbc2c5a325c613fc7c5718","country":"IN","zipcode":"744203","city":"Long Island","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5719","country":"IN","zipcode":"744204","city":"Mayabander","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c571a","country":"IN","zipcode":"744204","city":"Weby","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c571b","country":"IN","zipcode":"744204","city":"Rampur","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c571c","country":"IN","zipcode":"744204","city":"Pudumadurai","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c571d","country":"IN","zipcode":"744204","city":"Tugapur","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5725","country":"IN","zipcode":"744209","city":"Uttara","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5726","country":"IN","zipcode":"744209","city":"Kadamtala (North And Middle Andaman)","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5753","country":"IN","zipcode":"744207","city":"Ramakrishnapur","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5754","country":"IN","zipcode":"744207","city":"Netajinagar","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5755","country":"IN","zipcode":"744207","city":"Vivekandapur","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5756","country":"IN","zipcode":"744207","city":"Hut  Bay","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.8794,12.6435]}
Found: {"_id":"57dbc2c5a325c613fc7c5708","country":"IN","zipcode":"744201","city":"Nimbudera","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.9,12.7167]}
Found: {"_id":"57dbc2c5a325c613fc7c5709","country":"IN","zipcode":"744201","city":"Betapur","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.9,12.7167]}
Found: {"_id":"57dbc2c5a325c613fc7c570a","country":"IN","zipcode":"744201","city":"Pitchernalla","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.9,12.7167]}
Found: {"_id":"57dbc2c5a325c613fc7c570b","country":"IN","zipcode":"744201","city":"Swdeshnagar","state_long":"Andaman & Nicobar Islands","state_short":"01","loc":[92.9,12.7167]}
Found 16 postals
</code></pre>

### Node.js API
start server using

<pre><code>
node server
</code></pre>

Access the REST API using the following syntax
http://localhost:5000/pinsearch/:zipcode/:radius

Note: radius is in meters

<pre><code>
examples:
http://localhost:5000/pinsearch/500032
http://localhost:5000/pinsearch/500032/1000
</code></pre>


UI Access:
<pre><code>
http://localhost:5000/index.html
</code></pre>

## NPM Dependencies
* express
* mongoskin

