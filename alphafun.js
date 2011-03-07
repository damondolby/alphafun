var x;
var y;
var t;
var width = 300;
var height = 300;
//var correct = 0;
//var goes = 0;
var limit = 5;
var run = 0;
var lives = 3;
var score_incr = 10;
var score = 0;
var speed;

var ls = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var cs = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
var c_idx;
var colours = ["orange", "red", "blue", "green", "yellow"];
//var current_colour;
var rgb1;
var rgb2;
//var e_colour = new Enumerator(colours);

function init(){
	//resetxy();
	
	//c_idx = Math.floor(Math.random()*27)-1;
	
	$(document).keydown(listen);
	
	canvasStart();
	
	updateScore();
	
	//play();	
}

function listen(event){			
	
	if (run == 0)
	{
		if (event.keyCode == 13)
		{
			//game end
			startGame();
		}
	}
	else
	{
		//mid-game
		if (event.keyCode == cs[c_idx])
		{
			//alert('You pressed '+event.keyCode);
			score += score_incr;
			
			increaseSpeed();
	
			updateLetter();
		}
	}
	event.preventDefault();			
}

function increaseSpeed()
{
	/*if (speed >= 8)
	{
		speed--;
		if (speed >= 20)
			speed--;
	}*/
	if (speed >= 1)
		speed--;
}

function updateScore()
{
	document.getElementById("my_lives").innerHTML = lives;
	document.getElementById("my_score").innerHTML = score;
}

function resetxy()
{
	x = 0;
	y = 75;
}		

function updateLetter()
{
	//goes++;
	
	//document.getElementById("speed").innerHTML = speed;
	updateScore();
	
	if (lives <= 0)
	{
		clearTimeout(t);
		run = 0;
		canvasEnd();
		return;
	}
	c_idx = Math.floor(Math.random()*26);
	//current_colour = colours[Math.floor(Math.random()*5)];
		// Add 2 steps to it
	rgb1 = "rgb("+getRandonNumber(155)+","+getRandonNumber(155)+","+getRandonNumber(155)+")";
	rgb2 = "rgb("+getRandonNumber(155)+","+getRandonNumber(155)+","+getRandonNumber(155)+")";
	//element = document.getElementById("idx").innerHTML = c_idx;
	resetxy();
	//play();	
}

function getRandonNumber(upper)
{
	return Math.floor(Math.random()*upper);
}

function startGame()
{	
	//goes = -1;
	//correct = 0;
	lives = 5;
	score = 0;
	speed = 20;
	run = 1;
	updateLetter();
	play();	
}

function play(){

	//document.getElementById("dt").innerHTML = new Date();
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,width,height); // clear canvas

		ctx.beginPath();	
		
		ctx.font  = 'bold 120px sans-serif';
		//ctx.fillStyle = current_colour;
		//ctx.strokeStyle = "black";
		
		var gradient = ctx.createLinearGradient(x, y, x+30, y+30);
		// Add 2 steps to it
		gradient.addColorStop(0, rgb1);
		gradient.addColorStop(1, rgb2);
		// Assign our gradient to the fillStyle
		ctx.fillStyle = gradient;

		ctx.fillText(ls[c_idx], x, y);
	
		//ctx.strokeStyle = "orange";
		
		
		ctx.closePath();
		ctx.stroke();
		
		
		if (x >= width-20)
		{
			lives--;
			updateLetter();
		}
		else
		{
			x = x + 2;
			y = y + 2;
		}
	}
	
	if (run == 1)
		t=setTimeout("play()", speed);
}

function canvasStart(){
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		
		var ctx = canvas.getContext('2d');
			
		
		ctx.clearRect(0,0,width,height); // clear canvas
		
		

		ctx.beginPath();	
				
		ctx.font  = 'bold 40px sans-serif';
		ctx.fillStyle = "orange";
		ctx.fillText("Press return key", 50, 125);
		ctx.fillText("to start...", 90, 175);
	}
}

function canvasEnd(){
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,width,height); // clear canvas

		ctx.beginPath();	
		
		ctx.font  = 'bold 40px sans-serif';
		
		ctx.fillStyle = "red";
		ctx.fillText("Score " + score + "!", 50, 125);
		
		ctx.fillStyle = "orange";
		ctx.fillText("Press return key", 50, 225);
		ctx.fillText("to start...", 90, 275);
	}
}