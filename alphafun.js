/*constants*/
var width = 400;
var height = 400;
var ls = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var cs = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
var color, hue = [
    [255,   0,   0 ], // 0, Red,       0°
    [255, 255,   0 ], // 1, Yellow,   60°
    [  0, 255,   0 ], // 2, Green,   120°
    [  0, 255, 255 ], // 3, Cyan,    180°
    [  0,   0, 255 ], // 4, Blue,    240°
    [255,   0, 255 ], // 5, Magenta, 300°
    [255,   0,   0]] // 6, Red,     360°

var highscore;
var game;

function Game() {
	this.gamescore = 0;
	this.gamemissed = 0;	
	this.levelno = 1;
	this.maxgoes = 10;
	this.leveltotal = 5;
	this.movedis = 4;
	//this.level;
	//var self = this;
	
	this.startnextlevel = function() {
		document.getElementById("levelno").innerHTML = this.levelno;
		//this.level = new Level(new Letters(this.levelno++));	
		this.level = new Level(this,new Letters(this.levelno++));
		this.level.start();
	}
	
	
	this.levelsdone = function()  {
		return this.levelno > this.leveltotal;
	}
	
}



function Level(game, letters) {
	this.lives = 3;
	this.missed = 0;
	this.speed = 30;
	this.score = 0;
	this.active = 0;
	this.letters = letters;
	this.score_incr = 10;
	this.timeout;
	//this.x = 0;
	//this.y = 75;
	//this.coordsls = [new coords1(), new coords2(), new coords3(), new coords4()];
	//document.getElementById("test").innerHTML = game.movthisedis;
	//document.getElementById("test2").innerHTML = this.movedis;
	this.coordsls = [new coords(0,0,game.movedis,game.movedis,function() {return this.y >= height-25;}), 
				 new coords(width,0,-game.movedis,game.movedis,function() {return this.y >= height-25;}), 
				 new coords(0,height,game.movedis,-game.movedis,function() {return this.y <= 25;}), 
				 new coords(width,height,-game.movedis,-game.movedis,function() {return this.y <= 25;})]
	//this.coords = this.coordsls[0];
	this.font = 'bold 120px sans-serif';
	this.go = 0;	
	
	this.resetxy = function()  {
		this.coords = this.coordsls[getRandonNumber(4)];
		this.coords.reset();
	}	
	
	this.incrementxy = function() {
		this.coords.increment();
	}
	
	this.increasespeed = function () {
		if (this.speed >= 1)
		{
			this.speed = this.speed - 3;
			//document.getElementById("speed").innerHTML = this.speed;
		}
	}
	
	this.gotcorrect = function () {
		this.score += this.score_incr*this.letters.currlettercount;
		game.gamescore += this.score_incr*this.letters.currlettercount;
		this.go++;
		this.updatescore();	
		
		if (this.go >= game.maxgoes)
			this.end();
		else
		{			
			this.increasespeed();
			this.letters.updateletter();
			this.resetxy();
		}
	}
	
	this.keypressed = function (keycode) {
		if(this.letters.keypressed(keycode))
			this.gotcorrect();
	}
	
	this.gotwrong = function () {
		//this.lives--;
		this.missed++;
		game.gamemissed++;
		this.go++;
		this.updatescore();	
		
		if (this.go >= game.maxgoes)
			this.end();
		else
		{
		
			
		//if (this.lives <= 0) {
		//	this.end();
		//}
		//else {
			this.letters.updateletter();
			this.resetxy();
		//}			
		}
	}
	
	this.updatescore = function () {
		document.getElementById("levelmissed").innerHTML = this.missed;
		document.getElementById("levelscore").innerHTML = this.score;
		document.getElementById("gamescore").innerHTML = game.gamescore;
		document.getElementById("gamemissed").innerHTML = game.gamemissed;		
	}
	
	this.start = function () {
		//this.letters = letters;
		this.active = 1;
		this.updatescore();
		this.letters.updateletter();
		this.resetxy();
		//document.getElementById("test").innerHTML = this.coords.x;
		this.play();
	}
	
	this.end = function () {
		//gamescore += this.score;
		clearTimeout(this.timeout);
		this.active = 0;
		canvastext();			
	}
}

function play() {
	
	if (this.active == 0)
		return;

	//with (this) {
		//document.getElementById("dt").innerHTML = new Date();
		var canvas = document.getElementById('canvas');
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0,0,width,height); // clear canvas
			ctx.beginPath();	
			
			///ctx.font  = this.font;			
			ctx.font = 'bold 60px sans-serif';
			//ctx.font-size = 120px;
			//ctx.font-weight = bold;
			var gradient = ctx.createLinearGradient(0, 0, width, height);
			
			  // Add the color stops.
			  for (var i = 0; i <= 6; i++) {
			    color = 'rgb(' + hue[i][0] + ', ' + hue[i][1] + ', ' + hue[i][2] + ')';
			    gradient.addColorStop(i * 1/27, color);
				//gradient.addColorStop(i * 1/13, color);
			    gradient.addColorStop((i+7) * 1/27, color);
				  gradient.addColorStop((i+14) * 1/27, color);
				  gradient.addColorStop((i+21) * 1/27, color);
			  }		
			  			
			// Assign our gradient to the fillStyle
			ctx.fillStyle = gradient;
			  
			  
			  
			//ctx.fillText(ls[this.letters.letters[0]], this.x, this.y);
			  document.getElementById("test").innerHTML = this.coords.xstart;
			  ctx.fillText(this.letters.concatenate(), this.coords.x, this.coords.y);
			  //ctx.fillText(this.letters.concatenate(), 50, 50);
			ctx.closePath();                                
			ctx.stroke();
			
			if (this.coords.gone()) {
				this.gotwrong();
			}
			else {
				this.incrementxy();
			}
			
			
		}
		
		if (this.active == 1) {
				//use closure to recursively call play so it can reference Level fields
				var gthis = this
				timeout=setTimeout(function(){ gthis.play();}, this.speed);
		}
	//}
}
Level.prototype.play = play;

function coords(xstart, ystart, xmove, ymove, gone) {
	this.xstart = xstart;
	this.ystart = ystart;
	this.xmove = xmove;
	this.ymove = ymove;
	//this.ylimit = ylimit;
	this.gone = gone;
	//this.x = xstart;
	//this.y = ystart;	
	//this.x = 200;
	
	//document.getElementById("test2").innerHTML = this.xstart;
	
	this.increment = function() {
		this.x += this.xmove;
		this.y += this.ymove;
	}
	
	this.reset = function() {
		this.x = this.xstart;
		this.y = this.ystart;
		
		//document.getElementById("test2").innerHTML = this.xmove;
	}
	
	this.reset();
}

function init() {
	initHighScoreFromCookie();
	$(document).keydown(listen);	
	canvastext();
	//document.getElementById("leveltotal").innerHTML = game.leveltotal;
	//updateScore();
}

function listen(event) {			
	
	if (game == null || game.level.active == 0) {		
		if (game == null || game.levelsdone())
		{
			game = new Game();		
			document.getElementById("leveltotal").innerHTML = game.leveltotal;
		}
		
		if (event.keyCode == 13) {
			game.startnextlevel();
		}
	}
	else	
		game.level.keypressed(event.keyCode);
	
	event.preventDefault();			
}


function Letters(noofletters) {
	this.letters = new Array(noofletters);
	this.letterscorrect = 0;	
	
	this.updateletter = function () {
		//document.getElementById("letter2").innerHTML = this.letters.length;
		//this.letters[0] = getRandonNumber(26);
		this.currlettercount = getRandonNumber(this.letters.length)+1;
		for (i=0; i<this.currlettercount; i++)
			this.letters[i] = getRandonNumber(26);
		
		this.letterscorrect = 0;		
	}
	
	this.concatenate = function() {
		//return ls[this.letters[0]];
		var r = "";
		for (i=0; i<this.currlettercount; i++)
			r += ls[this.letters[i]];
		//document.getElementById("letter2").innerHTML = r;
		return r;
	}
	
	this.keypressed = function(keycode) {
		if (keycode == cs[this.letters[this.letterscorrect]])
			this.letterscorrect++;
		
		return this.currlettercount == this.letterscorrect;
		//if (this.letters.length == this.letterscorrect)
		//	return true;
		//else
		//	return false;
	}
}


function getRandonNumber(upper) {
	return Math.floor(Math.random()*upper);
}

function canvastext() {
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		
		var ctx = canvas.getContext('2d');
			
		
		ctx.clearRect(0,0,width,height); // clear canvas

		ctx.beginPath();	
				
		ctx.font  = 'bold 20px sans-serif';
		ctx.fillStyle = "blue";
		if (game == null)
			ctx.fillText("Press return to start game", 5, 125);
		else if (game.levelno > game.leveltotal)
		{
			setCookie();
			ctx.fillText("Levels complete", 5, 125);
			ctx.fillText("Thank you for playing", 7, 145);
			ctx.fillText("Press return for new game...", 9, 165);
		}
		else			
			ctx.fillText("Press return for level " + game.levelno, 5, 125);
	}
}


function highScore(score, missed){
	this.score = score;
	this.missed = missed;
}

function setCookie(){	
	if (game.gamescore > highscore.score) {
		highscore.score = game.gamescore;
		highscore.missed = game.gamemissed;
	}
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 365);
	document.cookie = "score=" + highscore.score + "#missed=" + highscore.missed + "; expires=" + exdate.toUTCString();		
	document.getElementById("highscore").innerHTML = highscore.score;
	document.getElementById("highmissed").innerHTML = highscore.missed;
}

function initHighScoreFromCookie(){	
	try{
		var cookie = document.cookie.split("#");
		var score = cookie[0].split("=")[1];
		var missed = cookie[1].split("=")[1];
		if (parseInt(score) && parseInt(missed)){
			highscore = new highScore(score, missed);
		}
	}
	catch(er){
	}
	if (highscore == null)
		highscore = new highScore(0, 0);
	
	document.getElementById("highscore").innerHTML = highscore.score;
	document.getElementById("highmissed").innerHTML = highscore.missed;
}