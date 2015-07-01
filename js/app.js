

// This will process the AJAX request and connect to spotify open API (this is without access to personal info hence no need to do login)
var getSongListObject = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {q: tags,
								type: 'track',
								year: '1998-2000',
								limit: '50',
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
		songList=[];
		$.each(result.tracks.items, function(i, item) {
			//var question = showQuestion(item);
			//console.log(item);
			//$('.results').append(question);
			artistObj(item);
			
		});
		console.log("the object list is :");
		console.log(songList);
		//putting game creation within Ajax object so that this is triggered only after objects are loaded
		createAllGames();
		displayGame(0);

	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

//This will build a Song object for every result of the AJAX query
var artistObj = function(question) {
	// Built a object (dictionary per artist
	var mySongHits=new Object();
	mySongHits.song=question.name;
	mySongHits.artist=question.artists[0].name;
	mySongHits.albumImgBig=question.album.images[0].url;
	mySongHits.albumImg=question.album.images[1].url;
	mySongHits.preview=question.preview_url;
	mySongHits.popularity=question.popularity;

	//Update the artist dictionary 
	songList.push(mySongHits);
};

var createAllGames = function() {
	if (songList.length>5 )
		{	
			//First round of iteration for each game that will be played
			gamesList=[];
			for (gameNum = 1; gameNum < 6; gameNum++) {
				gameList=[];
				console.log("Currently Playing game : " + gameNum + " ");
				//second round of iteration for the total of song alternative in each game
				for (songNum=1;songNum<6;songNum++) {
					createGame();
				}
				for (songNum=0;songNum<5;songNum++) {
					obj=gameList[songNum][0];
					gameList[songNum]=obj;
				}
				gamesList.push(gameList);
				
			}
			console.log("List of artists that will not be gamed");
			console.log(songList);
			console.log("List of the games that will be played");
			console.log(gamesList);


		} else {
			 alert("Not enough results to continue playing");
		}

}

var createGame=function() {
	selectedSongNumber=Math.floor((Math.random() * songList.length) + 1);
	selectedSongObject=songList.splice(selectedSongNumber-1,1);
	gameList.push(selectedSongObject);
}

var displayGame=function(gameNumber) {
	$("#optionsSection").find('.row').remove();
	$(".displaySection").find('audio').remove();
	selectedSongNumber=Math.floor((Math.random() * 5) );
	$('.displaySection').append('<div class="row"><div class="col-xs-offset-2 col-xs-8 col-md-offset-2 col-md-8 text-center"><audio  autoplay = "autoplay" id="'+gamesList[gameNumber][selectedSongNumber].song+'" controls="" src="' + gamesList[gameNumber][selectedSongNumber].preview + '"></audio></div></div>');		
	console.log("correct song will be ="+ selectedSongNumber);
	for(var i = 0; i < gamesList[gameNumber].length; i++)
	{
		bstatus="INCORRECT";
		console.log("the letter i is "+i);
		console.log("the secret number is "+selectedSongNumber);
        if (i==selectedSongNumber)
        	{bstatus="CORRECT"; 
       		console.log(bstatus) ;}
        else 
        	{bstatus="INCORRECT"; 
        	console.log(bstatus) ;}

        $('#optionsSection')
        .prepend('<div class="row"><div class="btn-group btn-group-justified" role="group" aria-label="Justified button group" id=""><a href="#" class="btn btn-lg btn-danger '+bstatus+'" role="button">' + gamesList[gameNumber][i].song +" / "+gamesList[gameNumber][i].artist + '</a></div></div>');		
    };
    //set the rewards in place
    console.log("DEBUG the image link assigned is: "+gamesList[gameNumber][selectedSongNumber].albumImg)
	$('#bandPic').attr('src',''+gamesList[gameNumber][selectedSongNumber].albumImgBig+'');
	$('#albumPic').attr('src',''+gamesList[gameNumber][selectedSongNumber].albumImg+'');
	$('#correctSongID').text(gamesList[gameNumber][selectedSongNumber].song);
	$('#correctArtistID').text(gamesList[gameNumber][selectedSongNumber].artist);

	//display the choices
	$(".choicesSection").toggle();


}

var displayReward=function() {
	$("#messageBox2").text("CORRECTOUU");
	$("#prizeMessage").text("You have won a new record for your collection!!");
	$(".choicesSection").toggle();
	$(".displaySection").toggle();
	$(".buttonSection").toggle();
	$(".resultSection").fadeIn(3000);
}

var displayMistake=function(){
	$("#messageBox2").text("NOPE!! : Here is a tip for next time");
	$("#prizeMessage").text("Missed the record ");
	$(".choicesSection").toggle();
	$(".displaySection").toggle();
	$(".buttonSection").toggle();
	$(".resultSection").fadeIn(3000);
}

var displayNext=function(){
	$(".resultSection").toggle();
	$(".displaySection").toggle();
	$(".buttonSection").toggle();
}
function songPlayer (tag) {
	console.log(tag+" was played");
	$(tag).volume = 0.5;
	$(tag).triggger('play');
	$(tag).play();
}

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

$(document).ready( function() {
	console.log("ready to go");
	//Instructions Listener
	$('#instructionsbutton')
		.click(function(){
	    	$("#MJinstructions").toggle();})
	// MODE Listener
	$('#modeButton')
		.click(function(){
    		$(".styleSelectSection").toggle();})
	//Play button Listener	
	$('#playButton')
		.click( function(event){
			event.preventDefault();
			//set default settings
			$(".choicesSection").css("display", "none");
			// zero out results if previous search has run
			//$('.respArtist').html('check');
			//$('.respSong').html('????');
			
			// get the value of the tags the user submitted
			var tags = "genre:"+$(".musicStyleForm").find("input[id='styleEnter']").val();
			console.log(tags);
			getSongListObject(tags);
			
			//songPlayer("#audioTest");
	
	});

	//WrongAnswer Listener
	$(".choicesSection").on("click", ".INCORRECT", function () {
	    console.log("the answer is incorrect.  ");
	    //run noReward Program
	    event.preventDefault();
    	displayMistake();
	    });
	//CorrectAnswer Listener
	$(".choicesSection").on("click", ".CORRECT", function () {
	    console.log("the answer is correct.  ");
	    //run noReward Program
	    event.preventDefault();
    	displayReward();
	    });

	//Next Listener
	$(".resultSection").on("click", "#nxtBtn", function () {
	    console.log("Continue to next question.  ");
	    //run noReward Program
	    event.preventDefault();
    	displayNext();
	    });

});

//listing Global Variables
var songList=[];
var gameList=[];
var gamesList=[];



