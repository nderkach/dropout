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

    // FIXME: TMP
    var videos = {
"http://a1186.phobos.apple.com/us/r30/CobaltPublic/v4/0f/50/70/0f5070a5-fde2-3c8c-284f-4359653c3a7d/314-4479340777203542856-19_iOS_Ipad_Final_720p800cc3.mp4": {"title": "1. Mog2hhhhhhhh hhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhh hhhhhhhhh011)", "album": "Cool album", "duration": "100", "artist": "Bob Dylan"},
"http://a584.phobos.apple.com/us/r30/CobaltPublic6/v4/84/91/59/84915956-acae-c94e-865a-18afb74bb030/0c9c45a4b8a1e40d390e38b99bc855f43342b2b196a85ae380c7ddf43dcf921f-11761366205.m4v": {"title": "1. Modal View Controller/Test/Animation/Timer (Novem 15, 2011)", "album": "Cool album", "duration": "100", "artist": "Bob Dylan"},
"http://a1020.phobos.apple.com/us/r30/CobaltPublic/v4/c9/7a/55/c97a5560-1922-e0a7-ffd7-f70b69e82184/209-536103855-ios_11_nf3.mp4": {"title": "1. Modal View Controller/Test/Animation/Timer (Novem 15, 2011)", "album": "Cool album", "duration": "100", "artist": "Bob Dylan"},
"http://a1906.phobos.apple.com/us/r30/CobaltPublic4/v4/f2/2a/a7/f22aa700-e671-7344-d61b-3998d002f70e/330-9163309826435989101-safari_browser.mp4": {"title": "1. Modal View Controller/Test/Animation/Timer (Novem 15, 2011)", "album": "Cool album", "duration": "100", "artist": "Bob Dylan"},
"http://a1969.phobos.apple.com/us/r30/CobaltPublic/v4/2a/55/c7/2a55c746-54ad-132d-bbbb-999c6f6934bb/304-4834227421138469543-11_2_12_13_Tues_720p1000cc.mp4": {"title": "1. Modal View Controller/Test/Animation/Timer (Novem 15, 2011)", "album": "Cool album", "duration": "100", "artist": "Bob Dylan"}
    };
    // res.render('search', {'result' : videos});
});

module.exports = router;
