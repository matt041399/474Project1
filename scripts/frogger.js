var gameBoardWidth = 60 * 15;
var gameBoardHeight = 60 * 13;
var level = 1;
var lives = 3;

var froggerGame = function () {
  var self = this;
  this.frog = undefined;
  this.log = [];
  this.taxi = [];
  this.updateInterval = undefined;
  this.levelTimeout = undefined;

  // update the game state and call update functions of other objects
  this.update = function () {
    self.frog.update(self.log, self.taxi);
    self.log.forEach((log) => log.update());
    self.taxi.forEach((taxi) => taxi.update());

    //go to next level if frog reaches the top
    if (self.levelTimeout == undefined && self.frog.hasReachedEnd()) {
      self.frog.active = false;
      self.levelTimeout = setTimeout(self.nextLevel, 1000); //frog pauses for 1 second before going to next level
    }

    if (self.frog.dead) {
      lives--;
      clearInterval(self.updateInterval); //temporarily stop moving things
      self.levelTimeout = setTimeout(self.resetLevel, 1000);
    }
  }

  this.nextLevel = function () {
    level++;
    self.destroyObjs();
    self.initializeObjects();
    self.levelTimeout = undefined;
  }

  this.resetLevel = function () {
    if(lives < 1) {
      self.gameOver();
    }
    else {
      self.destroyObjs();
      self.initializeObjects();
      self.updateInterval = setInterval(self.update, 20);
      self.levelTimeout = undefined;
    }
  }

  this.gameOver = function() {
    $('#lives-display').text("Lives: " + 0);
    $('#gameover-container').css('opacity','1');
    $('#gameover-container').css('visibility', 'visible');
  }

  this.destroyObjs = function () {
    self.frog = undefined;
    $(".log").remove();
    $(".taxi").remove();
    self.log = [];
    self.taxi = [];
  }

  this.initializeObjects = function () {
    self.frog = new frog(0, 0);

    //Logs start at random positions, but they all have the same speed
    self.log.push(new log((450*Math.random()), 270 + 30, 3 + level));
    self.log.push(new log((450*Math.random()), 210 + 30, -3 - level));
    self.log.push(new log((450*Math.random()), 150 + 30, 3 + level));

    self.log.push(new log((450*Math.random()) + 450, 270 + 30, 3 + level));
    self.log.push(new log((450*Math.random()) + 450, 210 + 30, -3 - level));
    self.log.push(new log((450*Math.random()) + 450, 150 + 30, 3 + level));

    //Cars start at same position, but have randomized speeds
    self.taxi.push(new taxi(-240, 450 + 30, ((Math.random()*10)) + (level)))
    self.taxi.push(new taxi(0, 510 + 30, ((Math.random()*-10)) - (level)))
    self.taxi.push(new taxi(-240, 570 + 30, ((Math.random()*10)) + (level)))

    $('#level-display').text("Level: " + level);
    $('#lives-display').text("Lives: " + lives);
  }

  //initialize
  this.initialize = function () {
    $(document).keydown(function (event) {
      if (event.code == "ArrowUp") {
        event.preventDefault();
        document.getElementById("frog").style.transform = "none";
        self.frog.move(0, 1);
        animateFrog();
      }
      else if (event.code == "ArrowDown") {
        event.preventDefault();
        document.getElementById("frog").style.transform = 'rotate(180deg)';
        self.frog.move(0, -1);
        animateFrog();
      }
      else if (event.code == "ArrowLeft") {
        event.preventDefault();
        document.getElementById("frog").style.transform = 'rotate(-90deg)';
        self.frog.move(-1, 0);
        animateFrog();
      }
      else if (event.code == "ArrowRight") {
        event.preventDefault();
        document.getElementById("frog").style.transform = 'rotate(90deg)';
        self.frog.move(1, 0);
        animateFrog();
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
  this.active = true;
  this.onLog = false;
  this.dead = false;

  this.update = function (logList, taxiList) {
    if (!self.active) {
      return;
    }

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

    self.onLog = false;
    //Check frogs position against logs position. For some reason the Y value of the logs start from the bottom and the Y value of the frog starts from the top. Or maybe the other way around
    logList.forEach((log) => {
      if ((self.xPos + 450) > (log.xPos) && (self.xPos + 450) < (log.xPos + 240) && (720 - self.yPos) < (log.yPos + 30) &&
        (720 - self.yPos) > (log.yPos - 30)) {
        self.xPos += log.speedVector;
        self.onLog = true;
      }
    });
    //Checks if the frog is in the water and no on a log
    if (self.yPos == 420 || self.yPos == 480 || self.yPos == 540) {
      if (self.onLog == false) {
        self.die();
      }
    }

    taxiList.forEach((taxi) => {
      if ((self.xPos + 450) > (taxi.xPos) && (self.xPos + 450) < (taxi.xPos + taxi.length) && (720 - self.yPos) < (taxi.yPos + 30) &&
        (720 - self.yPos) > (taxi.yPos - 30)) {
        console.log("Dead Frog");
        self.die();
      }
    });

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
    if (!self.active) {
      return;
    }

    self.xPos += self.speed * xMult;
    self.yPos += self.speed * yMult;
  }

  // this is a separate function in case we want to add death animations or something
  this.die = function () {
    self.dead = true;
  }
}

function animateFrog() {
  var i = 1; // frog image counter
  var id = setInterval(frame, 30);
  function frame() {
    if (i == 8) {
      clearInterval(id);
    } else {
      document.getElementById("frog").src = "images/frog" + i + ".png";
      i++;
    }
  }
}

//log class
var log = function (x, y, speedVector) {
  var self = this;
  this.xPos = x;
  this.yPos = y;
  this.speedVector = speedVector;
  this.length = 240;
  this.obj = undefined;
  this.update = function () {

    this.move();

    if (self.xPos < -this.length) {
      self.xPos = gameBoardWidth;
    }

    if (self.xPos > gameBoardWidth) {
      self.xPos = -this.length;
    }


    this.obj.css("left", self.xPos + "px");
    this.obj.css("top", self.yPos + "px");

  }

  this.move = function () {
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
    this.obj = $('<div class="log"><img src = "images/log.png"></div>').appendTo('.gameboard');
    this.update();
  }
  this.initialize();
}

//taxi class
var taxi = function (x, y, speedVector) {
  var self = this;
  this.xPos = x;
  this.yPos = y;
  this.speedVector = speedVector;
  this.length = 120;
  this.obj = undefined;
  this.update = function () {

    this.move();

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
    var rand = Math.random() * 100;
    if (this.speedVector > 0) {
      if (rand <= 33) {
        this.obj = $('<div class="taxi"><img src = "images/blue_car.png"></div>').appendTo('.gameboard');
      } else if (rand <= 66) {
        this.obj = $('<div class="taxi"><img src = "images/green_car.png"></div>').appendTo('.gameboard');
      } else {
        this.obj = $('<div class="taxi"><img src = "images/taxi.png"></div>').appendTo('.gameboard');
      }
    } else {
      if (rand <= 33) {
        this.obj = $('<div class="taxi"><img src = "images/blue_car_reverse.png"></div>').appendTo('.gameboard');
      } else if (rand <= 66) {
        this.obj = $('<div class="taxi"><img src = "images/green_car_reverse.png"></div>').appendTo('.gameboard');
      } else {
        this.obj = $('<div class="taxi"><img src = "images/taxi_reverse.png"></div>').appendTo('.gameboard');
      }
    }
    this.update();
  }
  this.initialize();
}