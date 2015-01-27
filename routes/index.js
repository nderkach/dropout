var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');
var util = require('util')
var http = require('http');

var search_url = 'http://ax.search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?submit=media&restrict=true&term=%s&media=iTunesU'

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {});
});

router.get('/search', function(req, res, next) {

	console.log('Search: ' + req.query.q)

	var options = {
		url: util.format(search_url, req.query.q),
		headers: {
			'User-Agent': 'iTunes/12.0.1 (Macintosh; OS X 10.10.1) AppleWebKit/0600.1.25'
		}
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
            console.log("Search finished")
			$ = cheerio.load(body);
			var videos = {};
			$('.podcast-episode.video').each(function(index) {
				videos[ $(this).attr('preview-title') ] = $(this).attr('video-preview-url');
			});
			res.render('search', {'result' : videos});
			// res.json(videos);
		}
	}

	request(options, callback);

    // FIXME: TMP
    // var videos = {"15. Modal View Controller/Test/Animation/Timer (November 15, 2011)":"http://a584.phobos.apple.com/us/r30/CobaltPublic6/v4/84/91/59/84915956-acae-c94e-865a-18afb74bb030/0c9c45a4b8a1e40d390e38b99bc855f43342b2b196a85ae380c7ddf43dcf921f-11761366205.m4v"};
    // res.render('search', {'result' : videos});
});

module.exports = router;
