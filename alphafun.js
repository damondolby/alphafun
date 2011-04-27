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

var totalscore = 0;
var totalmissed = 0;
var game;
var levelno = 1;
var maxgoes = 10;
var gametotal = 5;
var movedis = 4;

function Game(level) {
	this.lives = 3;
	this.missed = 0;
	this.speed = 30;
	this.score = 0;
	this.active = 0;
	this.level = level;
	this.score_incr = 10;
	this.timeout;
	//this.x = 0;
	//this.y = 75;
	//this.coordsls = [new coords1(), new coords2(), new coords3(), new coords4()];
	this.coordsls = [new coords(0,0,movedis,movedis,function() {return this.y >= height-25;}), 
				 new coords(width,0,-movedis,movedis,function() {return this.y >= height-25;}), 
				 new coords(0,height,movedis,-movedis,function() {return this.y <= 25;}), 
				 new coords(width,height,-movedis,-movedis,function() {return this.y <= 25;})]
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
			document.getElementById("speed").innerHTML = this.speed;
		}
	}
	
	this.gotcorrect = function () {
		this.score += this.score_incr;
		totalscore += this.score_incr;
		this.go++;
		this.updatescore();	
		
		if (this.go >= maxgoes)
			this.end();
		else
		{			
			this.increasespeed();
			this.level.updateletter();
			this.resetxy();
		}
	}
	
	this.keypressed = function (keycode) {
		if(this.level.keypressed(keycode))
			this.gotcorrect();
	}
	
	this.gotwrong = function () {
		//this.lives--;
		this.missed++;
		totalmissed++;
		this.go++;
		this.updatescore();	
		
		if (this.go >= maxgoes)
			this.end();
		else
		{
		
			
		//if (this.lives <= 0) {
		//	this.end();
		//}
		//else {
			this.level.updateletter();
			this.resetxy();
		//}			
		}
	}
	
	this.updatescore = function () {
		document.getElementById("gamemissed").innerHTML = this.missed;
		document.getElementById("gamescore").innerHTML = this.score;
		document.getElementById("totalscore").innerHTML = totalscore;
		document.getElementById("totalmissed").innerHTML = totalmissed;		
	}
	
	this.start = function () {
		this.active = 1;
		this.updatescore();
		this.level.updateletter();
		this.resetxy();
		this.play();
	}
	
	this.end = function () {
		//totalscore += this.score;
		clearTimeout(this.timeout);
		this.active = 0;
		document.getElementById("letter2").innerHTML = "end";
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
			  
			  
			  
			//ctx.fillText(ls[this.level.letters[0]], this.x, this.y);
			  ctx.fillText(this.level.concatenate(), this.coords.x, this.coords.y);
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
				//use closure to recursively call play so it can reference Game fields
				var gthis = this
				timeout=setTimeout(function(){ gthis.play();}, this.speed);
		}
	//}
}
Game.prototype.play = play;

function coords(xstart, ystart, xmove, ymove, gone) {
	this.xstart = xstart;
	this.ystart = ystart;
	this.xmove = xmove;
	this.ymove = ymove;
	//this.ylimit = ylimit;
	this.gone = gone;
	//this.x = xstart;
	//this.y = ystart;	
	
	this.increment = function() {
		this.x += this.xmove;
		this.y += this.ymove;
	}
	
	this.reset = function() {
		this.x = this.xstart;
		this.y = this.ystart;
	}
	
	//this.gone = function() {
	//	return this.y >= ylimit;
	//}
	
	this.reset();
}

/*
function coords1() {
	this.x = width;
	this.y = 0;
	this.move = 4;
	
	this.increment = function() {
		this.x -= this.move;
		this.y += this.move;
	}
	
	this.reset = function() {
		this.x = width;
		this.y = 0;
	}
	
	this.gone = function() {
		return this.y >= height - 25;
	}
}

function coords2() {
	this.x = 0;
	this.y = height;
	this.move = 4;
	
	this.increment = function() {
		this.x += this.move;
		this.y -= this.move;
	}
	
	this.reset = function() {
		this.x = 0;
		this.y = height;
	}
	
	this.gone = function() {
		return this.y <= 25;
	}
}

function coords3() {
	this.x = width;
	this.y = height;
	this.move = 4;
	
	this.increment = function() {
		this.x -= this.move;
		this.y -= this.move;
	}
	
	this.reset = function() {
		this.x = width;
		this.y = height;
	}
	
	this.gone = function() {
		return this.y <= 25;
	}
}


function coords4() {
	this.x = 0;
	this.y = 0;
	this.move = 4;
	
	this.increment = function() {
		this.x += this.move;
		this.y += this.move;
	}
	
	this.reset = function() {
		this.x = 0;
		this.y = 0;
	}
	
	this.gone = function() {
		return this.y >= height-25;
	}
}
*/

function init() {
	$(document).keydown(listen);	
	canvastext();
	document.getElementById("gametotal").innerHTML = gametotal;
	//updateScore();
}

function listen(event) {			
	
	if (game == null || game.active == 0) {
		if (levelno > gametotal) {
			totalscore = 0;
			totalmissed = 0;
			levelno = 1;
		}
		
//		if (levelno <= gametotal)	{
			if (event.keyCode == 13) {
				document.getElementById("gamecurr").innerHTML = levelno;
				game = new Game(new Level(levelno++));	
				game.start();
			}
//		}
	}
	else	{
		game.keypressed(event.keyCode);
	}
	event.preventDefault();			
}


function Level(noofletters) {
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

/*function startGame() {	
	level = new Level(1);
	game = new Game(level);	
	game.start();
}*/

function canvastext() {
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		
		var ctx = canvas.getContext('2d');
			
		
		ctx.clearRect(0,0,width,height); // clear canvas

		ctx.beginPath();	
				
		ctx.font  = 'bold 20px sans-serif';
		ctx.fillStyle = "blue";
		if (levelno > gametotal)
		{
			ctx.fillText("All games complete", 5, 125);
			ctx.fillText("Thank you for playing", 7, 145);
			ctx.fillText("Press return for new game...", 9, 165);
		}
		else			
			ctx.fillText("Press return for game " + levelno, 5, 125);
	}
}