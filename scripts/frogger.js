var gameBoardWidth = 60 * 15;
var gameBoardHeight = 60 * 13;


var froggerGame = function() {
  var self = this;
  this.frog = undefined;
  this.log = [];
  this.updateInterval = undefined;
  var level = undefined;

  // update the game state and call update functions of other objects
  this.update = function() {
    self.frog.update();
    self.log.forEach((log)=>log.update());
  }

  //initialize
  this.initialize = function(level) {

    self.frog = new frog(0,0);
    self.log.push(new log(-240, 270 + 30, 3 * level));
    self.log.push(new log(0,    210 + 30, -3 * level));
    self.log.push(new log(450,  150 + 30, 3*level));

    self.log.push(new log(-240 + 600,   270 + 30, 3*level));
    self.log.push(new log(0 + 600,      210 + 30, -3*level));
    self.log.push(new log(450 + 600,    150 + 30, 3*level));



      $(document).keydown(function(event){
          if(event.code=="ArrowUp") {
              event.preventDefault();
              self.frog.move(0,1);
          }
          else if(event.code=="ArrowDown") {
              event.preventDefault();
              self.frog.move(0,-1);
          }
          else if(event.code=="ArrowLeft") {
              event.preventDefault();
              self.frog.move(-1,0);
          }
          else if(event.code=="ArrowRight") {
              event.preventDefault();
              self.frog.move(1,0);
          }
      });

      updateInterval = setInterval(this.update,20);
  }

  this.initialize(1);
}




//frog class
var frog = function(x,y) {
  var self = this;
  this.xPos = x;
  this.yPos = y;
  this.speed = 60;

  this.update = function() {
    // enforce gameboard bounds
    // assumes (0,0) is the bottom center
    if(self.xPos < -gameBoardWidth/2 + 30) {
        self.xPos = -gameBoardWidth/2 + 30;
    }
    else if(self.xPos > gameBoardWidth/2 - 30) {
        self.xPos = gameBoardWidth/2 - 30;
    }

    if(self.yPos < 0) {
        self.yPos = 0;
    }
    else if(self.yPos > gameBoardHeight-60) {
        self.yPos = gameBoardHeight-60;
    }

    // check if the frog has reached the top of the gameboard
    if (self.yPos == gameBoardHeight - 60) {
        level++;
        console.log("Level " + level); // would update the HTML object displaying the level here
        //reset position
        froggerGame.initialize(level);
      }

    $('#frog').css("top",-self.yPos+"px"); //note the negative sign; necessary so up is up and down is down; for some reason using the css property "bottom" didn't work right
    $('#frog').css("left",self.xPos+"px");
    console.log("frog x",self.xPos);
    console.log("frog y",self.yPos);
  }

  // moves the frog by speed * each multiplier passed in
  // example: move(1,0) moves the frog [speed] to the right
  this.move = function(xMult,yMult) {
    self.xPos += self.speed * xMult;
    self.yPos += self.speed * yMult;
  }
}




//log class
var log = function (x,y,speedVector){
    var self = this;
    this.xPos = x;
    this.yPos = y;
    this.speedVector = speedVector;
    this.length = 240;
    this.obj=undefined;
    this.update = function(){

        this.move();

        if(self.xPos < -this.length) {
            self.xPos = gameBoardWidth;
        }

        if(self.xPos > gameBoardWidth) {
            self.xPos = -this.length;
        }

        
        this.obj.css("left",self.xPos+"px");
        this.obj.css("top",self.yPos+"px");
        console.log(self.xPos);
        console.log(self.yPos);
    }   

    this.move = function(){
        this.xPos += this.speedVector;
    }
    this.initialize=function(){
        this.obj=$('<div class="log"></div>').appendTo('.gameboard');
        this.update();
    }
    this.initialize();
}