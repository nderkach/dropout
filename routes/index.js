var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');
var util = require('util')
var http = require('http');

var search_url = 'http://ax.search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?submit=media&restrict=true&term=%s&media=iTunesU'

router.get('/', function(req, res, next) {
	res.render('index', {});
});

router.get('/results', function(req, res, next) {

	var options = {
		url: util.format(search_url, req.query.q),
		headers: {
			'User-Agent': 'iTunes/12.0.1 (Macintosh; OS X 10.10.1) AppleWebKit/0600.1.25'
		}
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			var videos = {};
			$('.podcast-episode.video').each(function(index) {
				videos[ $(this).attr('video-preview-url') ] = {
                    'title': $(this).attr('preview-title'),
                    'album': $(this).attr('preview-album'),
                    'duration': $(this).attr('duration'),
                    'artist': $(this).attr('preview-artist')
                };
			});
			res.render('search', {'result' : videos});
			// res.json(videos);
		}
	}

	request(options, callback);
});

router.get('/search', function(req, res, next) {

  var params = req.query.q;

  res.app.render('index', {}, function(err, html) {
    var html = html;
    request('http://localhost:'+res.app.get('port')+'/results?q='+params, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var env = require('jsdom').env
          env(html, function (errors, window) {
            var $ = require('jquery')(window);
            $('#search-field').attr("value", params);
            $("#search-results").append(body);
            res.send($("html").html());
          });
        }
    });
  });
});

module.exports = router;
