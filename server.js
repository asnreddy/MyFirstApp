var express = require('express'),
    pinsearch = require('./lib/postal-search'),
    app = express();

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


app.get('/pinsearch/:zipcode', pinsearch.findByZip);
app.get('/pinsearch/:zipcode/:radius', pinsearch.findByZipRadius);
app.get('/pinsearch/:zipcode/:radius/:limit', pinsearch.findByZipLimit);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});