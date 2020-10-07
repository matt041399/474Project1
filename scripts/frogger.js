var gameBoardWidth = 60 * 15;
var gameBoardHeight = 60 * 13;
var level = 1;

var froggerGame = function () {
  var self = this;
  this.frog = undefined;
  this.log = [];
  this.updateInterval = undefined;

  // update the game state and call update functions of other objects
  this.update = function () {
    self.frog.update(self.log);
    self.log.forEach((log) => log.update());

    if (self.frog.hasReachedEnd()) { //check if frog has reached the top
      level++;
      self.destroyObjs();
      self.initializeObjects();
    }
  }

  this.destroyObjs = function () {
    self.frog = undefined;
    $(".log").remove();
    self.log = [];
    // will need to do the same for cars here as well
  }

  this.initializeObjects = function () {
    self.frog = new frog(0, 0);

    self.log.push(new log(-240, 270 + 30, 3 * level));
    self.log.push(new log(0, 210 + 30, -3 * level));
    self.log.push(new log(450, 150 + 30, 3 * level));

    self.log.push(new log(-240 + 600, 270 + 30, 3 * level));
    self.log.push(new log(0 + 600, 210 + 30, -3 * level));
    self.log.push(new log(450 + 600, 150 + 30, 3 * level));
  }

  //initialize
  this.initialize = function () {
    $(document).keydown(function (event) {
      if (event.code == "ArrowUp") {
        event.preventDefault();
        self.frog.move(0, 1);
      }
      else if (event.code == "ArrowDown") {
        event.preventDefault();
        self.frog.move(0, -1);
      }
      else if (event.code == "ArrowLeft") {
        event.preventDefault();
        self.frog.move(-1, 0);
      }
      else if (event.code == "ArrowRight") {
        event.preventDefault();
        self.frog.move(1, 0);
      }
    });

    self.updateInterval = setInterval(this.update, 20);

    this.initializeObjects();
  }

  this.initialize();
}

//frog class
var frog = function (x, y) {
  var self = this;
  this.xPos = x;
  this.yPos = y;
  this.speed = 60;
  this.onLog = false;


  this.update = function(logList) {
    // enforce gameboard bounds
    // assumes (0,0) is the bottom center
    if (self.xPos < -gameBoardWidth / 2 + 30) {
      self.xPos = -gameBoardWidth / 2 + 30;
    }
    else if (self.xPos > gameBoardWidth / 2 - 30) {
      self.xPos = gameBoardWidth / 2 - 30;
    }

    if (self.yPos < 0) {
      self.yPos = 0;
    }
    else if (self.yPos > gameBoardHeight - 60) {
      self.yPos = gameBoardHeight - 60;
    }

    // check if the frog has reached the top of the gameboard
    if (self.yPos == gameBoardHeight - 60) {
        level++;
        //console.log("Level " + level); // would update the HTML object displaying the level here
        //reset position
        froggerGame.initialize(level);
    }
    self.onLog = false;
    //Check frogs position against logs position. For some reason the Y value of the logs start from the bottom and the Y value of the frog starts from the top. Or maybe the other way around
   logList.forEach((log)=>{
        if((self.xPos+450)>(log.xPos) && (self.xPos+450)<(log.xPos+240) && (720-self.yPos)<(log.yPos+30) && (720-self.yPos)>(log.yPos-30)){
            self.xPos += log.speedVector;
            self.onLog = true;
          }
    });
    //Checks if the frog is in the water and no on a log
    if(self.yPos==420 || self.yPos==480 || self.yPos == 540){
      if(self.onLog==false){
        console.log("DED");
      }
    }

    $('#frog').css("top", -self.yPos + "px"); //note the negative sign; necessary so up is up and down is down; for some reason using the css property "bottom" didn't work right
    $('#frog').css("left", self.xPos + "px");
    console.log("frog x", self.xPos);
    console.log("frog y", self.yPos);
  }

  this.hasReachedEnd = function () {
    return self.yPos == gameBoardHeight - 60;
  }

  // moves the frog by speed * each multiplier passed in
  // example: move(1,0) moves the frog [speed] to the right
  this.move = function (xMult, yMult) {
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

    }   

    this.move = function(){
        this.xPos += this.speedVector;
    if (self.xPos < -this.length) {
      self.xPos = gameBoardWidth;
    }

    if (self.xPos > gameBoardWidth) {
      self.xPos = -this.length;
    }

    this.obj.css("left", self.xPos + "px");
    this.obj.css("top", self.yPos + "px");
    console.log(self.xPos);
    console.log(self.yPos);
  }

  this.move = function () {
    this.xPos += this.speedVector;
  }
  this.initialize = function () {
    this.obj = $('<div class="log"></div>').appendTo('.gameboard');
    this.update();
  }
  this.initialize();
}