/*constants*/
var width = 300;
var height = 300;
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



//var x;
//var y;
//var t;
//var correct = 0;
//var goes = 0;
//var limit = 5;
//var run = 0;
//var lives;
//var score_incr = 10;
var totalscore = 0;
//var speed;
var game;
var levelno = 1;
var maxgoes = 10;
var gametotal = 5;

//var colours = ["orange", "red", "blue", "green", "yellow"];
//var current_colour;
//var rgb1;
//var rgb2;
//var e_colour = new Enumerator(colours);

  // The hue spectrum used by HSV color picker charts.
  
//var c_idx;


function Game(level) {
	this.lives = 3;
	this.missed = 0;
	this.speed = 20;
	this.score = 0;
	this.active = 0;
	this.level = level;
	this.score_incr = 10;
	this.timeout;
	this.x = 0;
	this.y = 75;
	this.font = 'bold 120px sans-serif';
	this.go = 0;	
	
	this.resetxy = function()  {
		this.x = 0;
		this.y = 75;
	}	
	
	this.incrementxy = function() {
		this.x += 2;
		this.y += 2;
	}
	
	this.increasespeed = function () {
		if (this.speed >= 1)
			this.speed--;
	}
	
	this.gotcorrect = function () {
		this.score += this.score_incr;
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
		this.go++;
		
		if (this.go >= maxgoes)
			this.end();
		else
		{
		
			this.updatescore();	
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
	}
	
	this.start = function () {
		this.active = 1;
		this.updatescore();
		this.level.updateletter();
		this.play();
	}
	
	this.end = function () {
		totalscore += this.score;
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
			  ctx.fillText(this.level.concatenate(), this.x, this.y);
			ctx.closePath();                                
			ctx.stroke();
			
			if (this.x >= width-20) {
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


function init() {
	$(document).keydown(listen);	
	canvastext();
	document.getElementById("gametotal").innerHTML = gametotal;
	//updateScore();
}

function listen(event) {			
	
	if (game == null || game.active == 0) {		
		if (levelno <= gametotal)	{
			if (event.keyCode == 13) {
				document.getElementById("totalscore").innerHTML = totalscore;
				document.getElementById("gamecurr").innerHTML = levelno;
				game = new Game(new Level(levelno++));	
				game.start();
			}
		}
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
		for (i=0; i<this.letters.length; i++)
			this.letters[i] = getRandonNumber(26);
		
		this.letterscorrect = 0;		
	}
	
	this.concatenate = function() {
		//return ls[this.letters[0]];
		var r = "";
		for (i=0; i<this.letters.length; i++)
			r += ls[this.letters[i]];
		//document.getElementById("letter2").innerHTML = r;
		return r;
	}
	
	this.keypressed = function(keycode) {
		if (keycode == cs[this.letters[this.letterscorrect]])
			this.letterscorrect++;
		
		return this.letters.length == this.letterscorrect;
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
		ctx.fillStyle = "orange";
		if (levelno > gametotal)
			ctx.fillText("Thank you for playing.", 5, 125);
		else			
			ctx.fillText("Press return for game " + levelno, 5, 125);
	}
}