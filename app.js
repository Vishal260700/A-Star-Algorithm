var cols = 50;
var rows = 50;

var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var w,h;

var start;
var end;
var path = [] ;
var noSolution = false;

function heuristic(a,b){
	var d = dist(a.x,a.y,b.x,b.y);
	// var d = abs(a.x , b.x) + abs(a.y , b.y);
	return d;
}

function remove_from_array(array1 , inst){
	for( var a = array1.length - 1 ; a >= 0 ; a-- ){
		if(array1[a] == inst){
			array1 = array1.splice(a,1);
		}
	}
}

function spot(i,j){
	this.x = i;
	this.y = j;
	this.f = 1;
	this.g = 1;
	this.h = 1;
	this.wall = false;

	if(random(1) < 0.3){
		this.wall = true;
	}

	this.Neighbors = [];

	this.previous = undefined;

	this.show = function(colr){
		fill(colr);
		if(this.wall){
			fill(0);
		}
		noStroke();
		ellipse(this.x * w + w / 2,this.y * h + h / 2, w-1 , h-1);
	}

	this.show2 = function(colr){
		fill(colr);
		if(this.wall){
			fill(0);
		}
		noStroke();
		rect(this.x * w ,this.y * h , w-1 , h-1);
	}

	this.addNeighbors = function(grid){
		var i = this.x;
		var j = this.y;

		if(i < cols - 1){
			this.Neighbors.push(grid[i+1][j])
		}
		if(i > 0){
			this.Neighbors.push(grid[i-1][j])
		}
		if(j < rows - 1){
			this.Neighbors.push(grid[i][j+1])
		}
		if(j > 0){
			this.Neighbors.push(grid[i][j-1])
		}
		if(i > 0 && j > 0){
			this.Neighbors.push(grid[i - 1][j - 1]);
		}
		if(i < cols - 1 && j > 0){
			this.Neighbors.push(grid[i + 1][j - 1]);
		}
		if(i > 0 && j < rows - 1){
			this.Neighbors.push(grid[i - 1][j + 1]);
		}
		if(i < cols - 1 && j < rows - 1){
			this.Neighbors.push(grid[i + 1][j + 1]);
		}
	}
}

function setup(){
	createCanvas(800,700);
	w = width / cols;
	h = height / rows;

	console.log(w,h);


	for(var i = 0;i < cols;i++){
		grid[i] = new Array(rows);
	}
	for(var i = 0; i < cols;i++){
		for(var j = 0; j < rows ; j++){
			grid[i][j] = new spot(i,j);
			//console.log(grid[i][j]);
		}
	}

	for(var i = 0; i < cols;i++){
		for(var j = 0; j < rows ; j++){
			grid[i][j].addNeighbors(grid);
		}
	}


	start = grid[0][0];
	end = grid[cols-1][rows-1];

	start.wall = false;
	end.wall = false;

	openSet.push(start);

	console.log(grid);

}




function draw(){

	if(openSet.length > 0){
		// keep going

		var winner =  0;
		for(var i = 0 ; i < openSet.length ; i ++){
			if(openSet[i].f < openSet[winner].f){
				winner = i;
			}
		}

		var current = openSet[winner];

		if(current === end){

			noLoop();

			console.log("DONe!!");
		}

		remove_from_array(openSet , current);
		// openSet.remover(current);
		closedSet.push(current);

		var neighbors = current.Neighbors;

		for(var i = 0; i < neighbors.length ; i++){

			var neighbor = neighbors[i];

			if(!closedSet.includes(neighbor) && !neighbor.wall){

				var tempG = current.g + 1;
				var NewPath = false;
				if(openSet.includes(neighbor)){

					if(tempG < neighbor.g){
						NewPath = true;
						neighbor.g = tempG;
					}
				}else{
					neighbor.g = tempG;
					NewPath = true;
					openSet.push(neighbor);
				}
				if(NewPath){
				neighbor.f = heuristic(neighbor , end);
				neighbor.h = neighbor.f + neighbor.g;
				neighbor.previous = current;
				}
			}
		}

	}else{
		//end here
		console.log("no Solution");
		noSolution = true;
		noLoop();
	}

	background(255);

	for(var i = 0; i < cols ; i++){
		for(var j = 0 ; j < rows ; j++){
			grid[i][j].show(color(255));
		}
	}

	for(var a = 0 ; a < closedSet.length ; a++){
		closedSet[a].show(color(255));
	}

	for(var a = 0 ; a < openSet.length ; a++){
		openSet[a].show(color(255));
	}
		if(!noSolution){
			path = [];
			var temp = current;
			path.push(temp);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}
		}

	for(var i = 0 ; i < path.length ; i++){
		path[i].show2(color(243, 156, 18));
	}
}