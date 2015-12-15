fs = require('fs');
var twit = require('twitter');
var sylMap = {};
fs.readFile('mhyph2.txt','utf8', function (err, data){
	if(err){
		console.log(err);
	}
	else{
//		console.log(data);
		buildMap(data);
		getTweets("wefreema");
		getTweets("aliaward");
	}
});

var client = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function getTweets(user){
	var params = {screen_name: user};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	if (!error) {
		for(var i = 0; i < tweets.length; i++){
			console.log(tweets[i].text);
		}	
	}
	});
	buildTweetMap(tweets);
}

function buildTweetMap(tweets){
	
}

function buildMap(data){
	var lines = data.split('\n');
	for(var i = 0; i < lines.length; i++){
		var word = lines[i].split('Ĩ');
		if(word.length <= 7){
			if(!sylMap[word.length]){
				sylMap[word.length] = {};			
			}
			sylMap[word.length][word.join('')] = true;
		}
	}
//	console.log(sylMap);
}
