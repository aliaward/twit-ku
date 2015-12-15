fs = require('fs');
var twit = require('twitter');
var sylMap = {};
fs.readFile('mhyph2.txt','utf8', function (err, data){
	if(err){
		console.log(err);
	}
	else{
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
		var wordArray = [];
		if (!error) {
			for(var i = 0; i < tweets.length; i++){
				wordArray.push.apply(wordArray, tweets[i].text.split(' '));
			}	
		}
		buildHaiku(wordArray);
	});
}

function buildHaiku(wordArray){
	var haiku = '';
	haiku += buildLine(5, wordArray);
	haiku += '\n';
	haiku += buildLine(7, wordArray);
	haiku += '\n';
	haiku += buildLine(5, wordArray);
	haiku += '\n';
	console.log(haiku);
}

function buildLine(size, words){
	var currentSize = 0;
	var word = '';
	var line = [];
	while(currentSize < size){
		word = words[randomInt(0, words.length-1)];
		for(var i = 1; i <= size-currentSize; i++){
			if(sylMap[i][word.toLowerCase()]){
				currentSize += i;
				line.push(word);
			}
		}
	} 
	return line.join(' ');
}
	
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function buildMap(data){
	var lines = data.split('\n');
	for(var i = 0; i < lines.length; i++){
		var word = lines[i].split('Ĩ');
		if(word.length <= 7){
			if(!sylMap[word.length]){
				sylMap[word.length] = {};			
			}
			sylMap[word.length][word.join('').toLowerCase()] = true;
		}
	}
}
