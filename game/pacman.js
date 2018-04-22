var canvas;
var context;
var board;
var score;
var interval;
var timeLeft;
var timeThen;
var wall;
var bitCoin;
var hearts;
var fiveBall;
var fifteenBall;
var twentyfiveBall;
var balls;
var clockImage;
var clockCount;
var fruitImage;
var fruitCount;
var heartImage;
var bonusHeartCount;
var monster;
var monsterImage;
var monstersArray = [];
var pacman;
var pacmanDirection;
var pacmanFaceShape;
var bonusCreature; 
var monstersInitialPositions = []; 
var present;
var clockCount;
var monster1;
var monster2;
var monster3;
var monsterPicCount;
var timeout;
var intervalCounter;
var audio;

var numOfBalls = "50";
var sumOfTime = "60" * 1000;
var numOfMonsters = "1";


function setup()
{
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    pacmanFaceShape = 0;
    pacmanDirection = 0;

    if (!audio) audio = new Audio('audio/pokemon.mp3');
    intervalCounter = 0;
    context.strokeStyle = "yellow";

    clockImage = new Image();
    clockImage.src = "img/time.png";

    fruitImage = new Image();
    fruitImage.src = "img/Cherry.png";

    heartImage = new Image();
    heartImage.src = "img/heart.png";


    monster1 = new Image();
    monster1.src = "img/monster1.gif";

    monster2 = new Image();
    monster2.src = "img/monster2.gif";

    monster3 = new Image();
    monster3.src = "img/monster3.gif";

    bitCoin = new Image();
    bitCoin.src = "img/bitCoin.png"

    wall = new Image();
    wall.src = "img/wall.png";

    present = new Image();
    present.src = "img/present.png";

    monsterPicCount = 0;

    monstersInitialPositions = [[0,0],[19,0],[0,9],[19,9]];

    monstersArray = [];

    for(var i = 0; i < numOfMonsters; i++)
    {
        monster = createMonster(i);
        monstersArray.push(monster);
    }

    keysDown = {};
    addEventListener("keydown", function (e) {
        var k=e.keyCode;
        if([32,37,38,39,40].indexOf(e.keyCode) > -1)
           e.preventDefault();
        keysDown[38]=false;
        keysDown[37]=false;
        keysDown[39]=false;
        keysDown[40]=false;
        noKeyPress=false;
          if(k==37){
           keysDown[37] = true;
	     }
        if(k==38){
           keysDown[38] = true;
        }
        if(k==39) {
            keysDown[39] = true;
        }
        if(k==40) {
            keysDown[40] = true;
        }
    }, false);

}

function newGame()
{
    $('#canvas').removeClass('d-hidden');
    $('#alterCanvas').addClass('d-hidden');
    audio.currentTime = 0;
    audio.loop = true;
    audio.play();

    fruitCount = 1;
    bonusHeartCount = 0;
    timeLeft = sumOfTime;
    clockCount = 1;
    presentCount = 1;
    hearts = 3;
    score = 0;

    document.getElementById("heart1").style.visibility = "visible";
    document.getElementById("heart2").style.visibility = "visible";
    document.getElementById("heart3").style.visibility = "visible";

    pacman = new Object();
    createBonusCreature();

    board = [];

    balls = numOfBalls;

    fiveBall = Math.floor(0.6 * numOfBalls);
    fifteenBall = Math.floor(0.3 * numOfBalls);
    twentyfiveBall = Math.floor(0.1 * numOfBalls);

    var cnt = 122;

    for (var i = 0; i < 20; i++) {
        board[i] = new Array();
        for (var j = 0; j < 10; j++) {

            if (findfences(i, j) == true) {
                board[i][j] = 1; // '1' for FENCE
            }
            else {
                var randomNum = Math.random();

                if(randomNum <= 1.0 * fiveBall / cnt)
                {
                    fiveBall--;
                    board[i][j] = 2; // '2' for FIVE Ball
                }
                else if(randomNum <= 1.0 * (fifteenBall + fiveBall ) / cnt)
                {
                    fifteenBall--;
                    board[i][j] = 3; // '3' for FIFTEEN Ball
                }
                else if (randomNum <= 1.0 * (twentyfiveBall + fifteenBall + fiveBall) / cnt ) {
                    twentyfiveBall--;
                    board[i][j] = 4; // '4' for TWENTYFIVE Ball
                }
                else if(randomNum < 1.0 * (twentyfiveBall + fifteenBall + fiveBall + clockCount) / cnt)
                {
                    clockCount--;
                    board[i][j] = 5; // '5' for CLOCK
                }
                else if(randomNum < 1.0 * (twentyfiveBall + fifteenBall + fiveBall + clockCount + fruitCount) / cnt)
                {
                    fruitCount--;
                    board[i][j] = 6; // '6' for FRUIT
                }
                else if(randomNum < 1.0 * (twentyfiveBall + fifteenBall + fiveBall + presentCount + present) / cnt){
                    presentCount--;
                    board[i][j] =8; // '8' for present  
                }
                else {
                    board[i][j] = 0; 
                }
                cnt--;
            }
        }
    }
    while(twentyfiveBall > 0 || fifteenBall > 0 || fiveBall > 0 || clockCount > 0 || fruitCount > 0 ||presentCount > 0) {
        var emptyCell = findCell(board);
        if (fiveBall > 0) {
            board[emptyCell[0]][emptyCell[1]] = 2;
            fiveBall--;
        }
        else if (fifteenBall > 0) {
            board[emptyCell[0]][emptyCell[1]] = 3;
            fifteenBall--;
        }
        else if (twentyfiveBall > 0) {
            board[emptyCell[0]][emptyCell[1]] = 4;
            twentyfiveBall--;
        }
        else if (clockCount > 0) {
            board[emptyCell[0]][emptyCell[1]] = 5;
            clockCount--;
        }
        else if (fruitCount > 0) {
            board[emptyCell[0]][emptyCell[1]] = 6;
            fruitCount--;
        }
        else if (presentCount > 0) {
            board[emptyCell[0]][emptyCell[1]] = 8;
            presentCount--;
        }
    }

    reset(board);
    timeThen = Date.now();
}

function reset(board)
{

    keysDown[38]=false;
    keysDown[37]=false;
    keysDown[39]=false;
    keysDown[40]=false;
    pacmanDirection = 0;

    if(bonusHeartCount > 0) {
        var heartPosition = findCell(board);
        board[heartPosition[0]][heartPosition[1]] = 7;
        bonusHeartCount = -1;
    }

    var monsterTurnPosition = [];
    for(var i = 0; i < monstersInitialPositions.length; i ++)
    {
        monsterTurnPosition[i] = monstersInitialPositions[i];
    }
    for(var i = 0; i < numOfMonsters; i++) {

        var indexOfPosition = Math.floor(Math.random() * monsterTurnPosition.length);
        var monsterRandomPosition = monsterTurnPosition[indexOfPosition];
        monstersArray[i].x = monsterRandomPosition[0] * 40;
        monstersArray[i].y = monsterRandomPosition[1] * 40;
        if(indexOfPosition > -1)
            monsterTurnPosition.splice(indexOfPosition, 1);

    }
    if(bonusCreature != null) {
        var bonusCreaturePositionTurn = monsterTurnPosition[0];
        bonusCreature.x = bonusCreaturePositionTurn[0] * 40;
        bonusCreature.y = bonusCreaturePositionTurn[1] * 40;
    }

    var pacmanPosition = findCell(board);
    pacman.x = pacmanPosition[0] * 40;
    pacman.y = pacmanPosition[1] * 40;



    noKeyPress=true;

    window.clearInterval(interval);
    window.clearTimeout(timeout);

    Draw();
    timeout = setTimeout(function(){interval=setInterval(UpdatePosition, 30); }, 0);

}

 function findCell(board){
    var i = Math.floor((Math.random() * 19) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while(board[i][j]!=0)
    {
        i = Math.floor((Math.random() * 19) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i,j];             
 }

function GetKeyPressed() {
    if (keysDown[38]){

        return 1;
    } //up
    if (keysDown[40]){

        return 2;
    } //down
    if (keysDown[37]){

        return 3;
    } //left

    if (keysDown[39]){       
        return 4;
    } //right
}

function Draw() {
    var lblScore = document.getElementById("lblScore");
    var lblTime = document.getElementById("lblTime");
    canvas.width=canvas.width; //clean board

    context.strokeRect(0,0,canvas.width,canvas.height);

    lblScore.value = score;
    lblTime.value = (timeLeft/1000).toFixed(2);

    var direction = pacmanDirection;
    var centerPacmanX = pacman.x + 20;
    var centerPacmanY = pacman.y + 20;


    if(direction == 0 || direction == 1 || direction == 2 || direction == 3 || direction == 4 || noKeyPress)
    {

        var pacStart;
        var pacEnd;
        var eyeX;
        var eyeY;
        var bool;

        if(direction == 0 || direction == 4 || noKeyPress )
        {
            pacStart = 0.15;
            pacEnd = 1.85;
            eyeX = 5;
            eyeY = -11;
        }
        else if(direction == 1)
        {
            pacStart = 1.35;
            pacEnd = 1.65;
            eyeX = -11;
            eyeY = -5;
            bool = true;
        }
        else if(direction == 2)
        {
            pacStart = 0.65;
            pacEnd = 0.35;
            eyeX = 11;
            eyeY = -5;
        }
        else if(direction == 3)
        {
            pacStart = 0.8;
            pacEnd = 1.15;
            eyeX = -5;
            eyeY = -11;
            bool = true;
        }
        if(pacmanFaceShape == 3)
        {
            pacStart = 0;
            pacEnd = 8;
        }

    }
    intervalCounter++;

        context.beginPath();
        context.arc(centerPacmanX, centerPacmanY, 17, pacStart * Math.PI, pacEnd * Math.PI, bool); // half circle
        context.lineTo(centerPacmanX, centerPacmanY);
        context.fillStyle = "yellow"; //pacman color
        context.fill();
        context.beginPath();
        context.arc(centerPacmanX + eyeX, centerPacmanY + eyeY, 2.5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //eye color
        context.fill();


    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 40 + 20;
            center.y = j * 40 + 20;

            if (board[i][j] == 1) {
                context.beginPath();
                context.rect(center.x-20, center.y-20, 40, 40);
                context.drawImage(wall,i*40, j*40, 40,40);
            }
            else if(board[i][j] == 2)
            {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI, true); // circle
                context.fillStyle = "#f98917" ; // ball color
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = "f2f2f2";
                context.stroke();
                context.fillStyle = "black";
                context.fillText("5", center.x - 3, center.y + 4);
            }
            else if(board[i][j] == 3)
            {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#05c908" ; // ball color
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = "f2f2f2";
                context.stroke();
                context.fillStyle = "black";
                context.fillText("15", center.x - 6, center.y + 4);

            }
            else if(board[i][j] == 4)
            {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#ece202" ; // ball color
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = "f2f2f2";
                context.stroke();
                context.fillStyle = "black";
                context.fillText("25", center.x - 5.5, center.y + 4);

            }
            else if (board[i][j] == 5) {
                context.drawImage(clockImage,center.x - 15, center.y - 15, 30,30);
            }
            else if (board[i][j] == 6) {
                context.drawImage(fruitImage, center.x -15, center.y -15, 30,30);
            }
            else if(board[i][j] == 7) {
                context.drawImage(heartImage, center.x - 18, center.y - 17, 35, 35);
            }
            else if(board[i][j] == 8){
                context.drawImage(present,center.x - 15, center.y - 15, 30,30);
            }
        }
    }

    for(var i = 0; i < monstersArray.length; i++)
    {
        context.drawImage(monstersArray[i].img[Math.floor((monsterPicCount % (monster.img.length * 2)) / 2)], monstersArray[i].x, monstersArray[i].y, 40, 40);
    }
    monsterPicCount ++;

    if(bonusCreature != null)
        context.drawImage(bonusCreature.img[Math.floor((monsterPicCount % (bonusCreature.img.length * 3)) / 3)], bonusCreature.x, bonusCreature.y, 40, 40);

}

function UpdatePosition()
{
    var timeNow = Date.now();
    var delta = timeNow - timeThen;
    timeLeft -= delta;

    if(timeLeft <= 0)
        timeLeft = 0;

    pacmanPlay(pacman);
    for(var i = 0; i < monstersArray.length; i++) {
        monsterPlay(monstersArray[i]);

        if(clash(monstersArray[i], pacman))
        {
            heartsDown();

        }
    }
    if(bonusCreature != null)
    {
        bonusCreaturePlay(bonusCreature);
        if (clash(pacman, bonusCreature)) {
            score += 50;
            bonusCreature = null;
        }
    }
    if(timeLeft <= 0 || balls ==0)
    {
        audio.pause();
        audio.currentTime = 0;
        window.clearInterval(interval);
        context.font = "30px arial";
        context.fillStyle = "black";
        if(score >= 150){
            context.fillText("We have a Winner!!!", 240, 160);             
        }
        else
            context.fillText("You can do better " + score + " points", 240, 160);

    }
    else if(hearts <= 0)
    {
        audio.pause();
        audio.currentTime = 0;
        window.clearInterval(interval);
        context.font = "60px arial";
        context.fillStyle = "black";
        context.fillText("You Lost!", 270, 200);
    }
    else
        Draw();

    timeThen = timeNow;
}

function findfences(i, j) 
{
    if(i >= 10)
        i = 20 - i - 1;

    if ((i == 0 && (j == 3 || j == 5 || j==4)) || ((i == 1) && ((j == 1)  || (j==3) || (j == 7) || (j == 8)))
        || ((i == 2) && ((j == 1) || (j ==7) || (j ==8))) || ((i == 3) && ((j == 3) || (j == 4) || j == 6))
        || ((i == 4) && ((j == 1) || (j == 4) || (j == 5) || (j == 6) || (j == 8))) || ((i == 5) && ((j == 1) || (j == 2) ))
        || ((i == 6) && ((j == 1) || (j == 4) || (j == 5) || (j == 8) || (j == 8))) || ((i == 6) && ((j == 2) || (j == 4)))
        || ((i == 8) && ((j == 0) || (j == 2) || (j == 6) || (j == 8) || (j == 9)))
        || ((i == 9) && ((j ==0) || (j == 2) || (j == 3) || (j == 5) || (j == 6) || (j == 9))))
        return true;
}

function createMonster(type)
{
    monster = new Object();
    monster.type = type;

    monster.lastmove = -1;
    if(monster.type == 0) {
        monster.img = [monster1];
    }
    else if(monster.type == 1) {
        monster.img = [monster2];
    }

    else if(monster.type ==  2) {
        monster.img = [monster3];
    }
    return monster;
}

function pacmanEats(x, y)
{
    if(board[x][y] > 1)
    {
        var item = board[x][y];
        board[x][y] = 0;
        return item;
    }
    else
        return 0;

}

function monstersMoves(direction, positionX, positionY, monsterType)
{
    if(direction == 1)
        positionY -= 5;
    else if(direction == 2)
        positionY += 5;
    else if(direction == 3)
        positionX -= 5;
    else if(direction == 4)
        positionX += 5;

    var diffX = Math.abs(pacman.x - positionX);
    var diffY = Math.abs(pacman.y - positionY);
    var normalPath = diffX + diffY;
    return normalPath;
    if(monsterType == 1 || monsterType ==2 || monsterType == 3)
        return normalPath;

}

function creatureMove(direction, creature, speed)
{

    if(direction == 1)
        creature.y -= 5 * speed;
    else if(direction == 2)
        creature.y += 5 * speed;
    else if(direction == 3) {
        creature.x -= 5 * speed;
        if(creature.x <= 0 && creature.y == 160){
            creature.x = 760 - Math.abs(creature.x);
        }
    }
    else if(direction == 4) {
        creature.x += 5 * speed;
        if (creature.x >= 760 && creature.y == 160)         
            creature.x = Math.abs(760 - creature.x);
    }
}

function isPossibleMove(direction, positionX, positionY)
{
    var possible = false;
    if(direction==1)        //holding up
    {
        if(positionX%40 == 0 && positionY > 0 && (positionY % 40 != 0 || board[positionX / 40][positionY / 40 - 1] != 1))
                possible =  true;
    }
    else if(direction==2)        // holding down
    {
        if(positionX % 40 == 0 && positionY < 360 && (positionY % 40 != 0 || board[positionX/40][positionY/40 + 1] != 1))
                possible = true;
    }
    else if(direction==3)        // holding left
    {
        if(positionY % 40 == 0 && ((positionX > 0 && (positionX % 40 != 0 || board[positionX/40 - 1][positionY/40] != 1)) || (positionX <= 0 && positionY == 160)))
                possible = true;
    }
    else if(direction==4)        // holding right
    {
        if(positionY % 40 == 0 && ((positionX < 760  &&  (positionX % 40 != 0 || board[positionX / 40 + 1][positionY / 40] != 1)) ||(positionX >= 760 &&  positionY == 160)))
                possible = true;
    }
    return possible;
}


function pacmanPlay(pacman)
{
    var key = GetKeyPressed();
    
    if(isPossibleMove(key,pacman.x, pacman.y))
    {
        pacmanDirection = key;
    }
    if(isPossibleMove(pacmanDirection,pacman.x, pacman.y)) {
        creatureMove(pacmanDirection,pacman, 1);

    }

    var pacmanAte = pacmanEats(Math.round(pacman.x /40), Math.round(pacman.y / 40));
    if(pacmanAte > 0)
    {
        if(pacmanAte >= 2 && pacmanAte < 5) {
            if (pacmanAte == 2)
                score += 5; // five Ball
            else if (pacmanAte == 3)
                score += 15; // fifteen Ball
            else if (pacmanAte == 4)
                score += 25; // twenty-five Ball
                balls--;
        }
        else if(pacmanAte == 5)
            timeLeft += 10000; // time = time + 10 seconds
        else if(pacmanAte == 6)
            score += 30; // cherry = score + 30
        else if(pacmanAte == 7) {
            hearts++; // heart
            if(hearts == 3)
                document.getElementById("heart1").style.visibility = "visible";
            else
                document.getElementById("heart2").style.visibility = "visible";

        }
        else if(pacmanAte == 8){
            presentFunc();
        }
    }
}

function presentFunc(){
    // ???להוריד למפלצת מהירות לכמה שניות????
    timeLeft += 5000;
    score += 15;
}

function createBonusCreature()
{
    bonusCreature = new Object();
    bonusCreature.img = [bitCoin];
    bonusCreature.lastmove = -1;
}

function monsterPlay(monster)
{
    var monsterMove;
    if(monster.lastmove%2 == 0)
        monsterMoveToAvoid = monster.lastmove - 1;
    else
        monsterMoveToAvoid = monster.lastmove + 1;

    var monsterBestMoveValue = 1200;
    for(var i = 1; i < 5; i++)
    {
        if(monsterMoveToAvoid != i && isPossibleMove(i,monster.x, monster.y))
        {
            var value = monstersMoves(i,monster.x, monster.y,monster.type)





            if(value < monsterBestMoveValue)
            {
                monsterMove = i;
                monsterBestMoveValue = value;
            }
            else if(value == monsterBestMoveValue)
            {
                var random = Math.random();
                if(random < 0.5)
                    monsterMove = i;
            }
        }
    }
    creatureMove(monsterMove, monster, 0.8);
    monster.lastmove = monsterMove;
}

function bonusCreaturePlay(bonusCreature)
{
    var moveToAvoid;
    if(bonusCreature.lastmove % 2 == 0)
        moveToAvoid = bonusCreature.lastmove - 1;
    else
        moveToAvoid = bonusCreature.lastmove + 1;

    var possibleBonusMoves = []
    for(var i = 1; i < 5; i++)
    {
        if(isPossibleMove(i,bonusCreature.x, bonusCreature.y) && moveToAvoid != i)
            possibleBonusMoves.push(i);
    }

    var move = possibleBonusMoves[Math.floor(Math.random() * possibleBonusMoves.length)];
    creatureMove(move, bonusCreature, 0.8);
    bonusCreature.lastmove = move;
}

function clash(creatureA, creatureB)
{
    var deltaX = Math.abs(creatureA.x - creatureB.x);
    var deltaY = Math.abs(creatureA.y - creatureB.y);
    if(deltaX < 25 && deltaY < 25)
        return true;

    return false;
}


function heartsDown()
{
    if(bonusHeartCount == 0)
        bonusHeartCount = 1;
    if(hearts == 3)
    {
        document.getElementById("heart1").style.visibility = "hidden";
    }
    else if(hearts == 2)
    {
        document.getElementById("heart2").style.visibility = "hidden";
    }
    else if(hearts == 1)
    {
        document.getElementById("heart3").style.visibility = "hidden";
    }
    hearts--;
    if(hearts > 0)
        reset(board);
}

function exitGame(){
    $('#canvas').addClass('d-hidden');
    $('#alterCanvas').removeClass('d-hidden');
    if (audio) audio.pause();
    $('.gameContainer input').val('');
    window.clearTimeout(timeout);
    window.clearInterval(interval);
}