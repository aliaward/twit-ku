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
		getTweets("cournteystodden");
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
		var wordMap = {};
		var wordArray = [];
		if (!error) {
			for(var i = 0; i < tweets.length; i++){
				var wordArray = tweets[i].text.replace(/[-\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');
				//set up loop for wordMap
				for(var j = 0; j<wordArray.length-1; j++){
					if(!wordMap[wordArray[j]]){
						wordMap[wordArray[j]] = {};
					}
					if(!wordMap[wordArray[j]][wordArray[j+1]]){
						wordMap[wordArray[j]][wordArray[j+1]] = 0;
					}
					wordMap[wordArray[j]][wordArray[j+1]]++;
				}
				if(!wordMap[wordArray[wordArray.length-1]]){
					wordMap[wordArray[wordArray.length-1]] = {};
				}
				if(!wordMap[wordArray[wordArray.length-1]]['.']){
					wordMap[wordArray[wordArray.length-1]]['.'] = 0;
				}
				wordMap[wordArray[wordArray.length-1]]['.']++;
				//need periods for ends of other tweets, not just last tweet.
			}	
		}
		buildHaiku(wordMap);
	});
}

function buildHaiku(wordMap){
//	console.log(wordMap);
	var haiku = '';
	haiku += buildLine(5, wordMap);
	haiku += '\n';
	haiku += buildLine(7, wordMap);
	haiku += '\n';
	haiku += buildLine(5, wordMap);
	haiku += '\n';
	console.log(haiku);
}

function buildLine(size, words){
	var currentSize = 0;
	var word = '';
	var lastWord = '';
	var line = [];
	while(currentSize < size){
//		console.log(lastWord);
		if(lastWord !== ''){
//			console.log(Object.keys(words[lastWord]).length);
//			console.log(words[lastWord]);
			word = Object.keys(words[lastWord])[randomInt(0, Object.keys(words[lastWord]).length)];
//			console.log(word);
			if(word === '.' || !word){
				word = Object.keys(words)[randomInt(0, Object.keys(words).length)];
			}
		}else{
			word = Object.keys(words)[randomInt(0, Object.keys(words).length)];
		}
		var found = false;
		for(var i = 1; i <= size-currentSize; i++){
			if(sylMap[i][word.replace(/[.,]/g,"").toLowerCase()]){
				currentSize += i;
				line.push(word);
				lastWord = word;
				found = true;
				//do check for second word size
			}
		}
		if(!found){
			lastWord = '';
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
