$(document).ready( function() {
	console.log("ready to go");
	$('.musicStyleForm').submit( function(event){
		event.preventDefault();
		// zero out results if previous search has run
		$('.respArtist').html('check');
		$('.respSong').html('????');
		// get the value of the tags the user submitted
		var tags = "genre:"+$(this).find("input[id='styleEnter']").val();
		console.log(tags);
		getUnanswered(tags);
		songPlayer("#audioTest");
	
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .ajaxResponse').clone();
	
	// Set the Song Data
	var songElem = result.find('.respSong');
	console.log(question.name);
	songElem.text(question.name);

	// Set the Artist Info
	var artistElem = result.find('.respArtist');
	console.log(question.artists[0].name);
	artistElem.text(question.artists[0].name);

	// Set the album Info
	var imgElem = result.find('.respImg');
	console.log(question.album.images[0].url);
	imgElem.attr("src",question.album.images[0].url);

	//set the audio player
	console.log(question.preview_url);
	result.append('<audio id="audioTest" controls preload="auto" autobuffer autoplay src="' + question.preview_url + '"></audio>');		
	musicTag="#audioTest";
    console.log(musicTag);
    
	return result;
};

var artistObj = function(question) {
	
	// Built a object (dictionary per artist
	var mySongHits=new Object();
	mySongHits.song=question.name;
	mySongHits.artist=question.artists[0].name;
	mySongHits.albumImg=question.album.images[1].url;
	mySongHits.preview=question.preview_url;
	mySongHits.popularity=question.popularity;
	console.log(mySongHits);

	//Update the artist dictionary 
	songList.push(mySongHits);
	
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {q: tags,
								type: 'track',
								year: '1998-2000',
								limit: '5',
								market:'BO'};
	
	var result = $.ajax({
		url: "http://api.spotify.com/v1/search",
		data: request,
		dataType: "JSON",
		type: "GET",
		})
	.done(function(result){
		/*
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		*/
		console.log(result);
		$.each(result.tracks.items, function(i, item) {
			//var question = showQuestion(item);
			//console.log(item);
			//$('.results').append(question);
			artistObj(item);
		});
		console.log("the object list is :");
		console.log(songList);
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

function songPlayer (tag) {
	console.log(tag+" was played");
	$(tag).volume = 0.5;
	$(tag).triggger('play');
	$(tag).play();
}

var songList=[];




