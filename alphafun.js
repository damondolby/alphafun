var x;
var y;
var t;
var width = 400;
var height = 400;
var correct = 0;
var goes = 0;
var limit = 5;
var run = 0;

var ls = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var cs = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
var c_idx;

function init(){
	//resetxy();
	
	//c_idx = Math.floor(Math.random()*27)-1;
	
	$(document).keydown(listen);
	
	canvasStart();
	
	//play();	
}

function listen(event){			
	
	if (run == 0)
	{
		//game end
		startGame();
	}
	else
	{
		//mid-game
		if (event.keyCode == cs[c_idx])
		{
			//alert('You pressed '+event.keyCode);
			correct++;
			updateLetter();
		}
	}
	event.preventDefault();			
}

function updateScore()
{
	document.getElementById("correct").innerHTML = correct;
	document.getElementById("goes").innerHTML = goes;
}

function resetxy()
{
	x = 0;
	y = 75;
}		

function updateLetter()
{
	goes++;
	updateScore();
	
	if (goes >= limit)
	{
		clearTimeout(t);
		run = 0;
		canvasEnd();
		return;
	}
	c_idx = Math.floor(Math.random()*26);
	//element = document.getElementById("idx").innerHTML = c_idx;
	resetxy();
	//play();	
}

function startGame()
{
	goes = -1;
	correct = 0;
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
		ctx.fillStyle = "orange";
		ctx.fillText(ls[c_idx], x, y);
	
		//ctx.strokeStyle = "orange";
		
		
		ctx.closePath();
		ctx.stroke();
		
		
		if (x >= width-20)
		{
			updateLetter()
		}
		else
		{
			x = x + 5;
			y = y + 5;
		}
	}
	
	if (run == 1)
		t=setTimeout("play()",75);
}

function canvasStart(){
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,width,height); // clear canvas

		ctx.beginPath();	
		
		ctx.font  = 'bold 40px sans-serif';
		ctx.fillStyle = "orange";
		ctx.fillText("Press any key", 50, 125);
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
		ctx.fillText(correct + " out of " + goes + "!", 50, 125);
		
		ctx.fillStyle = "orange";
		ctx.fillText("Press any key", 50, 225);
		ctx.fillText("to start...", 90, 275);
	}
}