sap.ui.define([], function(JSONModel, Device) {
	"use strict";

	return {
		init: function() {
			this.context = canvas.getContext('2d');
			this.canvas = canvas;
			this.shape = new Object();
			this.board = [];
			this.score = 0;
			this.pac_color = "yellow";
			this.start_time = new Date();
			this.time_elapsed = 0;
			this.interval = 0;
		},

		start: function() {
			pacjs.board = new Array();
			pacjs.score = 0;
			pacjs.pac_color = "yellow";
			var cnt = 100;
			var food_remain = 50;
			var pacman_remain = 1;
			pacjs.start_time = new Date();
			for (var i = 0; i < 10; i++) {
				pacjs.board[i] = new Array();
				//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
				for (var j = 0; j < 10; j++) {
					if ((i == 3 && j == 3) || (i == 3 && j == 4) || (i == 3 && j == 5) || (i == 6 && j == 1) || (i == 6 && j == 2)) {
						pacjs.board[i][j] = 4;
					} else {
						var randomNum = Math.random();
						if (randomNum <= 1.0 * food_remain / cnt) {
							food_remain--;
							pacjs.board[i][j] = 1;
						} else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
							pacjs.shape.i = i;
							pacjs.shape.j = j;
							pacman_remain--;
							pacjs.board[i][j] = 2;
						} else {
							pacjs.board[i][j] = 0;
						}
						cnt--;
					}
				}
			}
			while (food_remain > 0) {
				var emptyCell = pacjs.findRandomEmptyCell(pacjs.board);
				pacjs.board[emptyCell[0]][emptyCell[1]] = 1;
				food_remain--;
			}
			pacjs.keysDown = {};
			window.addEventListener("keydown", function(e) {
				pacjs.keysDown[e.keyCode] = true;
			}, false);
			window.addEventListener("keyup", function(e) {
				pacjs.keysDown[e.keyCode] = false;
			}, false);
			pacjs.interval = setInterval(pacjs.UpdatePosition, 250);
		},

		getKeyPressed: function() {
			if (pacjs.keysDown[38]) {
				return 1;
			}
			if (pacjs.keysDown[40]) {
				return 2;
			}
			if (pacjs.keysDown[37]) {
				return 3;
			}
			if (pacjs.keysDown[39]) {
				return 4;
			}
		},

		draw: function() {
			var board = pacjs.board;
			var context = pacjs.context;
			var canvas = pacjs.canvas;
			var score = pacjs.score;
			var time_elapsed = pacjs.time_elapsed;
			
			canvas.width = canvas.width; //clean board
			$('#lblScore').value = score;
			$('#lblTime').value = time_elapsed;
			for (var i = 0; i < 10; i++) {
				for (var j = 0; j < 10; j++) {
					var center = new Object();
					center.x = i * 60 + 30;
					center.y = j * 60 + 30;
					if (board[i][j] == 2) {
						context.beginPath();
						context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
						context.lineTo(center.x, center.y);
						context.fillStyle = pacjs.pac_color; //color 
						context.fill();
						context.beginPath();
						context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
						context.fillStyle = "black"; //color 
						context.fill();
					} else if (board[i][j] == 1) {
						context.beginPath();
						context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
						context.fillStyle = "black"; //color 
						context.fill();
					} else if (board[i][j] == 4) {
						context.beginPath();
						context.rect(center.x - 30, center.y - 30, 60, 60);
						context.fillStyle = "grey"; //color 
						context.fill();
					}
				}
			}
		},

		UpdatePosition: function() {
			var board = pacjs.board;
			var shape = pacjs.shape;
			
			board[shape.i][shape.j] = 0;
			var x = pacjs.getKeyPressed();
			if (x == 1) {
				if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
					shape.j--;
				}
			}
			if (x == 2) {
				if (shape.j < 9 && board[pacjs.shape.i][shape.j + 1] != 4) {
					shape.j++;
				}
			}
			if (x == 3) {
				if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
					shape.i--;
				}
			}
			if (x == 4) {
				if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
					shape.i++;
				}
			}
			if (board[shape.i][shape.j] == 1) {
				pacjs.score++;
			}
			board[shape.i][shape.j] = 2;
			var currentTime = new Date();
			pacjs.time_elapsed = (currentTime - pacjs.start_time) / 1000;
			if (pacjs.score >= 20 && pacjs.time_elapsed <= 10) {
				pacjs.pac_color = "green";
			}
			if (pacjs.score == 50) {
				window.clearInterval(interval);
				window.alert("Game completed");
			} else {
				pacjs.draw();
			}
		},
		
		findRandomEmptyCell: function(board){
             	var i = Math.floor((Math.random() * 9) + 1);
             	var j = Math.floor((Math.random() * 9) + 1);
    			while(board[i][j]!=0)
    			{
             		i = Math.floor((Math.random() * 9) + 1);
             		j = Math.floor((Math.random() * 9) + 1);
    			}
                return [i,j];             
             }

	};
});